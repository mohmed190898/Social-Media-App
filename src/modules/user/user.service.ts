import { LogOutEnum } from "../../common/enum";
import { ConflictException } from "../../common/exception";
import { UserRepository } from "../../common/repository";
import { cacheService, CacheService, JwtPayloadType, tokenService, TokenService } from "../../common/service";
import { ACCESS_TOKEN_EXPIRES_IN } from "../../config";
import { HUser } from "../../DB/model";

export class UserService {
    private readonly cacheService: CacheService
    private readonly userRepository: UserRepository
    private readonly tokenService: TokenService


    constructor() {
        this.cacheService = cacheService;
        this.userRepository = new UserRepository();
        this.tokenService = tokenService;
    }

    // async update(user, data) {
    //     const account = await findByIdAndUpdate({
    //         id: user._id,
    //         update: data
    //     })
    //     return account
    // }

    async rotateToken(payload: JwtPayloadType, user: HUser, issuer: string) {
        const accessExpiresIn = (payload.iat + ACCESS_TOKEN_EXPIRES_IN) * 1000
        const currentTime = Date.now() + (30 * 60000)

        if (currentTime < accessExpiresIn) {
            throw new ConflictException("Sorry we can't create new login credentials while the old one is already not expired")
        }
        const data = await this.tokenService.createLoginCredentials({ user, issuer })
        await this.tokenService.createRevokeToken({ payload })
        return data;
    }

    async logout(payload: JwtPayloadType, user: HUser, { action = LogOutEnum.DEVICE }: { action: LogOutEnum }) {

        switch (action) {
            case LogOutEnum.ALL:
                user.changeCredentialsTime = new Date();
                await user.save()
                const prefix = this.tokenService.userBaseRevokeTokenKey({ userId: payload.sub })
                await this.cacheService.del({
                    key: await this.cacheService.keys({ prefix })
                })
                break;
            default:
                await this.tokenService.createRevokeToken({ payload })
                break;
        }
        return;
    }
}

export const userService = new UserService();