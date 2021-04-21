const User = require('../models/User')
const createError = require('http-errors')
const generalController = {};

generalController.handleError = (res, error, next) => {
    if (error.code == '11000')
        return res.status(409).json({ msg: "User already exist" })

    if (error.stack.includes("CastError"))
        return next(createError(404))

    if (error.name == "ValidationError")
        return res.status(400).json({ msg: error.message })

    return res.status(500).json({ msg: "server error" })
}

generalController.catchError = func => {
    return (req, res, next) => {
        func(req, res, next).catch(error => generalController.handleError(res, error, next))
    }
}

generalController.deleteDocument = async(req, res, next, schema) => {
    const obj = await schema.findById(req.params.id)
    if (!obj) return next(createError(404))
    await obj.deleteOne()
    if (schema === User && req.session.user.role === 'blogger')
        res.clearCookie('user_sid')
    res.status(202).send();
}

module.exports = generalController;