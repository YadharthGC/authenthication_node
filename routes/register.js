const { registeruser } = require("../controllers/register");
const router = require("express").Router();
router.post("/", registeruser);
module.exports = router;
