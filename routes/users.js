require("dotenv").config();
const express = require("express");
const router = express.Router();
const { createJwtToken, createUser } = require("../controllers/userController");
const wrapAsync = require('../utils/wrapAsync')


router.get("/", async (req, res) => {

  return res.render("login");
});
router.post("/login", wrapAsync(createJwtToken), async (req, res) => {
  return res.redirect("list");
});

router.get("/register", async (req, res) => {
  return res.render("register");
});

router.post("/register", wrapAsync(createUser));

router.get("/logout", async(req,res) => {
  res.clearCookie('token')
  res.render('login')
})

module.exports = router;
