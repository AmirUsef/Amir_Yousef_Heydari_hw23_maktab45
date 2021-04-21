const Comment = require('../models/Comment')
const generalController = require('./general.Controller')

const addComment = generalController.catchError(async(req, res, next) => {
    const keys = Object.keys(req.body);
    if (!keys.includes("text") || !keys.includes("article") || keys.length != 2)
        return res.status(400).json({ msg: "Article validation failed: incorrect fields" })

    await new Comment({
        text: req.body.text,
        article: req.body.article,
        owner: req.session.user._id
    }).save()
    res.status(200).send()
})

const confirmComment = generalController.catchError(async(req, res, next) => {
    await Comment.findByIdAndUpdate(req.params.id, { confirmed: true })
    res.status(200).send()
})

const deleteComment = generalController.catchError((req, res, next) => {
    generalController.deleteDocument(req, res, next, Comment)
})

module.exports = {
    addComment,
    confirmComment,
    deleteComment
}