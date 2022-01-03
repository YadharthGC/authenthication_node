const { webuser } = require("../controllers/register");

const router = require("express").Router();
router.get("/:did", webuser);
module.exports = router;
