const SECRET = "liteCode";
const queueName = "litecode_submissions";
const PORT = process.env.PORT || 3000;

/** For Development **/
// const amqpUrl = "amqp://localhost";
// const credentials = {
//   host: "localhost",
//   database: "litecode",
//   user: "postgres",
//   password: "data",
//   port: 5432,
// };

/** For Production **/
const credentials = {
  connectionString: process.env.LITECODE_DB,
  ssl: true
};
const amqpUrl = process.env.LITECODE_MQ;

module.exports = { SECRET, credentials, queueName, amqpUrl, PORT };
