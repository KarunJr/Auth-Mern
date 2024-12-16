import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js"
import { mailtrapClient, sender } from "./mailtrap.config.js"


export const sendVerificationEmail = async (email, verificationToken) => {
    const receipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });
        console.log("Email sent succesfully", response);
    } catch (error) {
        console.log("Error sending verification" + error);
        throw new Error(`Error sending verification email ${error}`)
    }
}

export const sendWelcomeTemplate = async (email, name) => {
    const receipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipient,
            template_uuid: "03d50230-2127-4e73-9af0-1e4fc6681be4",
            template_variables: {
                "company_info_name": "Body Builder Web",
                "name": name
            }
        })
        console.log("Welcome email sent succesfully", response);

    } catch (error) {
        console.log("Error sending welcome email" + error);
        throw new Error(`Errro sending Welcome Email ${error}`)

    }
}

export const sendPasswordResetEmail = async (email, resetURL) => {
    const receipient = [{email}]
    
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Passwor reset"
        })
        console.log(`Reset Password sent to email: ${email}`);
        
    } catch (error) {
        console.log("Error sending reset password email", error);
        throw new Error("Error sending reset email", error)
        
    }
}

export const sendResetSuccessEmail = async (email)=>{
    const receipient = [{email}]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: receipient,
            subject: "Password reset successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password Reset"
        }) 
        console.log("Password reset email sent successfully.", response);
        
    } catch (error) {
        console.error(`Error sending password reset success email.`, error)
        throw new Error (`Error sending password reset success email ${error}`)
    }
}
