// export interface ISignupDto{
//     username:string;
//     email:string;
//     phone:string;
//     password:string;
//     confirmPassword:string;

import mongoose, { Types } from "mongoose";

// import { confirmEmail, login, resendConfirmEmail, signupSchema } from "../authentication.validation";
// import { z } from "zod";

// }
export interface createCommentDto {
    content: string,
    attachments?: string[],
    createdBy: Types.ObjectId,
    postId: Types.ObjectId
}
// export type ISignupDto = z.infer<ReturnType<typeof signupSchema>>
// export type ConfirmEmailDto = z.infer<ReturnType<typeof confirmEmail>>['body']
// export type ResendConfirmEmailDto = z.infer<ReturnType<typeof resendConfirmEmail>>['body']
// export type LoginDto = z.infer<ReturnType<typeof login>>['body']