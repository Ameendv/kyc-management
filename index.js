require("rootpath")();
const express = require("express");
const app = express();
const dotenv = require("dotenv");

const cors = require("cors");

// const errorHandler = require("_middleware/error-handler");

// const getErrorCode = require("./_helpers/getErrorCode");





dotenv.config();


app.use(
  express.json()
);




app.use(cors());
app.enable("trust proxy");



// api routes
app.use(require('./controllers/user.controller'))



const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
app.use("/static", express.static(path.join(__dirname, "public")));

// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV ;


app.get("/", async (req, res) => {
  res.send({
    message: "Hello world",
  });
});
app.listen(port, () => console.log("Server listening on port " + port));
