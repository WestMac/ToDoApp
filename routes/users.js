require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require("bcrypt");
const { createJwtToken, createUser } = require("../controllers/userController");

router.get("/login", async (req, res) => {
  return res.render("login");
});
router.post("/login", createJwtToken, async (req, res) => {
  return res.redirect("list");
});

router.get("/register", async (req, res) => {
  return res.render("register");
});

router.post("/register", createUser, async (req, res) => {});

router.get("/logout", async(req,res) => {
  res.clearCookie('token')
  res.redirect('login')
})

module.exports = router;
