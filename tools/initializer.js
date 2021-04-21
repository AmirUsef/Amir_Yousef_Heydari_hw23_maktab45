const path = require('path')
const fs = require('fs')

try {
    if (!fs.existsSync(path.join(__dirname, '../public/images/temp')))
        fs.mkdirSync(path.join(__dirname, '../public/images/temp'));
    if (!fs.existsSync(path.join(__dirname, '../public/images/articles')))
        fs.mkdirSync(path.join(__dirname, '../public/images/articles'));
} catch (error) {
    return console.log(error);
}