const express = require("express");
const jwt = require("jsonwebtoken");

const { SECRET } = require("../constants");
const { v4: uuid } = require("uuid");
const {
  getProblems,
  addUser,
  validateUser,
  checkUser,
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

router.get("/me", auth, async (req, res) => {
  try {
    const { userID } = req;
    const user = await checkUser(userID, null);
    res.json({ ...user });
  } catch (error) {
    console.error("Error occored while getting profile.", error);
    res.status(500).json({
      err: true,
      msg: "An error occured while getting user profile.",
    });
  }
});

// POST Requests
router.post("/signup", async (req, res) => {
  try {
    const userID = uuid();
    const { email, password } = req.body;
    const isUser = await checkUser(null, email);
    if (isUser) {
      return res.status(403).json({ err: true, msg: "User already exists!" });
    }
    const result = await addUser(userID, email, password);
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
    const isUser = await checkUser(null, email);
    if (!isUser) {
      return res.status(404).json({ err: true, msg: "User doesn't exist." });
    }
    const userID = await validateUser(email, password);
    if (!userID) {
      return res.status(401).json({ msg: "Invalid password." });
    }
    const token = jwt.sign({ userID }, SECRET);
    res.status(200).json({ msg: "User logged in.", token });
  } catch (error) {
    console.error("Error occurred while logging in:", error);
    res.status(500).json({ err: true, msg: "An error occurred during login." });
  }
});

router.post("/submission", auth, async (req, res) => {
  try {
    const { problemID, submission } = req.body;

    const result = await publishToQueue(submission);
    const status = result.success ? "AC" : "WA";
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
