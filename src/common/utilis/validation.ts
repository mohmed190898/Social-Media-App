import { z } from "zod";
import mongoose from "mongoose";
import { GenderEnum, LanguageEnum } from "../enum";

const validationMessages = {
    username: {
        ar: "عفوا يجب ادخال ما لا يقل عن حرفين اثنين",
        en: "min length is 2 charachters"
    }
}
// const getValidationMessages = (lang, code) => {
//     return lang == LanguageEnum.AR ? validationMessages[code].ar : validationMessages[code].en
// }

const matchFileds = ({ original, copy, data, ctx, lang }:
    { original: string, copy: string, data: any, ctx: z.RefinementCtx, lang?: LanguageEnum }) => {
    if (data[original] != data[copy]) {
        ctx.addIssue({
            code: "custom",
            path: [copy],
            message: lang == LanguageEnum.AR ? `فشل التطابق بين كلا من ${original} و ${copy}` : `${original} mismatch with ${copy}`
        })
    }
}

export const generalValidation = {
    email: (lang: LanguageEnum) => z.email({ message: "Invalid email foramte please insert valid data like example@gmail.com" }),
    password: (lang: LanguageEnum) => z.string().min(8).max(16),
    username: (lang: LanguageEnum) => z.string().min(2, { message: lang == LanguageEnum.AR ? validationMessages.username.ar : validationMessages.username.en }),
    phone: (lang: LanguageEnum) => z.e164(),
    confirmPassword: (lang: LanguageEnum) => z.string().min(8).max(16),
    gender: (lang: LanguageEnum) => z.union([z.literal(GenderEnum.MALE), z.literal(GenderEnum.FEMALE)]),
    matchFileds,
    otp: (lang: LanguageEnum) => z.string().regex(/^\d{6}$/, { error: "Invalid Code" }),
    id: (lang: LanguageEnum) => z.string().refine((data) => { return mongoose.Types.ObjectId.isValid(data) }, { message: "Invalid format" }),
    file: (lang: LanguageEnum) => z.strictObject({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        buffer: z.instanceof(Buffer),
        size: z.number(),
        path: z.string(),
    })
}