
const jwt = require("jsonwebtoken");
const { User, refreshToken, Sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { SequelizeValidationError } = Sequelize;


module.exports.createJwtToken = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) throw new Error("User does not exist");
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Wrong pass or username");
    let token = user.signToken();
    // let refresh = await refreshToken.create({
    //   UserId: user.id,
    //   UserIp: req.headers['x-real-ip'],
    //   UserBrowser: req.headers['user-agent'],
    //   revoked: false,
    //   token: crypto.randomBytes(40).toString('hex'),
    //   expires: Date.now() +  (1440 * 60 * 1000)
    // })
    res.status(200).cookie("token", token, { httpOnly: true, secure: true });
    //  .cookie('refreshToken', refresh.token, {httpOnly:true, sameSite: 'strict'})
    next();
  } catch (err) {
    console.log(req.body)
    console.log( process.env.JWT_SECRET )
    console.log(err)
    return res.status(400).render('login');
  }
};

module.exports.createRefreshToken = async (req, res, next) => {};

module.exports.checkJwtToken = async (req, res, next) => {
  const token = await req.cookies.token;
  if (!token) return res.status(403).render("login");
  try {
    if (token === "null" || !token) return res.status(400).render("login");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) return res.status(401).render("login");
    return next();
  } catch (err) {
    return res.status(400).render("login");
  }
};

module.exports.checkJwtPremium = async (req, res, next) => {
  const token = await req.cookies.token;
  if (!token) return res.status(403).send("Access denied.");
  try {
    if (token === "null" || !token) return res.status(400).send("Unauthorized");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) return res.status(401).send("Unauthorized request");
    if (!decode.premium || decode.premium === false)
      return res.status(401).send("Unauthorized request");
    return next();
  } catch (err) {
    return res.status(400).send("invalid token");
  }
};

module.exports.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
console.log(username)
  bcrypt.hash(password, Number(process.env.SALT), async function (err, hash) {
    await User.create({
      username: username,
      password: hash,
      email: email,
    }).then(created => {
        res.redirect("/");
        next();
      })
      .catch(SequelizeValidationError, error => {
        res.status(400).render('register')
        next();
      })
      .catch(err => {
        res.status(400).render('register')
        next();
      });
  });
};
