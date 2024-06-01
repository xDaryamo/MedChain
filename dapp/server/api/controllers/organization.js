const FabricNetwork = require("../../blockchain/fabric");
const fabric = new FabricNetwork();

exports.getOrganizationDetails = async (req, res, next) => {
  const userID = req.params.userid;
  const organization = req.body;
  try {
    const channel = "organizations-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction("ReadOrganization", userID);
    res.status(200).json({ organization: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createOrganization = async (req, res, next) => {
  const { organization, fhirData } = req.body;
  const userId = req.params.userid;

  try {
    const channel = "identity-channel";
    const chaincode = "organization";

    console.log("pre init");
    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Validate and stringify JSON
    let organizationJSONString;
    try {
      organizationJSONString = JSON.stringify(fhirData);
      JSON.parse(organizationJSONString); // This ensures the string is valid JSON
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return { error: "Invalid JSON format" };
    }

    // Log the JSON string
    console.log(
      "Submitting transaction with organization JSON:",
      organizationJSONString
    );

    const result = await fabric.submitTransaction(
      "CreateOrganization",
      organizationJSONString
    );

    return { message: "Organization created successfully", result: result };
  } catch (error) {
    return { error: error.message };
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateOrganization = async (req, res, next) => {
  const { organization, updatedOrganization } = req.body;
  const userID = req.params.userid;

  try {
    const channel = "organizations-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "UpdateOrganization",
      userID,
      JSON.stringify(updatedOrganization)
    );
    res
      .status(200)
      .json({ message: "Organization updated successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteOrganization = async (req, res, next) => {
  const { organization, orgid } = req.body;
  const userID = req.params.userid;

  try {
    const channel = "organizations-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "DeleteOrganization",
      userID,
      JSON.stringify(orgid)
    );
    res
      .status(200)
      .json({ message: "Organization deleted successfully", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchOrganizationsByType = async (req, res, next) => {
  const userID = req.params.userid;
  const query = req.params.query;
  const organization = req.body;
  try {
    const channel = "organizations-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "SearchOrganizationsByType",
      JSON.stringify(query)
    );
    res.status(200).json({ organization: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchOrganizationByName = async (req, res, next) => {
  const userID = req.params.userid;
  const query = req.params.query;
  const organization = req.body;
  try {
    const channel = "organizations-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "SearchOrganizationByName",
      JSON.stringify(query)
    );
    res.status(200).json({ organization: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchOrganizationByName = async (req, res, next) => {
  const userID = req.params.userid;
  const query = req.params.query;
  const organization = req.body;
  try {
    const channel = "organizations-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction(
      "SearchOrganizationByName",
      JSON.stringify(query)
    );
    res.status(200).json({ organization: JSON.parse(result) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    // Disconnetti dalla rete Fabric
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.getAllOrganizations = async (req, res, next) => {
  try {
    const channel = "identity-channel";
    const chaincode = "organization";
    const userId = "publicUser";
    const organization = "ospedale-maresca.aslnapoli3.medchain.com";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const resultString = await fabric.evaluateTransaction(
      "GetAllOrganizations"
    );
    const result = JSON.parse(resultString);

    res.status(200).json({
      message: "Organizations retrieved successfully",
      organizations: result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.initializeLedger = async (req, res, next) => {
  try {
    const channel = "identity-channel";
    const chaincode = "organization";
    const userId = "Admin@ospedale-maresca.aslnapoli3";
    const organization = "ospedale-maresca.aslnapoli3.medchain.com";

    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Verifica se il ledger è già inizializzato
    const checkResultString = await fabric.evaluateTransaction(
      "GetAllOrganizations"
    );
    let checkResult;
    try {
      checkResult = JSON.parse(checkResultString);
    } catch (error) {
      console.error(
        "Error parsing JSON for GetAllOrganizations:",
        error.message
      );
      checkResult = null;
    }

    if (checkResult && checkResult.length > 0) {
      console.log("Ledger is already initialized");
      return res.status(200).json({
        message: "Ledger is already initialized",
        result: checkResult,
      });
    } else {
      // Initialize the ledger
      const initResultString = await fabric.submitTransaction("InitLedger");
      let initResult;
      try {
        initResult = JSON.parse(initResultString);
      } catch (error) {
        console.error("Error parsing JSON for InitLedger:", error.message);
        initResult = { message: "Ledger initialized successfully" };
      }

      return res.status(200).json({
        message: "Ledger initialized successfully",
        result: initResult,
      });
    }
  } catch (error) {
    console.error("Error during ledger initialization:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
