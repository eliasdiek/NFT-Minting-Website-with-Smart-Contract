var mongoose = require('mongoose');

const MetaSchema = new mongoose.Schema({
    tokenId: { type: String, required: true },
    jsonHash: { type: String, required: true },
    status: { type: Number, required: true, default: 0 }
});

exports.metadata = mongoose.model('metadata', MetaSchema);
