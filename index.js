const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3002;
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
//////////////
require("./db");
const registerrouter = require("./routes/register");
const loginrouter = require("./routes/login");
const verifyrouter = require("./routes/verify");
const fmailrouter = require("./routes/fmail");
const newpassrouter = require("./routes/newpass");
const urlrouter = require("./routes/url");
const geturlrouter = require("./routes/gettable");
const webuserrouter = require("./routes/webuser");

app.use("/register", registerrouter);
app.use("/login", loginrouter);
app.use("/verify", verifyrouter);
app.use("/fmail", fmailrouter);
app.use("/newpass", newpassrouter);
app.use("/urls", urlrouter);
app.use("/geturl", geturlrouter);
app.use("/api", webuserrouter);

//////////////////
app.listen(port, function () {
  console.log("app running");
});
