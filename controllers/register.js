const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = require("../models/register");
var val;
var valz = () => {
  val = Math.floor(1000 + Math.random() * 9000);
};
const nodemailer = require("nodemailer");
const tokens = require("../models/tokens");
const url = require("../models/url");
const randomToken = require("random-token").create(
  "abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var token = randomToken(16);
const shortid = require("shortid");
var shorts;
const shortsz = () => {
  shorts = shortid.generate();
};

exports.authenthicate = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      await jwt.verify(
        req.headers.authorization,
        "eDteRaDBVAjh3W8K",
        function (error, decoded) {
          if (error) {
            console.log(error);
          } else {
            req.userid = decoded.id;
            next();
          }
        }
      );
    } else {
      console.log("there is some error");
      console.log(Error);
    }
  } catch (error) {
    console.log(error);
  }
};
exports.registeruser = async (req, res) => {
  valz();
  let get = await register.findOne({
    gmail: req.body.gmail,
  });
  if (get) {
    console.log("already registered");
    res.json({
      message: "Gmail is already registered",
      status: "al",
    });
  } else {
    const { fname, lname, gmail, password } = req.body;
    const newregister = new register({ fname, lname, gmail, password });
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(newregister.password, salt);
    newregister.password = hash;
    newregister.code = val;
    console.log(newregister);

    let transporter = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
        user: "newnode12345@hotmail.com",
        pass: "nodemailer@",
      },
    });

    let info = await transporter.sendMail({
      from: "newnode12345@hotmail.com",
      to: `${req.body.gmail}`,
      subject: "Verification code",
      html: `Your verification code is ${val}`,
    });
    await newregister.save();
    res.json({
      message: "Verificaion code is sent.please do check spam",
      id: newregister._id,
      status: true,
    });
  }
};
exports.loginuser = async (req, res) => {
  try {
    console.log(req.body);
    let get = await register.findOne({
      gmail: req.body.gmail,
    });
    if (get) {
      if (get.verified === true) {
        let match = bcrypt.compareSync(req.body.password, get.password);
        console.log(match);
        if (match) {
          let token = jwt.sign({ id: get._id }, "eDteRaDBVAjh3W8K");
          console.log(token);
          res.json({
            message: `welcome ${get.fname + "" + get.lname}`,
            status: true,
            token,
          });
        } else {
          console.log("password is wrong");
          res.json({
            message: "password incorrect",
          });
        }
      } else {
        console.log("Account is not verified");
        res.json({
          message: "Account is not verified",
          status: true,
          id: `${get._id}`,
        });
      }
    } else {
      res.json({
        message: "Account is not Registered",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.verifyuser = async (req, res) => {
  try {
    console.log(req.body);
    let get = await register.findById(req.body.did);
    if (get) {
      if (req.body.password == get.code) {
        let put = await register.findByIdAndUpdate(req.body.did, {
          $set: {
            verified: true,
          },
        });
        await put.save();
        res.json({
          message: "Account verified",
          status: true,
        });
      } else {
        res.json({
          message: "Incorrect code",
        });
      }
    } else {
      res.json({
        message: "not such account",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.fmailuser = async (req, res) => {
  try {
    console.log(req.body.gmail);
    let get = await register.findOne({
      gmail: req.body.gmail,
    });
    console.log(get);
    if (get) {
      let ids = get._id;
      console.log(token, ids);
      let newtoken = new tokens({
        token,
        ids,
      });
      console.log(newtoken);
      await newtoken.save();

      let transporter = nodemailer.createTransport({
        service: "Hotmail",
        auth: {
          user: "newnode12345@hotmail.com",
          pass: "nodemailer@",
        },
      });

      let info = transporter.sendMail({
        from: "newnode12345@hotmail.com",
        to: `${req.body.gmail}`,
        subject: "Forgot password",
        html: `use this link to change your password http://localhost:3000/${token}/${ids}`,
      });
      console.log("Message sent: %s", info.messageId);
      res.json({
        message: "forgot password link is sent.please do check spam",
        status: true,
      });
    } else {
      res.json({
        message: "Gmail doesnot exsists",
      });
      console.log("gmail doesnot exsists");
    }
  } catch (error) {
    console.log(error);
  }
};
exports.newpassuser = async (req, res) => {
  try {
    console.log(req.body);
    let get = await tokens.findOne({ token: req.body.token });
    console.log(get);
    if (get) {
      let salt = await bcrypt.genSaltSync(10);
      let hash = await bcrypt.hashSync(req.body.password, salt);
      req.body.password = hash;
      let put = await register.findByIdAndUpdate(req.body.did, {
        $set: {
          password: req.body.password,
        },
      });
      let del = await tokens.findOneAndDelete({ token: req.body.token });
      res.json({
        message: "Password is changed",
        status: true,
      });
    } else {
      console.log("invalid link");
      res.json({
        message: "Invalid Link",
      });
    }
  } catch (error) {
    console.log(error);
  }
};
exports.urluser = async (req, res, next) => {
  try {
    await shortsz();
    console.log(req.body);
    req.body.userid = req.userid;
    const { urls, clicks, userid } = req.body;
    const newurls = new url({ urls, shorts, clicks, userid });
    console.log(newurls);
    await newurls.save();
  } catch (error) {}
};
exports.geturl = async (req, res, next) => {
  try {
    let get = await url.find({ userid: req.userid });
    res.json(get);
  } catch (error) {
    console.log(error);
  }
};
exports.webuser = async (req, res) => {
  try {
    let ids = req.params.did;
    let get = await url.findOne({ shorts: ids });
    console.log(get);
    let put = await url.findOneAndUpdate(
      { shorts: req.params.did },
      {
        $set: {
          clicks: get.clicks + 1,
        },
      }
    );
    res.redirect(get.urls);
  } catch (error) {
    console.log(error);
  }
};
