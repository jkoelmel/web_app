const db = require('../conf/database');
const commentMiddleware = {};

commentMiddleware.getComments = function (req, res, next) {
    //remove /post/ from path to get post ID
    let postID = req.path.substr(6);
    let baseSQL = 'SELECT username, comment, created FROM comments WHERE fk_postid=? ORDER by created DESC LIMIT 10;';
    db.execute(baseSQL, [postID]).then(([results, fields]) => {
        res.locals.comments = results;
        if (results && results.length == 0) {
            req.flash('error', 'No comments yet');
        }
        next();
    })
    .catch((err) => {
        next(err);
    });
}

module.exports = commentMiddleware;
