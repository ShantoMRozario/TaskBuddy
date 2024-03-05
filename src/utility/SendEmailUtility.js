
const nodemailer = require("nodemailer");


//Create transporter useing SMTP
const SendEmailUtility = async (EmailTo,EmailSubject,EmailText)=>{
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'YOURMAIL',
            pass:'PASS'
        }
    });

    // The Email Message 
  let mailOptions = {
    from: '"Company Name" <YOURMAIL>', // sender address
    to: EmailTo, // list of receivers
    subject: EmailSubject, // Subject line
    text: EmailText, // plain text body
  };

  //Send Email
  return await transporter.sendMail(mailOptions)
}
module.exports = SendEmailUtility;