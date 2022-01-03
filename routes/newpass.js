const { newpassuser } = require("../controllers/register");

const router = require("express").Router();
router.post("/", newpassuser);
module.exports = router;
