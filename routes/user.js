const express = require('express');
const router = express.Router();
const acc = require('../tools/access-control')

const {
    dashboardPage,
    getAllUsers,
    addArticlePage,
    updateUser,
    updateAvatar,
    deleteUser
} = require("../controllers/user.controller");

router.get('/dashboard', dashboardPage)

router.get('/AllUsers', acc.admin, getAllUsers)

router.get('/addArticle', addArticlePage)

router.put('/:id', acc.owner, updateUser)

router.post('/avatar/:id', acc.owner, updateAvatar)

router.delete('/:id', acc.adminOwner, deleteUser)

module.exports = router;