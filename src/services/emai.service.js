const emailjs = require("@emailjs/nodejs");

const sendEmail = async (templateId, params) => {
    try {
        await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            templateId,
            params,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY,
            }
        );
    } catch (error) {
        console.error("EmailJS Error:", error);
    }
};


const sendVerificationEmail = async (user, verificationUrl) => {
    const params = {
        to_name: `${user.firstName} ${user.lastName}`,
        to_email: user.email,
        verification_url: verificationUrl,
    };
    return await sendEmail(process.env.EMAILJS_VERIFY_TEMPLATE_ID, params);
};


const sendWelcomeEmail = async (user) => {
    const params = {
        to_name: user.firstName,
        to_email: user.email,
    };
    return await sendEmail(process.env.EMAILJS_WELCOME_TEMPLATE_ID, params);
};

module.exports = { sendVerificationEmail, sendWelcomeEmail };