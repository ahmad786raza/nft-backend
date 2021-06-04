
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    assetName: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        default: null
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
        required: true
    },
    username:{
        type:String,
        required:true
    },
    listingtype:{
        type:String,
        required:false,
        default:"Not-Listed"
    },
    hide: {
        type: String,
        default: "Not-Hidden"
    },
    soldStatus: {
        type: String,
        default: 0
    },
    newOwnerAddrress: {
        type: String
        // required: true
    },
    count:{
        type:Number,
        default:0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


module.exports = mongoose.model('Userschema', userSchema);

