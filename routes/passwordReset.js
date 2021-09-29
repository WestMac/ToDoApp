require("dotenv").config();
const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync')
const { resetLink, resetPassword, changePassword } = require("../controllers/resetPasswordController")



router.get("/", async(req,res) => {
    res.render('password')
})

router.post("/", wrapAsync(resetLink))

router.route("/:userId/:token")
    .get(wrapAsync(resetPassword))
    .post(wrapAsync(changePassword))



module.exports = router;    