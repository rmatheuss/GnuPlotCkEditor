const mongoose = require('mongoose');

const PlotSchema = new mongoose.Schema({
    key: String, 
    xRange: String,
    yRange: String,
    plotTy: String,
    plotTitle: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model("Plot", PlotSchema);