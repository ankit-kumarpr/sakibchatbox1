const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'jobankit99@gmail.com',
    pass: 'khwh zctb dhns dcug',
  },
});

/**
 * Sends an HTML email
 * @param {string} to - Recipient email
 * @param {string} subject - Subject of the email
 * @param {string} htmlContent - HTML body
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: '"Gnet App" jobankit99@gmail.com',
      to,
      subject,
      html: htmlContent, // ✅ Use 'html', NOT 'text'
    });
    console.log('✅ Email sent to:', to);
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw error;
  }
};

module.exports = sendEmail;
