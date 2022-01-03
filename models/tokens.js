const mongoose = require("mongoose");
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
  },
  ids: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("tokens", tokenSchema);
