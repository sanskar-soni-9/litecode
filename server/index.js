const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const cors = require("cors");
const {
  getProblems,
  addUser,
  validateUser,
  checkUser,
  getProblem,
  addSubmission,
  getSubmissions,
} = require("./connection");
const { auth } = require("./middleware");

const app = express();
const SECRET = "friends";
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(( req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://litecode-smoky.vercel.app', 'https://litecode-sanskar-soni-9.vercel.app', 'https://litecode-git-main-sanskar-soni-9.vercel.app'];
  const { origin } = req.headers;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});


app.get("/", (_, res) => {
  res.json({ msg: "Hello World." });
});

app.get("/problems", async (_, res) => {
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

app.post("/signup", async (req, res) => {
  try {
    const userID = uuid();
    const { email, password } = req.body;
    const isUser = await checkUser(null ,email);
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

app.post("/login", async (req, res) => {
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

app.get("/problems/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await getProblem(id);
    if (!problem) {
      return res.status(404).json({ msg: "Problem not found." });
    }
    res.json({ problem });
  } catch (error) {
    console.error("Error occurred while fetching problem:", error);
    res
      .status(500)
      .json({
        err: true,
        msg: "An error occurred while fetching the problem.",
      });
  }
});

app.get('/me', auth, async (req,res) => {
  try {
    const { userID } = req;
    const user = await checkUser(userID, null);
    res.json({ ...user });
  } catch (error) {
    console.error("Error occored while getting profile.", error);
    res
      .status(500)
      .json({
        err: true,
        msg: "An error occured while getting user profile.",
      });
  }
});

app.post('/submission', auth, async (req,res) => {
  try {
    const isCorrect = Math.random() > 0.5;
    const { problemID, submission } = req.body;
    if(!isCorrect) {
      const status = await addSubmission(req.userID, problemID, submission, 'AC');
      if(!status) {
        return res.status(500).json({ err: true, msg: "An error occured while adding submission." });
      }
      return res.json({ status: "AC" });
    } else {
      const status = await addSubmission(req.userID, problemID, submission, 'WA');
      if(!status) {
        return res.status(500).json({ err: true, msg: "An error occured while adding submission." });
      }
      return res.json({ status: "WA" });
    }
  } catch (error) {
    console.error("Error occored while adding submission.", error);
    res
      .status(500)
      .json({
        err: true,
        msg: "An error occured while adding submission.",
      });
  }
});

app.get('/submissions/:problemId', auth, async (req,res) => {
  console.log('hi');
  try {
    const { problemId } = req.params;
    const submissions = await getSubmissions(problemId);
    if(!submissions) {
      return res.status(500).json({ err: true, msg: "An error occured while fetching submissions." });
    }
    res.json({ submissions });
  } catch (error) {
    console.error("Error occored while fetching submissions.", error);
    res
      .status(500)
      .json({
        err: true,
        msg: "An error occured while fetching submissions.",
      });
  }
});

app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}.`);
});
