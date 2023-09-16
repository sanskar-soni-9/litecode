const amqp = require("amqplib");
const { executePythonCode } = require("./k8s");
const { queueName, amqpUrl } = require("./constants");

const runConsumer = async () => {
  try {
    const connection = await amqp.connect(amqpUrl);
    const channel = await connection.createChannel();

    await channel.assertQueue(queueName, { durable: true });
    console.log("Consumer is running, waiting for messages...");

    try {
      channel.consume(queueName, async (msg) => {
        console.log("Processing code...");

        const submission = msg.content.toString();
        const res = await executePythonCode(submission);
        console.log("Result: ", res);

        channel.sendToQueue(
          msg.properties.replyTo,
          Buffer.from(JSON.stringify({ success: true, res })),
          {
            persistent: true,
          },
        );
        console.log("Code Processed.");
        channel.ack(msg);
      });
    } catch (err) {
      channel.sendToQueue(
        msg.properties.replyTo,
        Buffer.from(JSON.stringify({ success: false, err: err.toString() })),
        {
          persistent: true,
        },
      );
      channel.ack(msg);
    }
  } catch (error) {
    console.error(`Error Occured: ${error}`);
  }
};
runConsumer();
