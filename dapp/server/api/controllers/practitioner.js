const FabricNetwork = require("../../blockchain/fabric");

const fabric = new FabricNetwork();

exports.createPractitioner = async (req, res, next) => {
  const { organization, fhirData } = req.body;

  try {
    const channel = "identity-channel";
    const chaincode = "practitioner";
    const userId = fhirData.identifier.value;
    console.log("pre init");
    await fabric.init(userId, organization, channel, chaincode);
    console.log("Fabric network initialized successfully.");

    // Validate and stringify JSON
    let practitionerJSONString;
    try {
      practitionerJSONString = JSON.stringify(fhirData);
      JSON.parse(practitionerJSONString); // This ensures the string is valid JSON
    } catch (jsonError) {
      console.error("Invalid JSON format:", jsonError);
      return { error: "Invalid JSON format" };
    }

    // Log the JSON string
    console.log(
      "Submitting transaction with practitioner JSON:",
      practitionerJSONString
    );

    const result = await fabric.submitTransaction(
      "CreatePractitioner",
      practitionerJSONString
    );

    return { message: "Practitioner created successfully", result: result };
  } catch (error) {
    return { error: error.message };
  } finally {
    fabric.disconnect();
    console.log("Disconnected from Fabric gateway.");
  }
};

exports.readPractitioner = async (req, res, next) => {
    const userID = req.params.userid
    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const practitioner = await fabric.evaluateTransaction('ReadPractitioner', userID);
        res.status(200).json({ practitioner: JSON.parse(practitioner) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.updatePractitioner = async (req, res, next) => {
    const updatedPractitioner = req.body;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('UpdatePractitioner', userID, JSON.stringify(updatedPractitioner));
        res.status(200).json({ message: 'Practitioner updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.deletePractitioner = async (req, res, next) => {
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('DeletePractitioner', userID);
        res.status(200).json({ message: 'Practitioner deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.createProcedure = async (req, res, next) => {
    const procedureJSON = req.body;
    const userID = req.params.userid
    try {

        const procedureID = uuidv4();
        procedureJSON.id.value = procedureID;

        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";
        
        // Validate and stringify JSON
        let procedureJSONString;
        try {
            procedureJSONString = JSON.stringify(procedureJSON);
            JSON.parse(practitionerJSONString); // This ensures the string is valid JSON
        } catch (jsonError) {
            console.error("Invalid JSON format:", jsonError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        // Log the JSON string
        console.log("Submitting transaction with procedure JSON:", procedureJSONString);


        const result = await fabric.submitTransaction('CreateProcedure',  JSON.stringify(procedureJSON));
        res
        .status(201)
        .json({ message: "Procedure created successfully", result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.readProcedure = async (req, res, next) => {
    const procedureID = req.params.procedureid;
    const userID = req.params.userid
    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const procedure = await fabric.evaluateTransaction('ReadProcedure', procedureID);
        res.status(200).json({ procedure: JSON.parse(procedure) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.updateProcedure = async (req, res, next) => {
    const procedureID = req.params.procedureid;
    const updatedProcedure = req.body;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('UpdateProcedure', procedureID, JSON.stringify(updatedProcedure));
        res.status(200).json({ message: 'Procedure updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};


exports.deleteProcedure = async (req, res, next) => {
    const procedureID = req.params.procedureid;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('DeleteProcedure', procedureID);
        res.status(200).json({ message: 'Procedure deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.createCondition = async (req, res, next) => {
    const conditionJSON = req.body;
    const userID = req.params.userid
    try {

        const conditionID = uuidv4();
        conditionJSON.id.value = conditionID;

        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";
        
        // Validate and stringify JSON
        let conditionJSONString;
        try {
            conditionJSONString = JSON.stringify(conditionJSON);
            JSON.parse(conditionJSONString); // This ensures the string is valid JSON
        } catch (jsonError) {
            console.error("Invalid JSON format:", jsonError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        // Log the JSON string
        console.log("Submitting transaction with condition JSON:", conditionJSONString);


        const result = await fabric.submitTransaction('CreateCondition',  JSON.stringify(conditionJSON));
        res
        .status(201)
        .json({ message: "Condition created successfully", result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.readCondition = async (req, res, next) => {
    const conditionID = req.params.conditionid;
    const userID = req.params.userid
    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const condition = await fabric.evaluateTransaction('ReadCondition', conditionID);
        res.status(200).json({ condition: JSON.parse(condition) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.updateCondition = async (req, res, next) => {
    const conditionID = req.params.conditionid;
    const updatedCondition = req.body;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('UpdateCondition', conditionID, JSON.stringify(updatedCondition));
        res.status(200).json({ message: 'Condition updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.deleteCondition = async (req, res, next) => {
    const conditionID = req.params.conditionid;
    const userID = req.params.userid

    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");
        const result = await fabric.submitTransaction('DeleteCondition', conditionID);
        res.status(200).json({ message: 'Condition deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.createAnnotation = async (req, res, next) => {
    const annotationJSON = req.body;
    const userID = req.params.userid
    const procedureID = req.params.procedureid;
    try {

        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";
        
        // Validate and stringify JSON
        let annotationJSONString;
        try {
            annotationJSONString = JSON.stringify(annotationJSON);
            JSON.parse(annotationJSONString); // This ensures the string is valid JSON
        } catch (jsonError) {
            console.error("Invalid JSON format:", jsonError);
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        // Log the JSON string
        console.log("Submitting transaction with annotation JSON:", annotationJSONString);


        const result = await fabric.submitTransaction('CreateAnnotation',  procedureID, JSON.stringify(annotationJSON));
        res
        .status(201)
        .json({ message: "Annotation created successfully", result: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};

exports.readAnnotation = async (req, res, next) => {
    const procedureID = req.params.procedureid;
    const annotationIndex = req.params.annotationindex;
    const userID = req.params.userid
    try {
        const organization = "patients.medchain.com";
        const channel = "patient-records-channel";
        const chaincode = "practitioner";

        await fabric.init(userID, organization, channel, chaincode);
        console.log("Fabric network initialized successfully.");

        const condition = await fabric.evaluateTransaction('ReadAnnotation', procedureID, annotationIndex);
        res.status(200).json({ condition: JSON.parse(condition) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        // Disconnetti dalla rete Fabric
        fabric.disconnect();
        console.log("Disconnected from Fabric gateway.");
    }
};
