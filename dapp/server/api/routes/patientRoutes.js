const express = require('express');
const router = express.Router();
const { addPatient, getPatient } = require('../../blockchain/contracts/patient');

router.post('/patients', async (req, res) => {
    try {
        await addPatient(req.body.org, req.body.patientData);
        console.log("Aggiunto")
        res.status(201).send('Patient added successfully.');
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

router.get('/patients/:id', async (req, res) => {
    try {
        const patient = await getPatient(req.query.org, req.params.id);
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

module.exports = router;