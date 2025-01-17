require('dotenv').config();
const { addToQueue } = require('../utils/queueService');

async function testNotifications() {
    try {
        // Test 1: New Appointment Notification
        console.log('Testing new appointment notification...');
        await addToQueue({
            type: 'NEW_APPOINTMENT',
            appointmentId: 123,
            doctorEmail: 'your-email@example.com', // Replace with your test email
            doctorName: 'Dr. Test',
            patientName: 'Test Patient',
            appointmentDate: new Date().toISOString()
        });
        console.log('New appointment notification queued successfully');

        // Test 2: Status Update Notification
        console.log('\nTesting status update notification...');
        await addToQueue({
            type: 'STATUS_UPDATE',
            appointmentId: 123,
            patientEmail: 'your-email@example.com', // Replace with your test email
            patientName: 'Test Patient',
            doctorName: 'Dr. Test',
            status: 'ACCEPTED',
            appointmentDate: new Date().toISOString()
        });
        console.log('Status update notification queued successfully');

    } catch (error) {
        console.error('Test failed:', error);
    }
}

// Run the tests
testNotifications(); 