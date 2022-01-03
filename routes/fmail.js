const { fmailuser } = require("../controllers/register");

const router = require("express").Router();
router.post("/", fmailuser);
module.exports = router;
