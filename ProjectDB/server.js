/**
 * @Author: dylanlawless
 * @Date:   2020-03-27T08:30:50+00:00
 * @Last modified by:   dylanlawless
 * @Last modified time: 2020-03-30T14:20:49+01:00
 */



const express = require('express');
const body_parser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const testRouter = require('./routes/test');

const resultRouter = require('./routes/result');
const testOrderRouter = require('./routes/testOrder');

const authRouter = require('./routes/auth');

const app = express();

app.use(body_parser.json());
app.use(cors());

app.use('/user', userRouter);
app.use('/test', testRouter);
app.use('/testOrder', testOrderRouter);
app.use('/result', resultRouter);

app.use('/account', authRouter);


const uri = process.env.ATLAS_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', () =>{
  console.log("MongoDB database connection established successfully");
});


app.get("/", (req, res) => {
  res.json({message: "You are in the root route"});
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
