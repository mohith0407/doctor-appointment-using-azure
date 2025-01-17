require('dotenv').config();
const { EmailClient } = require("@azure/communication-email");

async function testEmailService() {
  try {
    const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);
    
    const message = {
      senderAddress: process.env.SENDER_EMAIL,
      content: {
        subject: "Test Email",
        html: "<h1>This is a test email</h1><p>If you receive this, email service is working!</p>"
      },
      recipients: {
        to: [{ address: "aakash.cd.meta@gmail.com" }]
      }
    };

    console.log('Attempting to send email...');
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();
    console.log('Test email sent successfully:', result);
  } catch (error) {
    console.error('Error sending test email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code
    });
  }
}

testEmailService(); 