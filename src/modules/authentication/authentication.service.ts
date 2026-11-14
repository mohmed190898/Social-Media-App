import { EmailSubjectEnum } from './../../common/enum/email.enum';
import { HUser, UserModel } from './../../DB/model/user.model';
import { IUser } from './../../common/interface/user.interface';
import { ConfirmEmailDto, ISignupDto, ResendConfirmEmailDto } from "./dto/authentication.dto";
import { ConflictException, NotFoundException, TooManyException } from '../../common/exception';
import { UserRepository } from '../../common/repository/user.repository';
import { cacheService, CacheService } from '../../common/service';
import { compare, encryption, hash } from '../../common/security';
import { emailEvent, UserEmailHashedKey, UserEmailHashedTrialsKey } from '../../common/utilis/email';
import { createOtp } from '../../common/utilis/otps';
import { ProviderEnum } from '../../common/enum';

export class AuthenticationService {
    private userRepository: UserRepository
    public name: string = "ali"
    private cacheService: CacheService;
    constructor() {
        this.cacheService = cacheService;
        this.userRepository = new UserRepository();
    };

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



    // signup = async ({ email, password, phone, username }: ISignupDto['body']): Promise<IUser> => {
    //     await this.cacheService.set({ key: "name", value: "mohamed" })
    //     const userExist = await this.userRepository.findOne({
    //         filter: { email },
    //         projection: { email: 1 },
    //         options: { lean: true }
    //     });
    //     console.log(userExist)
    //     if (userExist) {
    //         throw new ConflictException("User Already Exist please try another email")
    //     }
    //     const account: HUser = await this.userRepository.createOne({
    //         data: {
    //             email,
    //             password: await hash(password),
    //             phone: await encryption(phone),
    //             username
    //         },
    //         options: { validateBeforeSave: true }
    //     })
    //     return account;
    // }
}
export default new AuthenticationService()