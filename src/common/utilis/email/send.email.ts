import nodemailer from "nodemailer";
import { APP_EMAIL, APPLICATION_NAME } from "../../../config";
import { BadException } from "../../exception";
import { EmailSubjectEnum } from "../../enum";

export const UserEmailHashedKey = ({ email, subject }: { email: string, subject: EmailSubjectEnum }): string => {
    return `User::${email}::${subject}::OTP`
}
export const UserEmailHashedTrialsKey = ({ email, subject }: { email: string, subject: EmailSubjectEnum }) => {
    return `${UserEmailHashedKey({ email, subject })}::Trials`
}

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.APP_EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});
export const sendEmail = async ({ to, cc, bcc, subject, text, html, attachments = [] }: {
    to?: string[], cc?: string[], bcc?: string[], subject: string, text?: string, html?: string, attachments?: any[]
}) => {

    try {
        if (!to?.length && !cc?.length && !bcc?.length) {
            throw new BadException("Missing email reciptions")
        }
        if (!html?.length && !text?.length && !attachments?.length) {
            throw new BadException("Missing email content")
        }
        const info = await transporter.sendMail({
            from: `"${APPLICATION_NAME}" <${APP_EMAIL}>`, // sender address
            to,
            cc,
            bcc,
            subject,
            text,
            html,
            attachments
        });
        // Preview URL is only available when using an Ethereal test account
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}

