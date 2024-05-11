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
    const { organizationID, organizationJSON } = req.body;
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
