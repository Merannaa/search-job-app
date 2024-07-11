import nodemailer from 'nodemailer';

export const sendEmailService = async ({
    to="",
    subject="",
    textMessage="",
    htmlMessage="",
    attachments=[],
}={})=>{
    //transport configuration
    const transporter =nodemailer.createTransport({
        host:"localhost",
        port:587,
        secure:false,
        auth:{
            user:'meran.ahmed.tr@gmail.com',
            pass:'kzokeiadyphhwmla'
        },
        service:'gmail',
    })

    //message configuration
    const infoMail = await transporter.sendMail({
        from:'No-Reply <meran.ahmed.tr@gmail.com>',
        to,
        subject,
        text:textMessage,
        html:htmlMessage,
        attachments,

    })
    console.log("Message sent: %s",infoMail);
}