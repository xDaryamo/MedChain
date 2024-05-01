const { addPatient, getPatient } = require('./blockchain/contracts/patient');

async function testBlockchainOperations() {
  const org = 'ospedalemaresca'; 
  const patientData = {
    id: "1",
    name: "Test Patient",
    age: 34,
    condition: "Healthy"
  };

  try {
    console.log("Testing Add Patient...");
    await addPatient(org, patientData);
    console.log("Patient added successfully.");

    console.log("Testing Get Patient...");
    const patient = await getPatient(org, patientData.id);
    console.log("Patient retrieved successfully:", patient);

  } catch (error) {
    console.error("Test failed:", error);
  }
}

testBlockchainOperations();