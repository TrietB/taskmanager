var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const cors = require("cors");
const {sendResponse , AppError} = require('./helpers/utils')
//mongoose
const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => console.log(`Connected to ${mongoURI}`))
  .catch((err) => console.log(err));

var indexRouter = require("./routes/index");
const userRouter = require('./routes/user.api')
const taskRouter = require('./routes/task.api')

var app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.use('/user', userRouter)
app.use('/task', taskRouter)

app.use((req,res,next)=>{
    const err = new AppError(404,"Not Found", "Bad Request")
    next(err)
})

app.use((err,req,res,next)=>{
    console.log("ERROR", err)
    return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        false,
        null,
        {message: err.message},
        err.isOperational ? err.errorType : "Internal Server Error"
    )
})

module.exports = app;
