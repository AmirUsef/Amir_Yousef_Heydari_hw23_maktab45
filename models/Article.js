const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require('./Comment')
const generalTools = require('../tools/general-tools')
const rimraf = require("rimraf");
const path = require('path')

const requiredFields = {
    type: String,
    required: true,
    trim: true,
};

const ArticleSchema = new Schema({
    title: {
        ...requiredFields,
        minlength: 3,
        maxlength: 30
    },
    text: {
        ...requiredFields,
        minlength: 20,
        maxlength: 4000
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdate: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

ArticleSchema.methods.toJSON = function() {
    let article = this
    article = article.toObject()
    delete article.__v
    return article
}

ArticleSchema.pre('save', function(next) {
    generalTools.copyFiles(this._id, this.text, this.owner)
    this.text = this.text.replaceAll(`temp/${this.owner}-temp`, `articles/${this._id}`);
    next()
});

ArticleSchema.pre('updateOne', function(next) {
    this._update.lastUpdate = Date.now()
    generalTools.deleteFiles(this._update._id, this._update.text)
    generalTools.copyFiles(this._update._id, this._update.text, this._update.owner)
    this._update.text = this._update.text.replaceAll(`temp/${this._update.owner}-temp`, `articles/${this._update._id}`);
    next()
})

ArticleSchema.post('deleteOne', { document: true, query: false }, async function() {
    try {
        rimraf.sync(path.join(__dirname, `../public/images/articles/${this._id}`))
    } catch (error) {}
    await Comment.deleteMany({ article: this._id })
});

module.exports = mongoose.model('Article', ArticleSchema);