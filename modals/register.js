
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registerSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPass: {
        type: String,
        required: true
    },
    userType: {
        type: Number,
        required: true,
        default:1                  //1=>user ,2=admin
    },
    token: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})


module.exports = mongoose.model('Registerschema', registerSchema);

