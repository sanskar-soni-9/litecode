require("dotenv").config();
const queueName = "litecode_submissions";

/** For Production **/
const amqpUrl = process.env.LITECODE_MQ;

/** For Development **/
// const amqpUrl = "amqp://localhost";

module.exports = { queueName, amqpUrl };
