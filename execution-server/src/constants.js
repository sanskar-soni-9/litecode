require("dotenv").config();

/** For Production **/
const queueName = "litecode_submissions";
const amqpUrl = process.env.LITECODE_MQ;

/** For Development && Testing **/
// const queueName = "litecode_test";
// const amqpUrl = "amqp://localhost";

module.exports = { queueName, amqpUrl };
