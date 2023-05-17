const nodemailer = require('nodemailer');


const main = async (remail, message, subject) => {

  let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'charlesayomike4@gmail.com',
    pass: 'znejmvsqrmowxxpz'
  }
});

  let finalmessage = ''
  if(subject === 'Your Order'){
    const splitmes = message.split('!')

    finalmessage = `
    <div style="background-color: #ddd6fe; border-radius: 10px; padding: 10px; font-size: 16px">
      <div style="margin-bottom: 10px; font-weight: bolder; font-size: 30px">

        <span>best<span style="color: purple;">Se</span>ller</span>
      
       </div>

      <div style="background-color: white; border-radius: 10px; padding: 10px;">
        <div>${splitmes[0]}</div>
        <p>${splitmes[1]}</p>
        <p>${splitmes[2]}</p>
        <p>${splitmes[3]}</p>
        <p>${splitmes[4]}</p>
        <p>${splitmes[5]}</p>
        <p>${splitmes[6]}</p>
      </div>
      
      </div>
    </div>
    
  `
  }else{
    const splitmes = message.split('!')

    finalmessage = `
    <div style="background-color:#ddd6fe; border-radius: 10px; padding: 10px; font-size: 16px">
      <div style="margin-bottom: 10px; font-weight: bolder; font-size: 30px">

        <span>best<span style="color: purple;">Se</span>ller</span>
      
       </div>

      <div style="background-color: white; border-radius: 10px; padding: 10px;">
        <div>${splitmes[0]}</div>
        <p>${splitmes[1]}</p>
        <p>${splitmes[2]}</p>
        <p>${splitmes[3]}</p>
      </div>
      
      </div>
    </div>
    
  `
  }

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'charlesayom@gmail.com', // sender address
    to: `${remail}`, // list of receivers
    subject: subject, // Subject line
    text: message, // plain text body
    html: finalmessage // html body
  });

  // console.log("Message sent: %s", info.messageId);
  // // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // // Preview only available when sending through an Ethereal account
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = main