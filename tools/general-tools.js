const multer = require('multer')
const path = require('path')
const fs = require('fs')
const rimraf = require("rimraf");
const bcrypt = require('bcrypt');
const generalTools = {};

const avatarStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/avatars'))
    },
    filename: function(req, file, cb) {
        cb(null, req.session.user.username + '-' + Date.now() + '-' + file.originalname)
    }
})

generalTools.uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
            cb(null, true)
        else
            cb(new Error('invalid type!'), false);
    }
})

const articleStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = path.join(__dirname, `../public/images/temp/${req.session.user._id}-temp`)
        try {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                setTimeout(function() {
                    if (fs.existsSync(dir))
                        rimraf.sync(dir)
                }, process.env.maxAge);
            }
        } catch (error) {}
        cb(null, dir)
    },
    filename: function(req, file, cb) {
        cb(null, req.session.user.username + '-' + Date.now() + '-' + file.originalname)
    }
})

generalTools.uploadArticleImage = multer({
    storage: articleStorage,
    fileFilter: function(req, file, cb) {
        console.log("file:" + file);
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
            cb(null, true)
        else
            cb(new Error('invalid type!'), false);
    }
})

generalTools.copyFiles = function(dirName, text, id) {
    if (!fs.existsSync(path.join(__dirname, '../public/images/articles/' + dirName)))
        fs.mkdirSync(path.join(__dirname, '../public/images/articles/' + dirName))

    if (fs.existsSync(path.join(__dirname, `../public/images/temp/${id}-temp`))) {
        files = fs.readdirSync(path.join(__dirname, `../public/images/temp/${id}-temp`))
        files.forEach(file => {
            if (text.includes(file)) {
                fs.copyFileSync(path.join(__dirname, `../public/images/temp/${id}-temp/${file}`), path.join(__dirname, `../public/images/articles/${dirName}/${file}`), fs.constants.COPYFILE_EXCL)
            }
        });
        rimraf.sync(path.join(__dirname, `../public/images/temp/${id}-temp`))
    }
}

generalTools.deleteFiles = function(dirName, text) {
    try {
        files = fs.readdirSync(path.join(__dirname, `../public/images/articles/${dirName}`))
        files.forEach(file => {
            if (!text.includes(file))
                fs.unlinkSync(path.join(__dirname, `../public/images/articles/${dirName}/${file}`))
        });
    } catch (error) {}
}

generalTools.hash = (user, next) => {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err)
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err)
            user.password = hash
            next()
        });
    });
}

generalTools.generatePassword = () => {
    const result = []
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    for (let i = 0; i < 4; i++)
        result.push(characters.charAt(Math.floor(Math.random() * characters.length)));
    for (let i = 0; i < 4; i++)
        result.push(Math.floor(Math.random() * 10));
    return result.join('');
}

module.exports = generalTools;