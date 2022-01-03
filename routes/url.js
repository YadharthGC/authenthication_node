const { authenthicate, urluser } = require("../controllers/register");

const router = require("express").Router();
router.post("/", [authenthicate], urluser);
module.exports = router;
