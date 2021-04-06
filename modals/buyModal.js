const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buyModalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    tokenId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Buymodalschema', buyModalSchema);
