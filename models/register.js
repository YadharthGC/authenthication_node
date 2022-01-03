const mongoose = require("mongoose");
const registerSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  gmail: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  code: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("registers", registerSchema);
