const User = require('../models/User');
const session = require('express-session');
const generalTools = require('../tools/general-tools')
const multer = require('multer')
const fs = require('fs')
const createError = require('http-errors');
const generalController = require('./general.Controller')

const fieldsPattern = [
    "phoneNumber",
    "gender",
    "firstName",
    "lastName"
];

const dashboardPage = async(req, res) => {
    return res.render('dashboard/profile', { user: req.session.user })
}

const getAllUsers = generalController.catchError(async(req, res, next) => {
    const users = await User.find({ role: 'blogger' })
    res.render('admin/users', { users })
})

const addArticlePage = (req, res) => {
    res.render('dashboard/addArticle')
}

const updateUser = generalController.catchError(async(req, res, next) => {
    const keys = Object.keys(req.body);
    if (!(keys.length === 2 && keys.includes("password") && keys.includes("newpassword")) && !(keys.length === 1 && fieldsPattern.includes(field)))
        return res.status(400).json({ msg: "User validation failed: incorrect fields" })
    let user = await User.findOne({ _id: req.params.id })
    if (!user)
        return next(createError(404))
    if (keys.includes("password")) {
        const isEqualPass = await user.comparePassword(req.body.password)
        if (!isEqualPass) return res.status(404).json({ msg: "User not found" })
        await user.updateOne({ password: req.body.newpassword }, { new: true, runValidators: true, useFindAndModify: false })
        res.clearCookie('user_sid')
        return res.status(200).send()
    }
    req.body.lastUpdate = Date.now()
    user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, useFindAndModify: false })
    req.session.user = user
    res.status(200).send()
})

const updateAvatar = generalController.catchError(async(req, res, next) => {
    const upload = generalTools.uploadAvatar.single('avatar');
    upload(req, res, async function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).json({ msg: "server error" })

            return res.status(400).json({ msg: err.message })
        }
        if (req.session.user.role != 'admin' && req.session.user.avatar != 'profile.png') {
            fs.unlink(`./public/images/avatars/${req.session.user.avatar}`, (err) => {
                if (err) console.log(err);
            })
        }
        user = await User.findByIdAndUpdate({ _id: req.params.id }, { avatar: req.file.filename }, { new: true, runValidators: true, useFindAndModify: false })
        if (req.session.user.role === 'blogger')
            req.session.user = user
        res.redirect('/user/dashboard')
    })
})

const deleteUser = generalController.catchError((req, res, next) => {
    generalController.deleteDocument(req, res, next, User)
})

module.exports = {
    dashboardPage,
    getAllUsers,
    addArticlePage,
    updateUser,
    updateAvatar,
    deleteUser
};