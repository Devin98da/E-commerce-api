const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'devin98@gmail.com',
        pass: '123456'
    }
})

const sendConfirmationEmail = async (userEmail) => {
    try {
        await transporter.sendMail({
            from: 'devin98@gmail.com',
            to: userEmail,
            subject: 'Subscription Confirmation',
            text: 'Thank you for subscribing! You will now receive updates from us.',
            html: '<p>Thank you for subscribing! You will now receive updates from us.</p>',
        });

        console.log(`Confirmation email sent to ${userEmail}`);
        
    } catch (error) {
        console.error(`Error sending email to ${userEmail}:`, error);
    }
}

module.exports = { sendConfirmationEmail }