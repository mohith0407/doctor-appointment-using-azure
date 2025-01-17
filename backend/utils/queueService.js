const { QueueServiceClient } = require("@azure/storage-queue");

const queueServiceClient = QueueServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const queueClient = queueServiceClient.getQueueClient("appointment-notifications");

const addToQueue = async (message) => {
  try {
    console.log('Adding message to queue:', message);
    const encodedMessage = Buffer.from(JSON.stringify(message)).toString('base64');
    await queueClient.sendMessage(encodedMessage);
    console.log('Message added successfully to queue');
  } catch (error) {
    console.error('Error adding to queue:', error);
  }
};

module.exports = { addToQueue }; 