const FabricNetwork = require("../../blockchain/fabric");
const { v4: uuidv4 } = require("uuid");
const fabric = new FabricNetwork();

exports.createObservation = async (req, res, next) => {
    const observationJSON = req.body;
    const userID = req.user.userId;
    const organization = req.user.organization;
    try {
        const observationID = uuidv4();
        const channel = "patient-records-channel";
        const chaincode = "observation";

        observationJSON.id.value = observationID;

        if (
            !(await isAuthorized(
                userID,
                organization,
                observationJSON.subject.reference
            ))
        ) {
            return res.status(403).json({ error: "User not approved" });
        }

        // Validate and stringify JSON
        let observationJSONString;
        try {
            observationJSONString = JSON.stringify(observationJSON);
            JSON.parse(observationJSONString);
        } catch (jsonError) {
            console.error("Invalid JSON format:", jsonError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const result = await fabric.submitTransaction(
            "CreateObservation",
            observationJSONString
        );
        res.status(201).json({ result: result });
    } catch (error) {
        console.error("Failed to create observation:", error);
        res.status(500).json({ error: "Failed to create observation" });
    } finally {
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.getObservation = async (req, res, next) => {
    const observationID = req.params.id;
    const userID = req.user.userId;
    const organization = req.user.organization;
    try {
        const channel = "patient-records-channel";
        const chaincode = "observation";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const observationString = await fabric.evaluateTransaction(
            "ReadObservation",
            observationID
        );

        const observation = JSON.parse(observationString);

        if (
            !(await isAuthorized(userID, organization, observation.subject.reference))
        ) {
            return res.status(403).json({ error: "User not approved" });
        }

        res.status(200).json({ observation: observation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.updateObservation = async (req, res, next) => {
    const observationID = req.params.id;
    const updatedObservation = req.body;
    const userID = req.user.userId;
    const organization = req.user.organization;
    try {
        if (
            !(await isAuthorized(
                userID,
                organization,
                updatedObservation.subject.reference
            ))
        ) {
            return res.status(403).json({ error: "User not approved" });
        }

        const channel = "patient-records-channel";
        const chaincode = "observation";

        let observationJSONString;
        try {
            observationJSONString = JSON.stringify(updatedObservation);
            JSON.parse(observationJSONString);
        } catch (jsonError) {
            console.error("Invalid JSON format:", jsonError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction(
            "UpdateObservation",
            observationID,
            observationJSONString
        );

        res.status(200).json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.deleteObservation = async (req, res, next) => {
    const observationID = req.params.id;
    const userID = req.user.userId;
    const organization = req.user.organization;

    try {
        const channel = "patient-records-channel";
        const chaincode = "observation";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const observationString = await fabric.evaluateTransaction(
            "ReadObservation",
            observationID
        );
        const observation = JSON.parse(observationString);

        if (
            !(await isAuthorized(userID, organization, observation.subject.reference))
        ) {
            return res.status(403).json({ error: "User not approved" });
        }

        const result = await fabric.submitTransaction(
            "DeleteObservation",
            observationID
        );
        res.status(200).json({ result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.searchObservations = async (req, res, next) => {
    const queryString = req.params.query || { selector: {} };

    const userID = req.user.userId;
    const organization = req.user.organization;

    try {
        const channel = "patient-records-channel";
        const chaincode = "observation";

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
            "SearchObservations",
            queryJSONString
        );

        let results;
        try {
            results = JSON.parse(resultString);
        } catch (error) {
            console.error("Failed to parse result string: ", error);
            return res.status(500).json({ error: "Failed to parse result string" });
        }

        res.status(200).json({ results: results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

async function isAuthorized(userID, organization, patientReference) {
    const identity_channel = "identity-channel";
    const auth_chaincode = "patient";

    const patientID = patientReference.split("/")[1];

    await fabric.init(userID, organization, identity_channel, auth_chaincode);
    console.log("Verifying user...");

    const authBool = await fabric.submitTransaction(
        "IsAuthorized",
        patientID,
        userID
    );

    fabric.disconnect();
    if (authBool === "false") {
        console.log("User not approved", userID);
        return false;
    }

    console.log("User approved with success", userID);
    return true;
}
