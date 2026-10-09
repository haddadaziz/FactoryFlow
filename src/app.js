const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler.js');
const AppError = require('./utils/AppError.js');
const installationRoutes = require('./routes/installationRoutes.js');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes.js');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes.js');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({ "status": "success", "message": "FactoryFlow API is running" });
});

app.use('/api/installation',installationRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/raw-materials',rawMaterialRoutes);
app.use('/api/users',userRoutes);

app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} introuvable sur ce serveur`, 404));
});

app.use(errorHandler);

module.exports = app;