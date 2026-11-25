import mongoose from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/enum";
import { IUser } from "../../common/interface";
import { HydratedDocument } from "mongoose";
import { encryption, hash } from "../../common/security";

const userSchema = new mongoose.Schema<IUser>({
    firstName: {
        type: String,
        minLength: 2,
        maxLength: 25,
        required: true
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 25,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function (): boolean {
            return this.provider == ProviderEnum.SYSTEM
        }
    },
    gender: {
        type: Number,
        default: GenderEnum.MALE,
        enum: GenderEnum
    },
    role: {
        type: Number,
        default: RoleEnum.USER,
        enum: RoleEnum
    },
    provider: {
        type: Number,
        enum: ProviderEnum,
        default: ProviderEnum.SYSTEM,
    },
    phone: String,
    DOB: Date,
    confirmationMail: Date,
    image: String,
    coverImage: [String],
    changeCredentialsTime: Date

}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    strict: true,
    strictQuery: true,
    autoIndex: true,
})

userSchema.virtual("username").set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({ firstName, lastName })
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})

userSchema.pre('save', async function () {
    // if (this.isModified("passsword")) {
    //     this.password = await hash(this.password);
    // }
    // if (this.isModified("phone")) {
    //     this.phone = await encryption(this.phone);
    // }
})

export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
export type HUser = HydratedDocument<IUser>