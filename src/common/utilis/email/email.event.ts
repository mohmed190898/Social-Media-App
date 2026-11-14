import { EventEmitter } from 'node:events'
import { sendEmail } from './send.email';
import { verifyEmailTemplate } from './email.templates';
import { EmailSubjectEnum } from '../../enum';

export const emailEvent = new EventEmitter();

emailEvent.on("sendEmail", async ({
    recieptions,
    subject = EmailSubjectEnum.CONFIRM_EMAIL,
    data
}: {
    subject: EmailSubjectEnum,
    recieptions: { to?: string[], cc?: string[], bcc?: string[] },
    data: any
}) => {
    try {
        await sendEmail({
            ...recieptions,
            subject,
            html: verifyEmailTemplate({ subject, code: data.code, title: subject })
        })
    } catch (error) {
    }
})
