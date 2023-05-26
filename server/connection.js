const { Pool } = require("pg");

const credentials = {
  host: "localhost",
  database: "meetcode",
  user: "postgres",
  password: "data",
  port: 5432,
};

const pool = new Pool(credentials);

const getProblems = async () => {
  try {
    const problems = await pool.query("SELECT * FROM PROBLEMS");
    return problems.rowCount
      ? problems.rows.map(({ id, difficulty, acceptance, title }) => ({
          id,
          difficulty,
          acceptance,
          title,
        }))
      : false;
  } catch (error) {
    // Handle or log the error appropriately
    console.error("Error occurred while fetching problems:", error);
    throw error;
  }
};

const getProblem = async (id) => {
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM PROBLEMS WHERE id=$1`,
      [id]
    );
    return rowCount ? { ...rows[0] } : false;
  } catch (error) {
    // Handle or log the error appropriately
    console.error(
      `Error occurred while fetching problem with ID ${id}:`,
      error
    );
    throw error;
  }
};

const checkUser = async (id, email) => {
  try {
    const { rows } = await pool.query(
      `SELECT email, id FROM USERS WHERE email = $1 OR id = $2`,
      [email, id]
    );
    return rows.length ? {email: rows[0].email, id: rows[0].id} : false;
  } catch (error) {
    // Handle or log the error appropriately
    console.error(
      `Error occurred while checking user with email ${email}:`,
      error
    );
    throw error;
  }
};

const addUser = async (id, email, password) => {
  try {
    const { rowCount } = await pool.query(
      `INSERT INTO USERS(id, email, password) VALUES($1, $2, $3)`,
      [id, email, password]
    );
    return !!rowCount;
  } catch (error) {
    // Handle or log the error appropriately
    console.error(`Error occurred while adding user with ID ${id}:`, error);
    throw error;
  }
};

const validateUser = async (email, password) => {
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT id FROM USERS WHERE email = $1 AND password = $2`,
      [email, password]
    );
    return rowCount ? rows[0]?.id : false;
  } catch (error) {
    // Handle or log the error appropriately
    console.error(
      `Error occurred while validating user with email ${email}:`,
      error
    );
    throw error;
  }
};

const addSubmission = async (userID, problemID, submission, status) => {
  try {
    const { rowCount } = await pool.query('INSERT INTO submissions(userID, problemID, submission, status) VALUES($1, $2, $3, $4)', [userID, problemID, submission, status]);
    return !!rowCount;
  } catch (error) {
    // Handle or log the error appropriately
    console.error(`Error occurred while adding submission for user with ID ${userID}:`, error);
    throw error;
  }
};

const getSubmissions = async (problemID) => {
  try {
    const { rowCount, rows } = await pool.query('SELECT * FROM submissions WHERE problemID = $1', [problemID]);
    return rowCount ? rows : { msg: 'No submissions found for this problem.' };
  } catch (error) {
    // Handle or log the error appropriately
    console.error(`Error occurred while getting submissions for problem with ID ${problemID}:`, error);
    throw error;
  }
};

module.exports = { getProblems, addUser, validateUser, checkUser, getProblem, addSubmission, getSubmissions };
