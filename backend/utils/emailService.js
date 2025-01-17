const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // SendGrid offers free tier

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const msg = {
      to,
      from: process.env.FROM_EMAIL, // Your verified SendGrid email
      subject,
      html: htmlContent,
    };
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error - we don't want to break appointment flow if email fails
  }
};

// Email templates remain the same
const appointmentRequestTemplate = (doctorName, patientName, appointmentDate) => `
  <h2>New Appointment Request</h2>
  <p>Dear Dr. ${doctorName},</p>
  <p>You have a new appointment request from ${patientName} for ${new Date(appointmentDate).toLocaleString()}.</p>
  <p>Please log in to your dashboard to accept or reject this appointment.</p>
  <p>Best regards,<br>Smart Healthcare Team</p>
`;

const appointmentStatusUpdateTemplate = (patientName, doctorName, status, appointmentDate) => `
  <h2>Appointment Status Update</h2>
  <p>Dear ${patientName},</p>
  <p>Your appointment with Dr. ${doctorName} scheduled for ${new Date(appointmentDate).toLocaleString()} 
     has been ${status.toLowerCase()}.</p>
  <p>Best regards,<br>Smart Healthcare Team</p>
`;

module.exports = {
  sendEmail,
  appointmentRequestTemplate,
  appointmentStatusUpdateTemplate
}; 