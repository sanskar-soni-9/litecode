const SECRET = "liteCode";
const queueName = "litecode_submissions";

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
  connectionString: process.env.DB_CONNECTION_STRING,
  ssl: true
};
const amqpUrl = process.env.RABBITMQ_URL;

module.exports = { SECRET, credentials, queueName, amqpUrl };
