const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://ganesh:chitra@cluster0.2pjhw.mongodb.net/URL?retryWrites=true&w=majority",
  (err) => {
    if (err) return console.log(error);
    console.log("connected to mongodb");
  }
);
