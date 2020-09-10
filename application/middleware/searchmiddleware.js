const db = require('../conf/database');
const searchMiddleware = {};

searchMiddleware.getSearchResults = function (req, res, next) {
    //remove /post/ from path to get post ID
    let term = req.body.query;

    let baseSQL = 'SELECT id, thumbnail FROM posts WHERE LOCATE(?, title) > 0 OR LOCATE(?, description) > 0;'
    db.execute(baseSQL, [term, term]).then(([results, fields]) => {
        res.locals.term = term;
        res.locals.search = results;
        if (results && results.length == 0) {
            req.flash('error', 'Search returned no results');
        }
        next();
    })
    .catch((err) => {
        next(err);
    })
    // let baseSQL = 'SELECT username, comment, created FROM comments WHERE fk_postid=? ORDER by created DESC LIMIT 10;';
    // db.execute(baseSQL, [postID]).then(([results, fields]) => {
    //     res.locals.comments = results;
    //     if (results && results.length == 0) {
    //         req.flash('error', 'No comments yet');
    //     }
    //     next();
    // })
    //     .catch((err) => {
    //         next(err);
    //     });
}

module.exports = searchMiddleware;