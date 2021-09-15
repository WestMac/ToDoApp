const jwt = require('jsonwebtoken');
const { User,listUserPermission, toDoList } = require('../models')
const bcrypt = require("bcrypt");

module.exports.createJwtToken = async (req,res,next) => {
    const { username, email, password } =req.body;
    try {
        const user = await User.findOne({ where: { username: username } });
        if (!user) throw new Error("User does not exist");
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error("Wrong pass or username");
        let token  = user.signToken()
        res.status(200).cookie('token', token, {httpOnly:true})
        return next();
      } catch (err) {
        return res.send({
          error: `${err.message}`,
        });
      }
}

module.exports.checkJwtToken = async (req,res,next) => {
    const token = await req.cookies.token
    if(!token) return res.status(403).render('login')
    try {
        if(token === 'null' || !token) return res.status(400).render('login')
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(401).render('login')
        return next();
    }catch(err) {
        return res.status(400).render('login')
    }
}

module.exports.checkJwtPremium = async (req,res,next) => {
    const token = await req.cookies.token
    if(!token) return res.status(403).send("Access denied.")
    try {
        if(token === 'null' || !token) return res.status(400).send('Unauthorized')
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(401).send('Unauthorized request')
        if (!decode.premium || decode.premium === false) return res.status(401).send("Unauthorized request")
        return next();
    }catch(err) {
        return res.status(400).send('invalid token')
    }
}

module.exports.createUser = async (req,res,next) => {
    const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ where: { email: email } });
    console.log(user);

    if (user) throw new Error("User already exist");

    bcrypt.hash(password, Number(process.env.SALT), async function (err, hash) {
      await User.create({
        username: username,
        password: hash,
        email: email,
      });
    });
    res.send("User created");
    next();
  } catch (err) {
    console.log(err);
    res.send({ error: `${err.message}` });
    next();
  }
}

