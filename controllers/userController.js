const jwt = require("jsonwebtoken");
const { User, Sequelize } = require("../models");
const bcrypt = require("bcrypt");
const { SequelizeValidationError } = Sequelize;


module.exports.createJwtToken = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username: username } });
    if (!user) throw new Error("Wrong pass or username");
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
    res.status(200).cookie("token", token, { httpOnly: true});
    // ^ deleted secure
    //  .cookie('refreshToken', refresh.token, {httpOnly:true, sameSite: 'strict'})
    next();
  } catch (error) {
    errorObject = error.message
    return res.status(400).render('login', { errorObject });
  }
};

module.exports.checkJwtToken = async (req, res, next) => {
  const token = await req.cookies.token;
  if (!token) return res.status(403).render("login");
  try {
    if (token === "null" || !token) return res.status(400).render("login");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) return res.status(401).render("login");
    res.locals.decode = decode;
    return next();
  } catch (error) {
    let errorObject = "Session expired"
    return res.status(400).render("login", {errorObject});
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
  try {
    if(password.length < 8) throw new Error('Has to contain at least 8 characters')
  bcrypt.hash(password, Number(process.env.SALT), async function (err, hash) {
    await User.create({
      username: username,
      password: hash,
      email: email,
    }).then(created => {
        res.redirect("/");
        next();
      })
      .catch(err => {
        const errorObject = {}
        err.errors.map(er => {
          errorObject[er.path] = er.message
        })
        res.status(400).render('register', { errorObject })
        next();
      });
  });
} catch (error) {
  const errorObject = {'password':error.message}
  res.status(400).render('register',  { errorObject })
  next();
}
};
