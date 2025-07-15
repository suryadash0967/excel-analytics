const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    originalName: String,
    storedFilename: String,
    filePath: String,
    uploadDate: { type: Date, default: Date.now },
    chartPreferences: {
        xAxis: String,
        yAxis: String,
        chartType: String,
    },
});

module.exports = mongoose.model("Upload", uploadSchema);
