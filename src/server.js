require('dotenv').config();

const app = require('./app.js');
const connectDb = require('./config/db.js');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDb();

    app.listen(PORT,'0.0.0.0', () => {
        console.log(`serveur pret sur ${PORT} en mode ${process.env.NODE_ENV}`);
    });
};

startServer();