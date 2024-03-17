
const nodemailer = require("nodemailer");


const SendEmailUtility = async (EmailTo,EmailSubject,EmailHTML )=>{
    
    //Create transporter useing SMTP
    const transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'shantorozariom@gmail.com',
            pass:'oqua wxsk xqiy uacv',
        }
    });

    // The Email Message 
  let mailOptions = {
    from: '"TaskBuddy" <shantorozariom@gmail.com>', // sender address
    to: EmailTo, // list of receivers
    subject: EmailSubject, // Subject line
    html: EmailHTML , // plain text body
  };

  //Send Email
  return await transporter.sendMail(mailOptions)
}
module.exports = SendEmailUtility;