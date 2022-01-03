const { loginuser } = require("../controllers/register");
const router = require("express").Router();
router.post("/", loginuser);
module.exports = router;
