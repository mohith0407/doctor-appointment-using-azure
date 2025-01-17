const { EmailClient } = require("@azure/communication-email");

module.exports = async function(context, queueMessage) {
    try {
        const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);
        const message = JSON.parse(Buffer.from(queueMessage, 'base64').toString());

        let emailDetails;
        
        if (message.type === 'NEW_APPOINTMENT') {
            emailDetails = {
                senderAddress: process.env.SENDER_EMAIL,
                content: {
                    subject: "New Appointment Request",
                    html: `
                        <h2>New Appointment Request</h2>
                        <p>Dear Dr. ${message.doctorName},</p>
                        <p>You have a new appointment request from ${message.patientName} 
                           for ${new Date(message.appointmentDate).toLocaleString()}.</p>
                        <p>Please log in to your dashboard to accept or reject this appointment.</p>
                    `
                },
                recipients: {
                    to: [{ address: message.doctorEmail }]
                }
            };
        } else if (message.type === 'STATUS_UPDATE') {
            emailDetails = {
                senderAddress: process.env.SENDER_EMAIL,
                content: {
                    subject: "Appointment Status Update",
                    html: `
                        <h2>Appointment Status Update</h2>
                        <p>Dear ${message.patientName},</p>
                        <p>Your appointment with Dr. ${message.doctorName} 
                           scheduled for ${new Date(message.appointmentDate).toLocaleString()} 
                           has been ${message.status.toLowerCase()}.</p>
                    `
                },
                recipients: {
                    to: [{ address: message.patientEmail }]
                }
            };
        }

        if (emailDetails) {
            const poller = await emailClient.beginSend(emailDetails);
            const result = await poller.pollUntilDone();
            context.log('Email sent successfully:', result);
        }

    } catch (error) {
        context.log.error('Error processing notification:', error);
        throw error;
    }
}; 