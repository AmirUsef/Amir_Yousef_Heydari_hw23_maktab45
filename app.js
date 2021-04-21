const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const session = require('express-session')
const mongoose = require('mongoose')
const api = require('./routes/api')
require('dotenv').config()
require('./tools/initializer')

const app = express()

mongoose.connect(process.env.DATABASE_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) return console.log("Connection failed")
        console.log("Connected to database...")
    }
);

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
    key: 'user_sid',
    secret: process.env.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: parseInt(process.env.maxage)
    }
}))

app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user)
        res.clearCookie('user_sid')

    next()
})

app.get('/', (req, res) => {
    res.render('home')
})
app.use('/', api)

app.use(function(req, res, next) {
    next(createError(404))
})

app.use(function(err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    if (err.status == 404)
        return res.render('error404')
    res.render('error500')
})

module.exports = app;