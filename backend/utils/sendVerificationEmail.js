import sendEmail from "./nodeMailer.js";

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}?token=${verificationToken}&email=${email}`;

  const message = `<p>Пожалуйста, подтвердите свой адрес электронной почты, нажав на следующую ссылку: <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    to: email,
    subject: 'Email Confirmation',
    html: `<h4> Привет, ${name}! </h4> ${message}
    `,
  });
};

export default sendVerificationEmail