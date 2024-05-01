const express = require("express");
const { connectDB } = require('./config/database');
const app = express();


connectDB();

app.listen(8080);