const { PORT } = require("./constants");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://litecode-smoky.vercel.app",
      "https://litecode-sanskar-soni-9.vercel.app",
      "https://litecode-git-main-sanskar-soni-9.vercel.app",
    ],
    methods: "GET, POST, PUT",
    credentials: true,
  }),
);

app.use("/", require("./routes/routes"))


app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}.`);
});
