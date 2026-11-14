import { FACEBOOK, INSTAGRAM, TWITTER } from './../../../config';
import { EmailSubjectEnum } from "../../enum/email.enum";

export const templates = {
    [EmailSubjectEnum.CONFIRM_EMAIL]: (data: any) => {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Email</title>
    <style>
        body {
            background-color: #88BDBF;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #88BDBF;">

    <table border="0" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <table
                    border="0"
                    width="50%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        margin: 30px auto;
                        padding: 30px;
                        background-color: #F3F3F3;
                        border: 1px solid #630E2B;
                    "
                >

                    <tr>
                        <td>
                            <table border="0" width="100%">
                                <tr>
                                    <td>
                                        <img
                                            width="100px"
                                            src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"
                                            alt="Logo"
                                        />
                                    </td>

                                    <td style="text-align: right;">
                                        <a
                                            href="http://localhost:4200/#/"
                                            target="_blank"
                                            style="text-decoration: none;"
                                        >
                                            View In Browser
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="text-align: center; background-color: #fff;"
                            >
                                <tr>
                                    <td
                                        style="
                                            background-color: #630E2B;
                                            height: 100px;
                                            font-size: 50px;
                                            color: #fff;
                                        "
                                    >
                                        <img
                                            width="50px"
                                            height="50px"
                                            src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3v.png"
                                            alt="Email Icon"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h1 style="padding-top: 25px; color: #630E2B;">
                                            ${data.title}
                                        </h1>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p style="padding: 0 30px;">
                                            Hello ${data.userName || "there"},
                                            <br />
                                            Thank you for joining us!
                                            Please confirm your email address
                                            by clicking the button below.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p
                                            style="
                                                margin: 10px 0 30px;
                                                border-radius: 4px;
                                                padding: 10px 20px;
                                                color: #fff;
                                                background-color: #630E2B;
                                                display: inline-block;
                                            "
                                        >
                                        ${data.code}
                                                
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table
                                border="0"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                style="
                                    border-radius: 5px;
                                    text-align: center;
                                "
                            >
                                <tr>
                                    <td>
                                        <p style="color: #630E2B;">
                                            Follow us on social media
                                        </p>

                                        <a href="${FACEBOOK}" target="_blank">
                                            Facebook
                                        </a>
                                        &nbsp; | &nbsp;

                                        <a href="${INSTAGRAM}" target="_blank">
                                            Instagram
                                        </a>
                                        &nbsp; | &nbsp;

                                        <a href="${TWITTER}" target="_blank">
                                            Twitter
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p style="font-size: 12px; color: #777;">
                                            If you did not create an account,
                                            you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
        </html>`;
    },
    [EmailSubjectEnum.FORGOT_PASSWORD]: (data: any) => {
        return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirm Email</title>
    <style>
        body {
            background-color: #88BDBF;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
        }
    </style>
</head>

<body style="margin: 0; padding: 0; background-color: #88BDBF;">

    <table border="0" width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <table
                    border="0"
                    width="50%"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        margin: 30px auto;
                        padding: 30px;
                        background-color: #F3F3F3;
                        border: 1px solid #630E2B;
                    "
                >

                    <tr>
                        <td>
                            <table border="0" width="100%">
                                <tr>
                                    <td>
                                        <img
                                            width="100px"
                                            src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"
                                            alt="Logo"
                                        />
                                    </td>

                                    <td style="text-align: right;">
                                        <a
                                            href="http://localhost:4200/#/"
                                            target="_blank"
                                            style="text-decoration: none;"
                                        >
                                            View In Browser
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                style="text-align: center; background-color: #fff;"
                            >
                                <tr>
                                    <td
                                        style="
                                            background-color: #630E2B;
                                            height: 100px;
                                            font-size: 50px;
                                            color: #fff;
                                        "
                                    >
                                        <img
                                            width="50px"
                                            height="50px"
                                            src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3v.png"
                                            alt="Email Icon"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h1 style="padding-top: 25px; color: #630E2B;">
                                            ${data.title}
                                        </h1>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p style="padding: 0 30px;">
                                            Hello ${data.userName || "there"},
                                            <br />
                                            Thank you for joining us!
                                            Please confirm your email address
                                            by clicking the button below.
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p
                                            style="
                                                margin: 10px 0 30px;
                                                border-radius: 4px;
                                                padding: 10px 20px;
                                                color: #fff;
                                                background-color: #630E2B;
                                                display: inline-block;
                                            "
                                        >
                                            ${data.code}
                                                
                                            </a>
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td>
                            <table
                                border="0"
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                style="
                                    border-radius: 5px;
                                    text-align: center;
                                "
                            >
                                <tr>
                                    <td>
                                        <p style="color: #630E2B;">
                                            Follow us on social media
                                        </p>

                                        <a href="${FACEBOOK}" target="_blank">
                                            Facebook
                                        </a>
                                        &nbsp; | &nbsp;

                                        <a href="${INSTAGRAM}" target="_blank">
                                            Instagram
                                        </a>
                                        &nbsp; | &nbsp;

                                        <a href="${TWITTER}" target="_blank">
                                            Twitter
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p style="font-size: 12px; color: #777;">
                                            If you did not create an account,
                                            you can safely ignore this email.
                                        </p>
                                    </td>
                                </tr>

                            </table>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
        </html>`;
    }
};

export const verifyEmailTemplate = <T = any>(data: T & { subject: EmailSubjectEnum }) => {
    return templates[data.subject](data);
};
