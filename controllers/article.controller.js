const Article = require('../models/Article')
const createError = require('http-errors')
const Comment = require('../models/Comment')
const generalTools = require('../tools/general-tools')
const generalController = require('./general.Controller')
const multer = require('multer')

const getArticle = generalController.catchError(async(req, res, next) => {
    const article = await Article.findById(req.params.id).populate('owner', { firstName: 1, lastName: 1, avatar: 1 })
    if (!article) return next(createError(404))
    const comments = await Comment.find({ article: req.params.id, confirmed: true }).populate('owner', { username: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 })
    res.render('dashboard/article', { article, comments, user: req.session.user })
})

const getUserArticles = generalController.catchError(async(req, res, next) => {
    const page = req.query.pageno || 1
    const number = await Article.countDocuments({ owner: req.params.id })
    if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
        return next(createError(404))
    const articles = await Article.find({ owner: req.params.id }).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 }).skip((page - 1) * 6).limit(6)
    for (let index = 0; index < articles.length; index++)
        articles[index].comments = await Comment.countDocuments({ article: articles[index]._id, confirmed: false })

    res.render('dashboard/myArticles', { articles, number, role: req.session.user.role })
})

const getAllArticles = generalController.catchError(async(req, res, next) => {
    const page = req.query.pageno || 1
    const number = await Article.countDocuments({})
    const articles = await Article.find({}).populate('owner', { firstName: 1, lastName: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 }).skip((page - 1) * 6).limit(6)
    if (isNaN(page) || page < 1 || (number + 6 <= page * 6 && page != 1))
        return next(createError(404))
    res.render('dashboard/allArticles', { articles, number, role: req.session.user.role })
})

const addArticle = generalController.catchError(async(req, res, next) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("title") || !keys.includes("editordata") || !keys.includes("files") || keys.length != 3)
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    await new Article({
        title: req.body.title,
        text: req.body.editordata,
        owner: req.session.user._id
    }).save()
    res.redirect('/user/dashboard')
})

const editArticlePage = generalController.catchError(async(req, res, next) => {
    const article = await Article.findById(req.params.id)
    const comments = await Comment.find({ article: req.params.id }).populate('owner', { username: 1, avatar: 1, _id: 0 }).sort({ createdAt: -1 })
    res.render('dashboard/editArticle', { article, text: article.text, comments })
})

const editArticle = generalController.catchError(async(req, res) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("title") || !keys.includes("editordata") || !keys.includes("files") || keys.length != 3)
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    const article = await Article.findById(req.params.id)
    await article.updateOne({ title: req.body.title, text: req.body.editordata, _id: article._id, owner: article.owner }, { new: true, runValidators: true })
    res.redirect(`/article/${article._id}`);
})

const addImage = (req, res) => {
    const upload = generalTools.uploadArticleImage.single('file')
    upload(req, res, function(err) {
        if (err) {
            if (err instanceof multer.MulterError) return res.status(500).json({ msg: "server error" })

            return res.status(400).json({ msg: err.message })
        }
        res.status(200).send(`/images/temp/${req.session.user._id}-temp/${req.file.filename}`)
    })
}

const deleteArticle = generalController.catchError((req, res, next) => {
    generalController.deleteDocument(req, res, next, Article)
})

module.exports = {
    getArticle,
    getAllArticles,
    getUserArticles,
    editArticlePage,
    addArticle,
    editArticle,
    addImage,
    deleteArticle
}