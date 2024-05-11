const FabricNetwork = require('../../blockchain/fabric');
const fabric = new FabricNetwork();


exports.getOrganizationDetails = async (req, res, next) => {
    const organizationID = req.params.id;
    
    try {
        const organizationDetails = await fabric.evaluateTransaction('GetOrganization', organizationID);
        res.status(200).json({ organization: JSON.parse(organizationDetails) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createOrganization = async (req, res, next) => {
    const organizationID = req.params.id
    const organizationJSON  = req.body;
    
    try {
        const result = await fabric.submitTransaction('CreateOrganization', organizationID, organizationJSON);
        res.status(201).json({ message: 'Organization created successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateOrganization = async (req, res, next) => {
    const organizationID = req.params.id;
    const updatedOrganization = req.body.updatedOrganization; 

    try {
        const result = await fabric.submitTransaction('UpdateOrganization', organizationID, JSON.stringify(updatedOrganization));
        res.status(200).json({ message: 'Organization updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteOrganization = async (req, res, next) => {
    const organizationID = req.params.id;

    try {
        const result = await fabric.submitTransaction('DeleteOrganization', organizationID);
        res.status(200).json({ message: 'Organization deleted successfully', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchOrganizationsByType = async (req, res, next) => {
    const query = req.params.query;

    try {
        const result = await fabric.submitTransaction('SearchOrganizationsByType', query);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchOrganizationByName = async (req, res, next) => {
    const query = req.params.query;

    try {
        const result = await fabric.submitTransaction('SearchOrganizationByName', query);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addEndpoint = async (req, res, next) => {
    const organizationID = req.params.id;
    const endpoint = req.body.endpoint;

    try {
        const result = await fabric.submitTransaction('AddEndpoint', organizationID, endpoint);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.addQualification = async (req, res, next) => {
    const organizationID = req.params.id;
    const qualification = req.body.qualification;

    try {
        const result = await fabric.submitTransaction('AddQualification', organizationID, qualification);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeEndpoint = async (req, res, next) => {
    const organizationID = req.params.id;

    try {
        const result = await fabric.submitTransaction('RemoveEndpoint', organizationID);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeQualification = async (req, res, next) => {
    const organizationID = req.params.id;
    const qualificationIndex = req.params.index;

    try {
        const result = await fabric.submitTransaction('RemoveQualification', organizationID, qualificationIndex);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateEndpoint = async (req, res, next) => {
    const organizationID = req.params.id;
    const updatedEndpoint = req.body.updatedEndpoint;

    try {
        const result = await fabric.submitTransaction('UpdateEndpoint', organizationID, updatedEndpoint);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateContact = async (req, res, next) => {
    const organizationID = req.params.id;
    const updatedContact = req.body.updatedContact;

    try {
        const result = await fabric.submitTransaction('UpdateContact', organizationID, updatedContact);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateQualification = async (req, res, next) => {
    const organizationID = req.params.id;
    const updatedQualification = req.body.updatedQualification;
    const qualificationIndex = req.params.index;

    try {
        const result = await fabric.submitTransaction('UpdateQualification', organizationID, updatedQualification, qualificationIndex);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getParentOrganization = async (req, res, next) => {
    const organizationID = req.params.id;

    try {
        const result = await fabric.submitTransaction('GetParentOrganization', organizationID);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateParentOrganization = async (req, res, next) => {
    const organizationID = req.params.id;
    const parentOrganization = req.body.parentOrganization;

    try {
        const result = await fabric.submitTransaction('UpdateParentOrganization', organizationID, parentOrganization);
        res.status(200).json({ result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
