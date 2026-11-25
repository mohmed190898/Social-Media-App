// export interface ISignupDto{
//     username:string;
//     email:string;
//     phone:string;
//     password:string;
//     confirmPassword:string;

import mongoose from "mongoose";

// import { confirmEmail, login, resendConfirmEmail, signupSchema } from "../authentication.validation";
// import { z } from "zod";

// }
export interface createPostDto {
    content: string,
    attachements?: string[],
}
// export type ISignupDto = z.infer<ReturnType<typeof signupSchema>>
// export type ConfirmEmailDto = z.infer<ReturnType<typeof confirmEmail>>['body']
// export type ResendConfirmEmailDto = z.infer<ReturnType<typeof resendConfirmEmail>>['body']
// export type LoginDto = z.infer<ReturnType<typeof login>>['body']