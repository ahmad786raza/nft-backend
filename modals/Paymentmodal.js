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
    tonewOwnerAddrs: {
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
    platformfees: {
        type: Number
        // required: true
    },
    transactionfee: {
        type: Number
        // required: true
    },
    amtSendToTokenOwner: {
        type: Number
        // required: true
    },
    etherSentTransId: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('paymentschema', PaymentModalSchema);
