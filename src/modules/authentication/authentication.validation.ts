import { z } from "zod";
import { LanguageEnum } from "../../common/enum";
import { generalValidation } from "../../common/utilis/validation";


export const loginSchema = (lang: LanguageEnum) => {
    return z.strictObject({
        email: generalValidation.email(lang),
        password: generalValidation.password(lang)
    })
}
export const login = (lang: LanguageEnum) => {
    return z.object({
        body: loginSchema(lang)
    })
}
export const signupSchema = (lang: LanguageEnum) => {
    return z.object({
        body: loginSchema(lang).safeExtend({
            username: generalValidation.username(lang),
            phone: generalValidation.phone(lang),
            confirmEmail: generalValidation.email(lang),
            gender: generalValidation.gender(lang),
            confirmPassword: generalValidation.password(lang)
        })
    }).superRefine((data, ctx) => {
        generalValidation.matchFileds({
            original: "password",
            copy: "confirmPassword",
            data: data.body,
            ctx,
            lang
        })

        if (!data.body.username.includes(" ")) {
            ctx.addIssue({
                code: "custom",
                path: ["body", "username"],
                message: "username must contain 2 parts "
            })
        }
    })
}

export const confirmEmail = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            email: generalValidation.email(lang),
            otp: generalValidation.otp(lang),
        })
    })
}
export const resendConfirmEmail = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            email: generalValidation.email(lang),

        })
    })
}
export const resetPassword = (lang: LanguageEnum) => {
    return z.object({
        body: z.strictObject({
            email: generalValidation.email(lang),
            otp: generalValidation.otp(lang),
            password: generalValidation.password(lang),
            confirmPassword: generalValidation.password(lang)
        })
    }).superRefine((data, ctx) => {
        generalValidation.matchFileds({ original: "password", copy: "confirmPassword", data, ctx, lang })
    })
}