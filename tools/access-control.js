const Article = require('../models/Article')
const Comment = require('../models/Comment')
const User = require('../models/User');
const createError = require('http-errors');
const generalController = require('../controllers/general.Controller')
const acc = {}

acc.sessionChecker = function(req, res, next) {
    if (req.cookies.user_sid && req.session.user)
        return res.redirect('/user/dashboard')

    return next()
};

acc.loginChecker = async function(req, res, next) {
    if (!req.session.user)
        return res.redirect('/auth/login')

    const user = await User.findById(req.session.user._id)
    if (!user)
        return res.clearCookie('user_sid').redirect('/auth/login')

    return next()
};

acc.resetPass = async function(req, res, next) {
    if (!req.session.user || req.session.user.role === 'admin')
        return next()

    res.status(403).json({ msg: "Access denied" })
};

acc.owner = (req, res, next) => {
    if (req.session.user._id == req.params.id)
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.adminOwner = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.admin = async(req, res, next) => {
    if (req.session.user.role === 'admin')
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.articles = (req, res, next) => {
    if (req.session.user.role === 'admin' || req.session.user._id == req.params.id)
        return next()
    res.status(403).json({ msg: "Access denied" })
}

acc.editArticle = generalController.catchError(async(req, res, next) => {
    const article = await Article.findById(req.params.id)
    if (!article) return next(createError(404))
    if (article.owner == req.session.user._id)
        return next()
    res.status(403).json({ msg: "Access denied" })
})

acc.deleteArticle = generalController.catchError(async(req, res, next) => {
    const article = await Article.findById(req.params.id)
    if (!article) return next(createError(404))
    if (req.session.user.role === 'admin' || article.owner == req.session.user._id)
        return next()
    res.status(403).json({ msg: "Access denied" })
})

acc.confirmComment = generalController.catchError(async(req, res, next) => {
    const comment = await Comment.findById(req.params.id).populate('article', { owner: 1 })
    if (!comment) return next(createError(404))
    if (comment.article.owner == req.session.user._id)
        return next()
    res.status(403).json({ msg: "Access denied" })
})


acc.deleteComment = generalController.catchError(async(req, res, next) => {
    const comment = await Comment.findById(req.params.id).populate('article', { owner: 1 })
    if (!comment) return next(createError(404))
    if (req.session.user.role === 'admin' || comment.article.owner == req.session.user._id)
        return next()
    res.status(403).json({ msg: "Access denied" })
})

module.exports = acc;