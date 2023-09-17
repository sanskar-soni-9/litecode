const amqp = require("amqplib");
const { queueName, amqpUrl } = require("./constants");

let connection = null;
let channel = null;

const connectToRabbitMQ = async () => {
  if (!connection || !channel) {
    connection = await amqp.connect(amqpUrl);
    channel = await connection.createChannel();
  }
};

const publishToQueue = async (submission, input) => {
  return new Promise(async (res, rej) => {
    try {
      await connectToRabbitMQ();

      await channel.assertQueue(queueName, { durable: true });
      const callbackQueue = await channel.assertQueue("", {
        durable: true,
        exclusive: true,
      });

      channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify({ code: submission, input })),
        {
          persistent: true,
          replyTo: callbackQueue.queue,
        },
      );

      channel.consume(callbackQueue.queue, async (msg) => {
        if (!msg) return;
        channel.ack(msg);
        channel.deleteQueue(callbackQueue.queue);
        res(JSON.parse(msg.content.toString()));
      });
    } catch (err) {
      rej(err);
    }
  });
};

module.exports = { publishToQueue };
