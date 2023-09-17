const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

const { SECRET, saltRounds } = require("../constants");
const {
  getProblems,
  addUser,
  validateUserExists,
  getProblem,
  addSubmission,
} = require("../db-connection");
const { auth } = require("../middleware");
const { publishToQueue } = require("../publishermq");
const router = express.Router();

// GET Requests
router.get("/problems", async (_, res) => {
  try {
    const problems = await getProblems();
    if (!problems) {
      return res.status(503).json({
        err: true,
        msg: "Couldn't get problems, internal error occurred!",
      });
    }
    res.json(problems);
  } catch (error) {
    console.error("Error occurred while fetching problems:", error);
    res.status(500).json({
      err: true,
      msg: "An error occurred while fetching problems.",
    });
  }
});

router.get("/problem/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await getProblem(id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found." });
    }
    res.json({ problem });
  } catch (error) {
    console.error("Error occurred while fetching problem:", error);
    res.status(500).json({
      err: true,
      msg: "An error occurred while fetching the problem.",
    });
  }
});

// POST Requests
router.post("/signup", async (req, res) => {
  try {
    const userID = uuid();
    const { email, password } = req.body;

    const isUser = await validateUserExists(email);
    if (isUser) {
      return res.status(403).json({ err: true, msg: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPass = await bcrypt.hash(password, salt);
    const result = await addUser(userID, email, salt, hashedPass);
    if (!result) {
      return res.status(503).json({ err: true, msg: "User signup failed." });
    }

    const token = jwt.sign({ userID }, SECRET);
    res.status(201).json({ msg: "User signed up.", token });
  } catch (error) {
    console.error("Error occurred while signing up:", error);
    res
      .status(500)
      .json({ err: true, msg: "An error occurred during signup." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userCreds = await validateUserExists(email);
    if (!userCreds) {
      return res.status(404).json({ err: true, msg: "User doesn't exist." });
    }

    const isValidUser = await bcrypt.compare(password, userCreds.password_hash);
    if (!isValidUser) {
      return res.status(401).json({ msg: "Invalid password." });
    }

    const token = jwt.sign({ userID: userCreds.id }, SECRET);
    res.status(200).json({ msg: "User logged in.", token });
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    res.status(500).json({ err: true, msg: "An error occurred during login." });
  }
});

router.post("/submission", auth, async (req, res) => {
  try {
    const { problemID, submission } = req.body;

    const result = await publishToQueue(submission, "");
    if (!result.success) {
      return res.status(500).json({
        err: true,
        msg: "An error occured while executing the code, try to re-run or come back later :(",
      });
    }

    const status = "AC";
    const subID = uuid();
    const resp = await addSubmission(
      subID,
      req.userID,
      problemID,
      submission,
      status,
    );
    if (!resp) {
      return res.status(500).json({
        err: true,
        msg: "An error occured while adding submission.",
      });
    }
    return res.json({
      status,
      response: result.success ? result.res : result.err,
    });
  } catch (error) {
    console.error("Error occored while adding submission.", error);
    res.status(500).json({
      err: true,
      msg: "An error occured while adding submission.",
    });
  }
});

module.exports = router;
