import nodemailer from 'nodemailer';
import fs from 'fs';
import ejs from 'ejs';
import { htmlToText } from 'html-to-text';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// directory set
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class Email {
    constructor(user, url, resetUri) {
        this.from = 'Ajith kumar s <ajithskumar1609@gmail.com>';
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.resetUri = resetUri;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // SendGrid
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.SENDGRID_USERNAME,
                    pass: process.env.SENDGRID_PASSWORD,
                },
            });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(template, subject, defaultValue = '') {
        //1)read the template
        const readTemplate = fs.readFileSync(
            `${__dirname}/../views/Email/${template}.ejs`,
            'utf-8',
        );

        // console.log(readTemplate);

        // 2) template compile in ejs

        const compiledTemplate = ejs.compile(readTemplate);

        // 3) Render template with data

        const html = compiledTemplate({
            firstName: this.firstName,
            url: this.url,
            defaultValue: defaultValue,
            subject: subject,
        });

        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            html: html,
            text: htmlToText(html),
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendOtp(otpGenerate) {
        await this.send(
            'otp',
            `Your One-Time Password ${otpGenerate} Verification Code`,
            otpGenerate,
        );
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to TripSyn Family');
    }

    async sendResetPassword() {
        await this.send('forgotPassword', 'Reset Your Password');
    }
}

export default Email;

// const sendEmail = async (options, res) => {
//     try {
//         // transporter
//         const transporter = nodemailer.createTransport({
//             host: process.env.EMAIL_HOST,
//             port: process.env.EMAIL_PORT,
//             auth: {
//                 user: process.env.EMAIL_USERNAME,
//                 pass: process.env.EMAIL_PASSWORD,
//             },
//         });

//         transporter.verify((error) => {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log('server ready to message');
//             }
//         });

//         const mailOptions = {
//             from: 'Ajith Kumar s <ajithskumar1609@gmail.com>',
//             to: options.email,
//             subject: options.subject,
//             text: options.text,
//         };

//         await transporter.sendMail(mailOptions);

//         res.status(200).json({
//             status: 'Success',
//             message: 'Mail sent successfully',
//         });
//     } catch (err) {
//         console.log(`Error 🔥 ${err.message}`);
//     }
// };
