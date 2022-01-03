const { verifyuser } = require("../controllers/register");

const router = require("express").Router();
router.post("/", verifyuser);
module.exports = router;
