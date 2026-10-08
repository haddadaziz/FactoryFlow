const mongoose = require('mongoose');

mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB déconnecté.');
});

mongoose.connection.on('error', (err) => {
    console.error(`Erreur de connexion MongoDB : ${err}`);
});

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connecté : ${conn.connection.host}`);
    } catch (e) {
        console.error(e);
        process.exit(1);
    };
};

module.exports = connectDB;