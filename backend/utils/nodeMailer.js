import nodemailer from 'nodemailer'
import nodeMailerConfig from './nodeMailerConfig.js';

const sendEmail = async ({to, subject, html}) => {
    try {
        const transporter = nodemailer.createTransport(nodeMailerConfig);
    
        const mailOptions = {
          from: '"Market" <dmitriiletob324@gmail.com>', 
          to: 'dmitriiletob324@gmail.com',
          subject: subject, 
          html: html,
        };
    
         await transporter.sendMail(mailOptions);;
      } catch (error) {
        console.log(error)
        throw new Error('Ошибка при отправке письма')
      }
    };

export default sendEmail