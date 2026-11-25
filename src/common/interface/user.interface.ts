import { GenderEnum, ProviderEnum, RoleEnum } from "../enum";


export interface IUser {

    firstName: string,
    lastName: string,
    username?: string,
    email: string,
    password: string,
    gender: GenderEnum,
    role: RoleEnum,
    provider: ProviderEnum,
    phone?: string,
    DOB?: string,
    confirmationMail?: string,
    image?: string,
    coverImage?: string[],
    changeCredentialsTime: Date,
    createdAt?: Date,
    updatedAt?: Date,
}