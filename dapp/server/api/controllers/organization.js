const FabricNetwork = require("../../blockchain/fabric");
const fabric = new FabricNetwork();

exports.getOrganizationDetails = async (req, res, next) => {
  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.evaluateTransaction("ReadOrganization", userID);
    res.status(200).json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.createOrganization = async (req, res, next) => {
  const userID = req.user.userId;
  const organization = req.user.organization;
  const organizationJSON = req.body;

  try {
    const channel = "identity-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let organizationJSONString;
    try {
      organizationJSONString = JSON.stringify(organizationJSON);
      JSON.parse(organizationJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return res.status(400).json({ error: "Invalid JSON format" });
    }

    console.log(
      "Submitting transaction with organization JSON:",
      organizationJSONString
    );

    const result = await fabric.submitTransaction(
      "CreateOrganization",
      organizationJSONString
    );

    res.status(200).json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.updateOrganization = async (req, res, next) => {
  const userID = req.user.userId;
  const organization = req.user.organization;
  const organizationJSON = req.body;

  try {
    const channel = "identity-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");
    const result = await fabric.submitTransaction(
      "UpdateOrganization",
      userID,
      JSON.stringify(organizationJSON)
    );

    res.status(200).json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.deleteOrganization = async (req, res, next) => {
  const userID = req.user.userId;
  const organization = req.user.organization;
  const { orgid } = req.body;

  try {
    const channel = "identity-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    const result = await fabric.submitTransaction(
      "DeleteOrganization",
      userID,
      JSON.stringify(orgid)
    );

    res.status(200).json(JSON.parse(result));
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.searchOrganizations = async (req, res, next) => {
  const queryString = req.params.query || { selector: {} };

  const userID = req.user.userId;
  const organization = req.user.organization;

  try {
    const channel = "identity-channel";
    const chaincode = "organization";

    await fabric.init(userID, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    let queryJSONString;
    try {
      queryJSONString = JSON.stringify(queryString);
      JSON.parse(queryJSONString);
    } catch (jsonError) {
      console.error("Invalid JSON Format: ", jsonError);
      return res.status(400).json({ error: "Invalid JSON Format" });
    }

    console.log(
      "Submitting query transaction with query JSON string:",
      queryJSONString
    );

    const resultString = await fabric.submitTransaction(
      "SearchOrganizations",
      queryJSONString
    );

    let results;
    try {
      results = JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse result string: ", error);
      return res.status(500).json({ error: "Failed to parse result string" });
    }

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};
