var nodemailer = require("nodemailer"),
    userMail = "orvdkrqp@mailosaur.net";

let selfSignedConfig = {
    host: 'smtp.mailosaur.net',
    port: 587,
    secure: true,
    auth: {
        user: userMail, pass: 'NolVDhhZ0aabeTQitsFuoADlkhsNbflK'
    },
    tls: {
        rejectUnauthorized: false
    }
};

let tTransporter = nodemailer.createTransport(selfSignedConfig);

module.exports.sendConfirmationEmailRest = (host, email, confirmationCode) => {
    tTransporter.sendMail({
        from: "Car info app <" + userMail + ">",
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
          <h2>Hello!</h2>
          <p>Thank you for joining us. Please confirm your email by clicking on the following link</p>
          <a href=${host}/api/v1/users/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
};

module.exports.sendConfirmationEmailWeb = (host, email, confirmationCode) => {
    tTransporter.sendMail({
        from: "Car info app <" + userMail + ">",
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
          <h2>Hello!</h2>
          <p>Thank you for joining us. Please confirm your email by clicking on the following link</p>
          <a href=${host}/confirm/${confirmationCode}> Click here</a>
          </div>`,
    }).catch(err => console.log(err));
};
