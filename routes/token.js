require("dotenv").config();
const express = require("express");
const router = express.Router();
const { User } = require("../models");
const jwt = require('jsonwebtoken');
const { checkJwtToken, checkJwtPremium } = require("../controllers/userController");

router.get('/', checkJwtToken, async (req,res) => {
   return res.send('elo')
})

router.get('/2', checkJwtPremium, async (req,res) => {
   return res.send('elo')
})


module.exports = router;