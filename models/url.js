const mongoose = require("mongoose");
const urlSchema = new mongoose.Schema({
  urls: {
    type: String,
    required: true,
  },
  shorts: {
    type: String,
    default: "",
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userid: {
    type: String,
    default: "",
  },
});
module.exports = mongoose.model("urls", urlSchema);
