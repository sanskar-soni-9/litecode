require("dotenv").config();
const SECRET = process.env.LITECODE_SECRET;
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

/** For Development **/
// const queueName = "litecode_test";
// const amqpUrl = "amqp://localhost";
// const credentials = {
//   host: "localhost",
//   database: "litecode",
//   user: "postgres",
//   password: "data",
//   port: 5432,
// };

/** For Production **/
const queueName = "litecode_submissions";
const credentials = {
  connectionString: process.env.LITECODE_DB,
  ssl: true
};
const amqpUrl = process.env.LITECODE_MQ;

module.exports = { SECRET, saltRounds, credentials, queueName, amqpUrl, PORT };
