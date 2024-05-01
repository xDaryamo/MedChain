const { connectToNetwork } = require("../network");

async function addPatient(org, patientData) {
  const gateway = await connectToNetwork(org);
  const network = await gateway.getNetwork("patient-records-channel");
  const contract = network.getContract("patientContract");

  try {
    await contract.submitTransaction("addPatient", JSON.stringify(patientData));
    console.log("Patient added successfully.");
  } finally {
    gateway.disconnect();
  }
}

async function getPatient(org, patientId) {
  const gateway = await connectToNetwork(org);
  const network = await gateway.getNetwork("patient-records-channel");
  const contract = network.getContract("PatientContract");

  try {
    const result = await contract.evaluateTransaction("getPatient", patientId);
    return JSON.parse(result.toString());
  } finally {
    gateway.disconnect();
  }
}

// async function updatePatient(patientID, patientData) {
//   try {
//     const gateway = await connectToNetwork("farmaciacarbone");
//     const network = await gateway.getNetwork("patient-records-channel");
//     const contract = network.getContract("patient");

//     const updatedPatientJSON = JSON.stringify(patientData);
//     await contract.submitTransaction(
//       "UpdatePatient",
//       patientID,
//       updatedPatientJSON
//     );

//     console.log("Patient record updated successfully.");
//   } catch (error) {
//     console.error("Failed to update patient record:", error);
//     throw new Error("Failed to update patient record");
//   }
// }

// async function deletePatient(patientID) {
//   try {
//     const gateway = await connectToNetwork("farmaciacarbone");
//     const network = await gateway.getNetwork("patient-records-channel");
//     const contract = network.getContract("patient");

//     await contract.submitTransaction("DeletePatient", patientID);

//     console.log("Patient record deleted successfully.");
//   } catch (error) {
//     console.error("Failed to delete patient record:", error);
//     throw new Error("Failed to delete patient record");
//   }
// }

module.exports = { addPatient, getPatient };
