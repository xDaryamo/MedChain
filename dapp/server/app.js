const express = require("express");
const bodyParser = require('body-parser');


const patientRoutes = require('./api/routes/patient');

const app = express();

app.use(patientRoutes);


app.use((req, res, next) => {
    res.status(404).send('Page not found');
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;