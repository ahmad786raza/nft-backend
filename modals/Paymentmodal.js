const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentModalSchema = new Schema({
    assetName: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    },
    newOwnerAddrs: {
        type: String,
        required: true
    },
    contractAddrs: {
        type: String,
        required: true
    },
    fromAddrs: {
        type: String,
        required: true
    },
    boughtTokenHash: {
        type: String,
        required: true
    },
    transferTokenHash: {
        type: String,
        required: true
    },
    tokenPrice: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('paymentschema', PaymentModalSchema);
