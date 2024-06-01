const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");
const axios = require("axios");

const organizations = require("./config/organizations");

const authRoutes = require("./api/routes/auth");
const patientRoutes = require("./api/routes/patient");
const labResultsRoutes = require("./api/routes/lab-results");
const practitionerRoutes = require("./api/routes/practitioner");
const organizationRoutes = require("./api/routes/organization");

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

app.use("/auth", authRoutes);

app.use("/patient", patientRoutes);
app.use("/practitioner", practitionerRoutes);
app.use("/labresults", labResultsRoutes);
app.use("/organization", organizationRoutes);

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
    // Enroll admins for all organizations
    console.log("Enrolling admins...");
    for (const org of organizations) {
      await fabric.enrollAdmin(org);
    }
    console.log("Admins enrolled successfully.");

    // Initialize the public identity
    await fabric.enrollPublicUser("ospedale-maresca.aslnapoli3.medchain.com");
    console.log("Public identity initialized successfully.");

    // Connect to MongoDB
    await mongoose.connect(mongoUri);

    // Start the server
    app.listen(PORT, async () => {
      console.log(`Server is running on port ${PORT}`);
      try {
        const response = await axios.get(
          "http://localhost:3000/organization/initialize-ledger"
        );
        console.log(response.data);
      } catch (error) {
        console.error(
          "Error initializing ledger:",
          error.response ? error.response.data : error.message
        );
      }
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

startServer();
