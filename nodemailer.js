const nodemailer = require('nodemailer');


const main = async (remail, message, subject) => {

  let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'charlesayomike4@gmail.com',
    pass: 'znejmvsqrmowxxpz'
  }
});

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'charlesayom@gmail.com', // sender address
    to: `${remail}`, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: `<b>${message}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main