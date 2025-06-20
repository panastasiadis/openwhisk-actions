const nodemailer = require('nodemailer');

function sendEmail(params) {
  return new Promise((resolve, reject) => {
    // Create a transporter object using MailHog's SMTP server
    const transporter = nodemailer.createTransport({
      host: '172.17.0.3',
      port: 1025,
      ignoreTLS: true, // Disable TLS for MailHog (it doesn't support TLS)
    });

    // Define email data based on input parameters
    const mailOptions = {
      from: params.from, // Sender's email address
      to: params.to, // Recipient's email address
      subject: params.subject,
      text: params.text,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        reject('Failed to send email');
      } else {
        console.log('Email sent:', info.response);
        resolve('Email sent successfully');
      }
    });
  });
}

async function main(params) {
  try {
      const result = await sendEmail(params);
      return { statusCode: 200, body: result };
  } catch (error) {
      return { statusCode: 500, body: error };
  }
}

// Export the main function for OpenWhisk
exports.main = main;
