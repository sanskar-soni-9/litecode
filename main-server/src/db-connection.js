const { Pool } = require("pg");
const { credentials } = require("./constants");

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
    console.error("Error occurred while fetching problems:", error);
    throw error;
  }
};

const getProblem = async (id) => {
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT * FROM PROBLEMS WHERE id=$1`,
      [id],
    );
    return rowCount ? { ...rows[0] } : false;
  } catch (error) {
    console.error(
      `Error occurred while fetching problem with ID ${id}:`,
      error,
    );
    throw error;
  }
};

const addUser = async (id, email, salt, hashedPassword) => {
  try {
    const { rowCount } = await pool.query(
      `INSERT INTO USERS(id, email, salt, password_hash) VALUES($1, $2, $3, $4)`,
      [id, email, salt, hashedPassword],
    );
    return !!rowCount;
  } catch (error) {
    console.error(`Error occurred while adding user with ID ${id}:`, error);
    throw error;
  }
};

const validateUserExists = async (email) => {
  try {
    const { rowCount, rows } = await pool.query(
      `SELECT id, password_hash FROM USERS WHERE email = $1`,
      [email],
    );
    return rowCount ? rows[0] : false;
  } catch (error) {
    console.error(
      `Error occurred while validating user with email ${email}:`,
      error,
    );
    throw error;
  }
};

const addSubmission = async (subID, userID, problemID, submission, status) => {
  try {
    const { rowCount } = await pool.query(
      "INSERT INTO submissions(subid, userid, problemid, submission, status) VALUES($1, $2, $3, $4, $5)",
      [subID, userID, problemID, submission, status],
    );
    return !!rowCount;
  } catch (error) {
    console.error(
      `Error occurred while adding submission for user with ID ${userID}:`,
      error,
    );
    throw error;
  }
};

const getSubmissions = async (problemID) => {
  try {
    const { rowCount, rows } = await pool.query(
      "SELECT * FROM submissions WHERE problemID = $1",
      [problemID],
    );
    return rowCount ? rows : { msg: "No submissions found for this problem." };
  } catch (error) {
    console.error(
      `Error occurred while getting submissions for problem with ID ${problemID}:`,
      error,
    );
    throw error;
  }
};

module.exports = {
  getProblems,
  addUser,
  validateUserExists,
  getProblem,
  addSubmission,
  getSubmissions,
};
