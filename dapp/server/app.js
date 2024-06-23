const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose = require("mongoose");

const organizations = require("./config/organizations");

const authRoutes = require("./api/routes/auth");
const patientRoutes = require("./api/routes/patient");
const labResultsRoutes = require("./api/routes/lab-results");
const practitionerRoutes = require("./api/routes/practitioner");
const recordRoutes = require("./api/routes/medicalhistory");
const encounterRoutes = require("./api/routes/encounter");
const prescriptionRoutes = require("./api/routes/prescription");

const FabricNetwork = require("./blockchain/fabric");
const fabric = new FabricNetwork();

const mongoUri =
  "mongodb+srv://dazza:6ncrjZ6HTleG6sCj@cluster0.06w67sk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);

app.use("/patient", patientRoutes);
app.use("/practitioner", practitionerRoutes);
app.use("/labresults", labResultsRoutes);
app.use("/records", recordRoutes);
app.use("/encounters", encounterRoutes);
app.use("/prescription", prescriptionRoutes);

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

    await mongoose.connect(mongoUri);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

startServer();
