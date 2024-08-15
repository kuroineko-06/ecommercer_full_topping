const nodemailer = require("nodemailer");

exports.sendMail = async (email, subject, body) => {
  return new Promise((resolve, reject) => {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: body,
    };

    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Emaillllllllllll: ", process.env.EMAIL);
        console.log("Passssssssssssss: ", process.env.EMAIL_PASSWORD);

        console.error("Error sending email: ", error);
        reject(Error("Error sending email"));
      }
      // console.log("Email sent: ", info.response);
      resolve({
        message: "Password reset OTP send to your email",
      });
    });
  });
};
