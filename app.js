require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const app = express();
const userRoutes = require("./routes/users");
const listRoutes = require("./routes/list");
const passwordRoutes = require("./routes/passwordReset")
const { sequelize } = require("./models");
const methodOverride = require("method-override");
const cors = require("cors")


app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
  next();
});
app.use(cookieParser());

app.use("/", userRoutes);
app.use("/reset", passwordRoutes)
app.use("/list", listRoutes);


// app.use((err, req, res, next) => {
// 	const { status = 500 } = err;
// 	if (!err.message) err.message = 'Something went wrong ! Oppss'
// 	res.status(status).render('error', { err })
// })

sequelize.sync();

module.exports = app;
