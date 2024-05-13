// Import required modules
const FabricNetwork = require("./fabric");

// Initialize FabricNetwork instance
const fabricNetwork = new FabricNetwork();

// Organization details
const organization = "ospedale-maresca.aslnapoli3.medchain.com";
const userAffiliation = "";

// Channel and chaincode details
const channelName = "patient-records-channel";
const chaincodeName = "organization";

async function main() {
  try {
    // Enroll admin
    console.log("Enrolling admin...");
    await fabricNetwork.enrollAdmin(organization);
    console.log("Admin enrolled successfully.");

    // Register and enroll user
    console.log("Registering and enrolling user...");
    const userId = await fabricNetwork.registerAndEnrollUser(
      userAffiliation,
      organization
    );
    console.log("User registered and enrolled successfully.");

    // Initialize Fabric network connection
    console.log("Initializing Fabric network...");
    await fabricNetwork.init(userId, organization, channelName, chaincodeName);
    console.log("Fabric network initialized successfully.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Disconnect from the gateway
    fabricNetwork.disconnect();
    console.log("Disconnected from Fabric gateway.");
    process.exit(0);
  }
}

// Call main function
main();
