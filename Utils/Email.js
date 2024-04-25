import nodemailer from 'nodemailer';

class Email {
    constructor(user, url) {
        this.from = 'Ajith kumar s <ajithskumar1609@gmail.com>';
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'Production') {
            return 1;
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

    async send(subject, text) {
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject: subject,
            text: text,
        };

        await this.newTransport().sendMail(mailOptions);
    }

    async sendOtp(otpGenerate) {
        const subject = `One-Time otp ${otpGenerate} Verification`;
        const text = `Dear ${this.firstName},

        Your one-time password ${otpGenerate} for verification is: [OTP Code]. Please use this code within [time limit] minutes to complete your verification process.
        
        If you did not request this OTP, please ignore this message.
        
        Thank you,
        Ajith kumar s`;
        await this.send(subject, text);
    }

    async sendWelcome() {
        const subject = 'Welcome to TripSync Family. Start Exploring Now 🌍';
        const text = `Dear ${this.firstName},

        Welcome to TripSync – your gateway to seamless travel experiences! We're thrilled to have you on board. Get ready to embark on unforgettable journeys and explore the world like never before.
        
        With TripSync, you can effortlessly discover and book tours, activities, and accommodations tailored to your preferences. Whether you're seeking adrenaline-pumping adventures, cultural immersions, or tranquil getaways, we've got you covered.
        
        Stay tuned for exclusive deals, insider tips, and personalized recommendations to make your travels truly exceptional.
        
        Ready to turn your travel dreams into reality? Start exploring with TripSync today!
        
        Happy travels,
        The TripSync Team`;

        await this.send(subject, text);
    }

    async sendResetPassword() {
        const subject = 'Reset Your Password: Important Action Required!';
        const message = `Dear ${this.firstName},

        We hope this email finds you well.
        
        It appears that there has been a request to reset the password associated with your account. To ensure the security of your account, please follow the instructions below to reset your password:
        
        Click on the following link to reset your password: ${this.url}
        Follow the prompts to create a new password.
        Once completed, your account will be secure with the new password.
        Please note that this link will expire after [insert time period], so we recommend completing the password reset process as soon as possible.
        
        If you did not request a password reset or believe this email was sent to you in error, please disregard it.
        
        If you have any concerns or require further assistance, please don't hesitate to contact our support team at [support email or phone number].
        
        Thank you for your attention to this matter.
        
        Best regards,
        TripSync Team`;
        await this.send(subject, message);
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
