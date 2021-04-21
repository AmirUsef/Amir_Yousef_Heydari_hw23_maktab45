const express = require('express')
const router = express.Router()
const acc = require('../tools/access-control')

const {
    getAllArticles,
    getUserArticles,
    editArticlePage,
    getArticle,
    addArticle,
    editArticle,
    addImage,
    deleteArticle
} = require("../controllers/article.controller.js")

router.get("/", getAllArticles)

router.get("/articles/:id", acc.articles, getUserArticles)

router.get("/edit/:id", acc.editArticle, editArticlePage)

router.get("/:id", getArticle)

router.post("/", addArticle)

router.post("/image", addImage)

router.post("/:id", acc.editArticle, editArticle)

router.delete("/:id", acc.deleteArticle, deleteArticle)

module.exports = router;