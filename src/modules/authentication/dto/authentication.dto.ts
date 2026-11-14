// export interface ISignupDto{
//     username:string;
//     email:string;
//     phone:string;
//     password:string;
//     confirmPassword:string;

import { confirmEmail, resendConfirmEmail, signupSchema } from "../authentication.validation";
import { z } from "zod";

// }

export type ISignupDto = z.infer<ReturnType<typeof signupSchema>>
export type ConfirmEmailDto = z.infer<ReturnType<typeof confirmEmail>>['body']
export type ResendConfirmEmailDto = z.infer<ReturnType<typeof resendConfirmEmail>>['body']