const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    try {
        // Initialize email client
        const emailClient = new EmailClient(process.env.AZURE_COMMUNICATION_CONNECTION_STRING);

        // Get appointment data from the trigger
        const { appointment, doctorEmail, patientEmail, doctorName, patientName } = req.body;

        // Send notifications
        const doctorMessage = {
            senderAddress: process.env.SENDER_EMAIL,
            content: {
                subject: "New Appointment Request",
                html: `
                    <h2>New Appointment Request</h2>
                    <p>Dear Dr. ${doctorName},</p>
                    <p>You have a new appointment request:</p>
                    <ul>
                        <li>Patient: ${patientName}</li>
                        <li>Date: ${new Date(appointment.AppointmentDate).toLocaleString()}</li>
                        <li>Status: Pending</li>
                    </ul>
                    <p>Please log in to your dashboard to accept or reject this appointment.</p>
                `
            },
            recipients: {
                to: [{ address: doctorEmail }]
            }
        };

        const patientMessage = {
            senderAddress: process.env.SENDER_EMAIL,
            content: {
                subject: "Appointment Confirmation",
                html: `
                    <h2>Appointment Booked Successfully</h2>
                    <p>Dear ${patientName},</p>
                    <p>Your appointment has been scheduled:</p>
                    <ul>
                        <li>Doctor: Dr. ${doctorName}</li>
                        <li>Date: ${new Date(appointment.AppointmentDate).toLocaleString()}</li>
                        <li>Status: Pending doctor's confirmation</li>
                    </ul>
                    <p>You will receive another email when the doctor confirms your appointment.</p>
                `
            },
            recipients: {
                to: [{ address: patientEmail }]
            }
        };

        // Send emails in parallel
        await Promise.all([
            emailClient.beginSend(doctorMessage),
            emailClient.beginSend(patientMessage)
        ]);

        // Log to Application Insights
        context.log('Appointment processed successfully', {
            appointmentId: appointment.AppointmentID,
            doctorId: appointment.DoctorID,
            patientId: appointment.PatientID,
            status: 'PENDING'
        });

        return {
            status: 200,
            body: {
                message: "Appointment processed successfully"
            }
        };
    } catch (error) {
        context.log.error('Error processing appointment:', error);
        return {
            status: 500,
            body: {
                message: "Error processing appointment",
                error: error.message
            }
        };
    }
}; 