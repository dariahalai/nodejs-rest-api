const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.emailConfirm = (email, token) => {
  if (!email || !token) return;
  console.log(email);
  console.log(token);
  const msg = {
    to: email,
    from: "dashka04@gmail.com",
    subject: "Email Verification",
    text: "Please, confirm your email. Click the button <Verify> ",
    html: `<strong>Click to confirm your email address <a href=${`http://localhost:3000/api/users/verify/${token}`}>VERIFY</a></strong>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
