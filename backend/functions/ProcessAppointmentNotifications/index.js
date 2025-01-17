const { EmailClient } = require("@azure/communication-email");

module.exports = async function(context, myQueueItem) {
    try {
        context.log('Raw queue message received:', myQueueItem);

        if (!process.env.AZURE_COMMUNICATION_CONNECTION_STRING) {
            throw new Error('AZURE_COMMUNICATION_CONNECTION_STRING is not configured');
        }
        if (!process.env.SENDER_EMAIL) {
            throw new Error('SENDER_EMAIL is not configured');
        }

        const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);
        
        let emailDetails;
        
        const queueItem = typeof myQueueItem === 'string' ? JSON.parse(myQueueItem) : myQueueItem;
        
        if (queueItem.type === 'NEW_APPOINTMENT') {
            emailDetails = {
                senderAddress: process.env.SENDER_EMAIL,
                content: {
                    subject: "New Appointment Request",
                    html: `
                        <h2>New Appointment Request</h2>
                        <p>Dear Dr. ${queueItem.doctorName},</p>
                        <p>You have a new appointment request from ${queueItem.patientName} 
                           for ${new Date(queueItem.appointmentDate).toLocaleString()}.</p>
                        <p>Please log in to your dashboard to accept or reject this appointment.</p>
                    `
                },
                recipients: {
                    to: [{ address: queueItem.doctorEmail }]
                }
            };
            context.log('Created email for doctor:', queueItem.doctorEmail);
        } 
        else if (queueItem.type === 'STATUS_UPDATE') {
            emailDetails = {
                senderAddress: process.env.SENDER_EMAIL,
                content: {
                    subject: "Appointment Status Update",
                    html: `
                        <h2>Appointment Status Update</h2>
                        <p>Dear ${queueItem.patientName},</p>
                        <p>Your appointment with Dr. ${queueItem.doctorName} 
                           scheduled for ${new Date(queueItem.appointmentDate).toLocaleString()} 
                           has been ${queueItem.status.toLowerCase()}.</p>
                        <p>Thank you for using our service.</p>
                    `
                },
                recipients: {
                    to: [{ address: queueItem.patientEmail }]
                }
            };
            context.log('Created email for patient:', queueItem.patientEmail);
        }

        if (emailDetails) {
            context.log('Attempting to send email with details:', {
                subject: emailDetails.content.subject,
                to: emailDetails.recipients.to[0].address
            });
            
            const poller = await emailClient.beginSend(emailDetails);
            const result = await poller.pollUntilDone();
            context.log('Email sent successfully. Result:', result);
        } else {
            context.log.warn('No email details created for message type:', queueItem.type);
        }

    } catch (error) {
        context.log.error('Error in function:', {
            message: error.message,
            code: error.code,
            stack: error.stack,
            name: error.name
        });
        throw error;
    }
}; 