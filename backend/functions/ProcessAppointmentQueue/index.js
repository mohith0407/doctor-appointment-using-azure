const { QueueClient } = require("@azure/storage-queue");
const sql = require('mssql');

module.exports = async function (context, myQueueItem) {
    try {
        context.log('Processing appointment:', myQueueItem);
        const { appointmentId, action } = myQueueItem;

        // Connect to SQL Database
        await sql.connect(process.env.DB_HOST);

        switch (action) {
            case 'BOOKED':
                // Update appointment analytics
                await updateAppointmentAnalytics(appointmentId);
                break;
            case 'STATUS_CHANGED':
                // Process status change
                await processStatusChange(appointmentId);
                break;
        }

        context.log('Appointment processed successfully');
    } catch (error) {
        context.log.error('Error processing appointment:', error);
        throw error;
    }
};

async function updateAppointmentAnalytics(appointmentId) {
    // Update analytics like total bookings, busy hours, etc.
    const result = await sql.query`
        UPDATE AppointmentAnalytics 
        SET TotalBookings = TotalBookings + 1 
        WHERE Date = CAST(GETDATE() AS DATE)
    `;
}

async function processStatusChange(appointmentId) {
    // Process appointment status changes
    const result = await sql.query`
        UPDATE AppointmentHistory 
        SET LastUpdated = GETDATE() 
        WHERE AppointmentID = ${appointmentId}
    `;
} 
