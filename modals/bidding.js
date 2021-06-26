const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BiddingSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.ObjectId,
    ref: "users",
  },
  nftTokenId: {
    type: Number,
    required: true,
  },
  tokenBidPrice: {
    type: Number,
    required: true,
  },
  bidTime: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["REQUESTED", "WIN","NOT-WIN"],
    default: "REQUESTED"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("biddingschema", BiddingSchema);
