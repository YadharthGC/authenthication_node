const { geturl, authenthicate } = require("../controllers/register");

const router = require("express").Router();
router.get("/", [authenthicate], geturl);
module.exports = router;
