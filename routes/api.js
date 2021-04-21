const express = require("express")
const router = express.Router()
const userRouter = require('./user')
const authRouter = require('./auth')
const articleRouter = require('./article')
const commentRouter = require('./comment')
const acc = require('../tools/access-control')

router.use('/user', acc.loginChecker, userRouter)
router.use('/auth', authRouter)
router.use('/article', acc.loginChecker, articleRouter)
router.use('/comment', acc.loginChecker, commentRouter)

module.exports = router;