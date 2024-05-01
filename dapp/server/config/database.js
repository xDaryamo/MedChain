const mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/medchain'; 


const options = {
    useNewUrlParser: true,    
    useUnifiedTopology: true, 
    useCreateIndex: true,     
    useFindAndModify: false   
};


const connectDB = async () => {
    try {
        await mongoose.connect(dbURI, options);
        console.log("Database connection established!");
    } catch (err) {
        console.log("Error connecting Database instance due to:", err);
        setTimeout(connectDB, 5000);
    }
};

connectDB();

module.exports = { connectDB };
