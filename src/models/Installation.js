const mongoose = require('mongoose');

const installationSchema = new mongoose.Schema(
    {
        isInstalled: {
            type: Boolean,
            required: [true],
            default: true
        },
        installedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true]
        },
        installedAt: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true
    }
);

const Installation = mongoose.model('Installation', installationSchema);
module.exports = Installation;