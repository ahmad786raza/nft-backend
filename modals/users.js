
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    assetName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    artImage: {
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
    createdAt: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('Userschema', userSchema);

