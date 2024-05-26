const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();


exports.getOrganizationDetails = async (req, res, next) => {
    const userID = req.params.userid
    const organization = req.body
    try {
       
        const channel = "organizations-channel";
        const chaincode = "organization";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const result = await fabric.evaluateTransaction('ReadOrganization', userID);
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
    const { organization , updatedOrganization } = req.body;
    const userID = req.params.userid

    try {
        
        const channel = "organizations-channel";
        const chaincode = "organization";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('UpdateOrganization', userID, JSON.stringify(updatedOrganization));
        res.status(200).json({ message: 'Organization updated successfully', result });
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
    const userID = req.params.userid

    try {
        
        const channel = "organizations-channel";
        const chaincode = "organization";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('DeleteOrganization', userID, JSON.stringify(orgid));
        res.status(200).json({ message: 'Organization deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    };
};

exports.searchOrganizationsByType = async (req, res, next) => {
    const userID = req.params.userid
    const query = req.params.query
    const organization  = req.body
    try {
       
        const channel = "organizations-channel";
        const chaincode = "organization";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const result = await fabric.evaluateTransaction('SearchOrganizationsByType', JSON.stringify(query));
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
    const userID = req.params.userid
    const query = req.params.query
    const organization  = req.body
    try {
       
        const channel = "organizations-channel";
        const chaincode = "organization";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const result = await fabric.evaluateTransaction('SearchOrganizationByName', JSON.stringify(query));
        res.status(200).json({ organization: JSON.parse(result) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

