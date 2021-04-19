
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokennotlistSchema = new Schema({
    assetName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    ipfsHash: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true
    },
    soldStatus: {
        type: String,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('TokennotlistedSchema', tokennotlistSchema);

