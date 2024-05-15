const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");

const authRoutes = require("./api/routes/auth");
const patientRoutes = require("./api/routes/patient");

const FabricNetwork = require("./blockchain/fabric");
const fabric = new FabricNetwork();

const mongoUri =
  "mongodb+srv://dazza:6ncrjZ6HTleG6sCj@cluster0.06w67sk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );
  next();
});

//app.use("/auth", authRoutes);

app.use(patientRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Enroll admin
    console.log("Enrolling admin...");
    await fabric.enrollAdmin("patients.medchain.com");
    console.log("Admin enrolled successfully.");

    await mongoose.connect(mongoUri);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

startServer();
