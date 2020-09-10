var express = require('express');
var router = express.Router();
var db = require('../conf/database');
const {body, validationResult} = require('express-validator');
let getRecentPosts = require('../middleware/postmiddleware').getRecentPosts;
let getComments = require('../middleware/commentmiddleware').getComments;
let getSearchResults = require('../middleware/searchmiddleware').getSearchResults;

router.get('/', getRecentPosts, function (req, res, next) {
    res.render('index', {
        title: "Home", header: "PhotoCloud.ai", userHeader: "Welcome Back",
        css: "index.css"
    })
});

router.get('/login', (req, res, next) => {
    res.render('login', {title: "Login", header: "Account Login", css: "login.css"})
})

router.get('/registration', (req, res, next) => {
    res.render('registration', {
        title: "Register", header: "New Account",
        css: "registration.css"
    })
})

router.get('/postimage', (req, res, next) => {
    res.render('postimage', {
        title: "Upload Images", userHeader: "Upload New Image",
        css: "postimage.css"
    })
})

router.get('/post/:id(\\d+)', getComments, function (req,res, next) {
    let baseSQL = 'SELECT u.username, p.title, p.description, p.photopath, p.created FROM users u JOIN posts p ON u.id=fk_userid WHERE p.id=?;'

    let postId = req.params.id;
    db.execute(baseSQL, [postId])
        .then(([results, fields]) => {
            if (results && results.length) {
                let post = results[0];
                res.render('imagepost', {currentPost: post, title: "Viewer", header: "View Post",
                    userHeader: "View Post", css: "imagepost.css"});
            } else {
                req.flash('error', 'This is not the post you wanted.');
                res.redirect('/');
            }
        })
})

router.get('/about', (req, res, next) => {
    res.render('about', {
        title: "About Us", header: "PhotoCloud Mission Statement",
        userHeader: "PhotoCloud Mission Statement", css: "index.css"
    })
})

router.post('/search', getSearchResults, (req, res, next) => {

    let term = req.body.query;

    res.render('search', {
        title: "Search Results", header: "Results for " + res.locals.term, userHeader: "Results for " + res.locals.term,
        css: "search.css"
    })
})

router.get('/forgotpwd', (req, res, next) => {
    res.render('forgotpwd', {
        title: "Forgot Password", header: "Reset Password",
        css: "index.css"
    })
})

router.get('/success', (req, res, next) => {
    res.render('success', {
        title: "Account Activity", userHeader: "Action Status", header: "Action Status",
        css: "index.css"
    })
})

module.exports = router;
