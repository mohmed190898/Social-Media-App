import { EmailSubjectEnum } from './../../common/enum/email.enum';
import { HUser, UserModel } from './../../DB/model/user.model';
import { IUser } from './../../common/interface/user.interface';
import { ConfirmEmailDto, ISignupDto, LoginDto, ResendConfirmEmailDto } from "./dto/authentication.dto";
import { BadException, ConflictException, NotFoundException, TooManyException } from '../../common/exception';
import { UserRepository } from '../../common/repository/user.repository';
import { cacheService, CacheService } from '../../common/service';
import { compare, decryption, encryption, hash } from '../../common/security';
import { emailEvent, UserEmailHashedKey, UserEmailHashedTrialsKey } from '../../common/utilis/email';
import { createOtp } from '../../common/utilis/otps';
import { ProviderEnum } from '../../common/enum';
import { tokenService, TokenService } from '../../common/service';
import { ILoginResponse, ISignupWithGmailResponse } from './entities/authentication.entities';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { WEB_CLIENT_IDS } from '../../config';

export class AuthenticationService {
    private userRepository: UserRepository
    public name: string = "ali"
    private cacheService: CacheService;
    private tokenService: TokenService;
    private client: OAuth2Client;
    constructor() {
        this.cacheService = cacheService;
        this.tokenService = tokenService;
        this.userRepository = new UserRepository();
        this.client = new OAuth2Client();
    };

    async verifyGoogleAccount(idToken: string): Promise<TokenPayload> {
        const ticket = await this.client.verifyIdToken({
            idToken,
            audience: WEB_CLIENT_IDS
        });
        const payload = ticket.getPayload();
        if (!payload?.email_verified) {
            throw new BadException("Fail to verify this google account");
        }
        return payload
    }
    async signupWithGmail({ idToken }: { idToken: string }, issuer: string): Promise<ISignupWithGmailResponse> {
        const { name, email, picture } = await this.verifyGoogleAccount(idToken)
        const accountExist = await this.userRepository.findOne({
            filter: { email: email as string },
        })
        if (accountExist) {
            if (accountExist.provider != ProviderEnum.GOOGLE) {
                throw new ConflictException(`Invalid Account Provider`)
            }
            return { status: 200, data: await this.tokenService.createLoginCredentials({ user: accountExist, issuer }) }
        }
        const user = await this.userRepository.createOne({
            data: {
                email,
                username: name,
                confirmationMail: new Date(),
                provider: ProviderEnum.GOOGLE,
                image: picture,
            }
        })
        return { status: 201, data: await this.tokenService.createLoginCredentials({ user, issuer }) }
    }

    async sendEmailOtp({ email, subject, expiresIn = 120, maxTrials = 3, blockInSeconds = 300 }: { email: string, subject: EmailSubjectEnum, expiresIn?: number, maxTrials?: number, blockInSeconds?: number }) {
        const existOtp_TTL = await this.cacheService.ttl({ key: UserEmailHashedKey({ email, subject }) })
        if (existOtp_TTL > 0) {
            throw new ConflictException(`cannot send otp as the old one still alive and expires after ${existOtp_TTL}`)
        }
        const oldTrials = await this.cacheService.get({ key: UserEmailHashedTrialsKey({ email, subject }) }) ?? 0
        if (oldTrials >= maxTrials) {
            throw new TooManyException("Max OTP trials has been watched")
        }
        const code = createOtp();
        // save the OTP in cache with 2 min TTL
        await this.cacheService.set({
            key: UserEmailHashedKey({
                email,
                subject
            }),
            value: await hash(code.toString()),
            ttl: expiresIn
        })
        const currentTrials = await this.cacheService.incrBy({ key: UserEmailHashedTrialsKey({ email, subject }) })
        if (currentTrials == maxTrials) {
            await this.cacheService.expire({ key: UserEmailHashedTrialsKey({ email, subject }), ttl: blockInSeconds })
        }
        // send the otp to the user email with subject confirm email and the otp code
        emailEvent.emit("sendEmail", {
            recieptions: { to: email },
            subject,
            data: { code }
        })
    }
    async signup({ email, password, username, phone }: ISignupDto['body']): Promise<IUser> {
        // check if the account exist before if exist throw error with dupliaction
        const duplicatedAccount = await this.userRepository.findOne({
            filter: { email },
        })
        if (duplicatedAccount)
            throw new ConflictException("Email Exist")
        // if the account not exist create new user and create OTP
        const newUserAccount = await this.userRepository.createOne({
            data: {
                email,
                password: await hash(password),
                username,
                phone: await encryption(phone)
            }
        })
        // create random number As OTP
        await this.sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL });
        return newUserAccount
    }
    async confirmEmail({ otp, email }: ConfirmEmailDto): Promise<void> {
        // check if the account exist 
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provide: ProviderEnum.SYSTEM,
                confirmationMail: { $exists: false }
            },
        })
        if (!account) {
            throw new NotFoundException("Invalid Account")
        }
        // if the account exist get the OTP of the account from cache 
        const otpKey = UserEmailHashedKey({
            email,
            subject: EmailSubjectEnum.CONFIRM_EMAIL
        })
        const hashOtp = await this.cacheService.get({ key: otpKey })
        // Compare hashOtp[saved in redis hashed] with the OTP sent by the user[plain text] 
        // if not match throw error
        if (!hashOtp || ! await compare(otp, hashOtp)) {
            throw new ConflictException("Invalid Otp")
        }
        account.confirmationMail = new Date() as unknown as string;
        await account.save();

        // await del({ keys: otpKey })
        await this.cacheService.del({
            key: await this.cacheService.keys({ prefix: UserEmailHashedKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) })
        })
        return;
    }

    async resendConfirmEmail({ email }: ResendConfirmEmailDto): Promise<void> {
        // check if the account exist 
        const account = await this.userRepository.findOne({
            filter: {
                email,
                provide: ProviderEnum.SYSTEM,
                confirmationMail: { $exists: false }
            },
        })

        if (!account) {
            throw new NotFoundException("Invalid Account Or confirmed Email Already")
        }
        await this.sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL })
        return;
    }

    async login({ email, password }: LoginDto, issuer: string): Promise<ILoginResponse> {
        const account = await this.userRepository.findOne({
            filter: { email, provider: ProviderEnum.SYSTEM, confirmationMail: { $exists: true } },
        })
        console.log({ account })

        if (!account) throw new NotFoundException("In-Valid User Credentials")
        const match = await compare(password, account.password)
        console.log(match)
        if (!match) throw new NotFoundException("In-Valid User Credentials", { extra: "kill" })
        return await this.tokenService.createLoginCredentials({ user: account, issuer })
    }

}
export default new AuthenticationService()