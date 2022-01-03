const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/newpass", (err) => {
  if (err) return console.log(error);
  console.log("connected to mongodb");
});
