require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const app = express();
const userRoutes = require('./routes/users')
const listRoutes = require('./routes/list')
const { sequelize } = require('./models')
const methodOverride = require('method-override');


app.use(methodOverride('_method'))
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname,'public')));
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(cookieParser())


app.use('/', userRoutes)
app.use('/list', listRoutes)
sequelize.sync();

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Listening on port ${process.env.SERVER_PORT}`)
})

