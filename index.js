const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
//const url = "mongodb://localhost:27017";
const url =
  "mongodb+srv://ganesh:chitra@cluster0.2pjhw.mongodb.net/booking?retryWrites=true&w=majority";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nodemailer = require("nodemailer");
const port = process.env.PORT || 3003;
const transporter = nodemailer.createTransport({
  service: "Hotmail",
  auth: {
    user: "newnode12345@hotmail.com",
    pass: "nodemailer@",
  },
});

// create reusable transporter object using the default SMTP transport
// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: "bettye.thompson38@ethereal.email",
//     pass: "2RgaAx8x2b3T4wfxBf",
//   },
// });
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
var toke;
const randomToken = require("random-token").create(
  "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
);
var token = () => {
  toke = randomToken(16);
};
//////////////////////////////

function authenthicate(req, res, next) {
  try {
    if (req.headers.authorization) {
      jwt.verify(
        req.headers.authorization,
        "RQEU8dxgqMpuK73s",
        function (error, decoded) {
          if (error) {
            console.log(error);
            console.log("error1");
          } else {
            console.log(decoded);
            req.userid = decoded.userid;
            console.log(req.userid);
            next();
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
    console.log("error2");
  }
}
var vcodes;
var val = () => {
  vcodes = Math.floor(1000 + Math.random() * 9000);
};

app.post("/register", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("password");
    val();
    req.body.vcode = vcodes;
    req.body.verified = false;
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    console.log(req.body);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let info = await transporter.sendMail({
      from: "newnode12345@hotmail.com",
      to: `${req.body.gmail}`,
      subject: "Verify your account ✔",
      html: `<b>${req.body.vcode}</b>`,
    });
    console.log("Message sent: %s", info.messageId);
    let post = await db.collection("registers").insertOne(req.body);
  } catch (error) {
    console.log(error);
    console.log("register error");
  }
});

app.post("/login", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("password");
    req.body.userid = req.userid;
    let user = await db
      .collection("registers")
      .findOne({ gmail: req.body.gmail });
    if (user) {
      if (user.verified) {
        let match = await bcrypt.compareSync(req.body.password, user.password);
        console.log(match);
        if (match) {
          let token = jwt.sign({ id: user._id }, "RQEU8dxgqMpuK73s");
          res.json({
            message: true,
            token,
          });
        } else {
          res.json({
            message: "password incorrect",
          });
          console.log("password incorrect");
        }
      } else {
        res.json({
          message: "gmail is not verified",
          id: user._id,
        });
        console.log("gmail not verified");
        console.log(user._id);
      }
    } else {
      res.json({
        message: "gmail not registered",
      });
      console.log("gmail not registered");
    }
  } catch (error) {
    console.log(error);
    console.log("login failed");
  }
});

app.post("/code", async function (req, res) {
  try {
    console.log(req.body);
    let client = await mongoclient.connect(url);
    let db = client.db("password");
    let get = await db.collection("registers").findOne({
      _id: mongodb.ObjectId(req.body.did),
    });
    console.log(get);
    await parseInt(req.body.code);
    if (req.body.code == get.vcode) {
      console.log("yes");
      let put = await db.collection("registers").findOneAndUpdate(
        {
          _id: mongodb.ObjectId(req.body.did),
        },
        {
          $set: {
            verified: true,
          },
        }
      );
      res.json({
        message: "Account verified",
      });
    } else {
      res.json({
        message: "wrong code",
      });
    }
  } catch (error) {}
});

app.post("/fmail", async function (req, res) {
  try {
    let client = await mongoclient.connect(url);
    let db = client.db("password");
    let get = await db
      .collection("registers")
      .findOne({ gmail: req.body.gmail });
    if (get) {
      token();
      let did = get._id;
      console.log(req.body, toke, did);
      let post = await db.collection("reset").insertOne({ toke, did });
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      let info = await transporter.sendMail({
        from: "newnode12345@hotmail.com",
        to: `${req.body.gmail}`,
        subject: "Password reset✔",
        html: ` <b>http://localhost:3000/${toke}/${get._id}</b>`,
      });
      console.log("Message sent: %s", info.messageId);
      res.json({
        message: "reset link is sent",
        status: true,
      });
    } else {
      res.json({
        message: "gmail not found",
      });
      console.log(error);
    }
  } catch (error) {
    console.log(error);
    console.log("fmail error");
  }
});

app.post("/fpass", async function (req, res) {
  try {
    console.log(req.body);
    let client = await mongoclient.connect(url);
    let db = await client.db("password");
    let user = await db.collection("reset").findOne({ toke: req.body.toke });
    if (user) {
      console.log("ok1");
      if (user.did == req.body.did) {
        console.log("ok2");
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        let put = await db.collection("registers").findOneAndUpdate(
          {
            _id: mongodb.ObjectId(user.did),
          },
          {
            $set: {
              password: req.body.password,
            },
          }
        );
        let del = await db
          .collection("reset")
          .findOneAndDelete({ toke: user.toke });
        res.json({
          message: "password is changed",
        });
        console.log("fullok");
      } else {
        res.json({
          message: "something wrong",
        });
      }
    } else {
      res.json({
        message: "something wrong",
      });
    }
  } catch (error) {
    console.log(error);
    console.log("fpass error");
  }
});
//////////////////////////////
app.listen(port, function () {
  console.log(`App is Running in ${port}`);
});
