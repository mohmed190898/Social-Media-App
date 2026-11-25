import mongoose from "mongoose";
import { UserRepository } from "../repository";
import { cacheService, CacheService } from "./cache.service";
import { ACCESS_ADMIN_TOKEN_SIGNATURE, ACCESS_TOKEN_EXPIRES_IN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE, REFRESH_TOKEN_EXPIRES_IN, REFRESH_USER_TOKEN_SIGNATURE } from "../../config";
import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { RoleEnum, TokenTypeEnum } from "../enum";
import { BadException, NotFoundException, UnAuthorizedException } from "../exception";
import { ToObjectId } from "../utilis";
import { randomUUID } from "crypto";
import { HUser } from "../../DB/model";
import { compare } from "../security";
type UserIdType = mongoose.Types.ObjectId | string
export type JwtPayloadType = JwtPayload & {
    sub: String;
    aud?: number[];
    jti: string;
    iat: number;
}
export class TokenService {
    private readonly userRepository: UserRepository;
    private readonly cacheService: CacheService;
    constructor() {
        this.cacheService = cacheService;
        this.userRepository = new UserRepository();
    }

    userBaseRevokeTokenKey({ userId }: { userId: UserIdType }): string {
        return `User::${userId.toString()}::RevokeToken`;
    }
    userRevokeTokenKey({ userId, jti }: { userId: UserIdType, jti: string }): string {
        return `${this.userBaseRevokeTokenKey({ userId })}::${jti}`;
    }
    async createToken({
        payload,
        options,
        secret = ACCESS_USER_TOKEN_SIGNATURE
    }: {
        payload: string | Buffer | object,
        secret: Secret,
        options?: SignOptions
    }): Promise<string> {
        return jwt.sign(payload, secret, options)
    }

    async verifyToken({
        authorization = "",
        secret = ACCESS_USER_TOKEN_SIGNATURE
    }: {
        authorization: string,
        secret: Secret,
    }): Promise<JwtPayloadType> {
        return jwt.verify(authorization, secret) as JwtPayloadType
    }

    async getSignatureByType({
        role = RoleEnum.USER
    }: {
        role: RoleEnum
    }): Promise<{ accessSingature: string, refreshSignature: string }> {
        let signatures: { accessSingature: string, refreshSignature: string };
        switch (role) {
            case RoleEnum.ADMIN:
                signatures = { accessSingature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE };
                break;
            default:
                signatures = { accessSingature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE };
                break;
        }
        return signatures
    }

    async getTokenSignature({
        tokenType = TokenTypeEnum.ACCESS,
        role = RoleEnum.USER }: {
            tokenType: TokenTypeEnum,
            role?: RoleEnum
        }): Promise<string> {
        const signatures = await this.getSignatureByType({ role })
        return tokenType == TokenTypeEnum.ACCESS ? signatures.accessSingature : signatures.refreshSignature
    }
    async decodeToken(
        {
            token = "",
            tokenType = TokenTypeEnum.ACCESS
        }: {
            token: string
            tokenType?: TokenTypeEnum
        }): Promise<{ user: HUser, payload: JwtPayloadType }> {
        const decoded = jwt.decode(token) as JwtPayloadType
        if (!decoded?.aud?.length) {
            throw new BadException("missing token payload")
        }

        const payload = await this.verifyToken({
            authorization: token,
            secret: await this.getTokenSignature({ tokenType, role: decoded.aud[0] as unknown as RoleEnum })
        })
        if (!payload.sub) {
            throw new BadException("missing token payload")
        }

        if (await this.cacheService.exist({ key: this.userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }) })) {
            throw new UnAuthorizedException("Token has been revoked")
        }

        const user = await this.userRepository.findById({
            id: ToObjectId(payload.sub)
        })
        if (!user) {
            throw new NotFoundException("Invalid user")
        }
        if (new Date(user.changeCredentialsTime ?? 0).getTime() > payload.iat * 1000) {
            throw new UnAuthorizedException("Token has been revoked")
        }
        return { user, payload }
    }
    async createLoginCredentials({
        user,
        issuer,
    }: {
        user: HUser,
        issuer: string,
    }): Promise<{ accessToken: string, refereshToken: string }> {
        const { accessSingature, refreshSignature } = await this.getSignatureByType({ role: user.role })
        const jwtid = randomUUID()
        const accessToken = await this.createToken({
            payload: {
                sub: user._id,
                jti: jwtid
            },
            secret: accessSingature,
            options: {
                issuer,
                audience: [user.role as unknown as string],
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            },
        })
        const refereshToken = await this.createToken({
            payload: {
                sub: user._id,
                jti: jwtid
            },
            options: {
                issuer,
                audience: [user.role as unknown as string],
                expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            },
            secret: refreshSignature
        })
        const userId = user._id
        return { accessToken, refereshToken }
    }

    async createRevokeToken({ payload }: { payload: JwtPayloadType }) {
        const consumedTime = (Math.ceil(Date.now() / 1000))
        const refreshExpiresIn = payload.iat + REFRESH_TOKEN_EXPIRES_IN
        // const ttl = payload.exp - consumedTime
        const ttl = refreshExpiresIn - consumedTime
        const key = this.userRevokeTokenKey({
            userId: payload.sub,
            jti: payload.jti
        })
        await this.cacheService.set({ key, value: payload.jti, ttl })
        return;
    }

    async basicAuth({ email, password }: { email: string, password: string }) {
        const account = await this.userRepository.findOne({
            filter: { email }
        })
        if (!account) {
            throw new NotFoundException("Invalid Login Data", { extra: "kill" })
        }
        const match = await compare(password, account.password)
        if (!match) {
            throw new NotFoundException("Invalid Login Data", { extra: "kill" })
        }
        return account
    }
}
export const tokenService = new TokenService();
// async basicAuth({ email, password }){
//     const account = await findOne({
//         model: UserModel,
//         filter: { email }
//     })
//     if(!account){
//         throw NotFoundException("Invalid Login Data",{extra:"kill"})
//     }
//     const match await compare(password,account.password)
//     if(!match){
//         throw NotFoundException("Invalid Login Data",{extra:"kill"})
//     }
//     return account
// }