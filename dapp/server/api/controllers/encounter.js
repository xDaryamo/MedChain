const FabricNetwork = require('../../blockchain/fabric');
const { v4: uuidv4 } = require('uuid');
const fabric = new FabricNetwork();

exports.createEncounter = async (req, res, next) => {
    const encounterJSON = req.body;
    const userID = req.params.userid
    try {

        const encounterID = uuidv4();
        encounterJSON.id.value = encounterID;

        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "encounter";
        
        // Validate and stringify JSON
        let encounterJSONString;
        try {
            encounterJSONString = JSON.stringify(encounterJSON);
            JSON.parse(encounterJSONString); // This ensures the string is valid JSON
        } catch (jsonError) {
            console.error("Invalid JSON format:", jsonError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        // Log the JSON string
        console.log("Submitting transaction with encounter JSON:", encounterJSONString);


        const result = await fabric.submitTransaction('CreateEncounter',  JSON.stringify(encounterJSON));
        res
        .status(201)
        .json({ message: "Encounter created successfully", result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.getEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const userID = req.params.userid
    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "encounter";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const encounter = await fabric.evaluateTransaction('ReadEncounter', encounterID);
        res.status(200).json({ encounter: JSON.parse(encounter) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.updateEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const updatedEncounter = req.body;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "encounter";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('UpdateEncounter', encounterID, JSON.stringify(updatedEncounter));
        res.status(200).json({ message: 'Encounter updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.deleteEncounter = async (req, res, next) => {
    const encounterID = req.params.encounterid;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "encounter";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('DeleteEncounter', encounterID);
        res.status(200).json({ message: 'Encounter deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.queryEncounter = async (req, res, next) => {
    const query = req.params.query;
    const userID = req.params.userid;

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "encounter";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        let result;
        if (query.startsWith("status:")) {
            const status = query.substring(7); // Remove "status:" prefix
            result = await fabric.evaluateTransaction('SearchEncountersByStatus', status);
        } else if (query.startsWith("type:")) {
            const typeCode = query.substring(5); // Remove "type:" prefix
            result = await fabric.evaluateTransaction('SearchEncountersByType', typeCode);
        } else {
            return res.status(400).json({ error: "Invalid query format" });
        }

        const encounters = JSON.parse(result);
        res.status(200).json({ encounters });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnect from Fabric network
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
}


