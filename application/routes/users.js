const express = require('express');
const router = express.Router();
const db = require('../conf/database');
const {body, validationResult} = require('express-validator');

const userError = require('../helpers/error/userError');
const {successPrint, errorPrint} = require('../helpers/debug/debugprinters');
const bcrypt = require('bcrypt');

const multer = require('multer');
const sharp = require('sharp');
const crypto = require('crypto');
let PostError = require('../helpers/error/PostError');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/uploads');
    },
    filename: (req, file, cb) => {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb(null, `${randomName}.${fileExt}`)
    }
});

//check for image type before storing
const filter = function (req, file, cb) {
    if (file.mimetype.toLowerCase().match('image') != null) {
        cb(null, true);
    } else {
         return cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: filter
});

router.post('/login', [
    body('username').not().isEmpty(),
    body('password').isLength({min: 8})
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Validation failed');
        return res.redirect('/login');
    }
    //no errors, check for valid login on server
    let username = req.body.username.toLowerCase();
    let password = req.body.password;

    let baseSQL = "SELECT id, username, password FROM users WHERE username=?;";
    let userId;
    db.execute(baseSQL, [username])
        .then(([results, fields]) => {
            if (results && results.length == 1) {
                let hashedPassword = results[0].password;
                userId = results[0].id;
                return bcrypt.compare(password, hashedPassword);
            } else {
                throw new userError("Invalid username or password",
                    "/login",
                    200);
            }
        })
        .then((passwordsMatched) => {
            if (passwordsMatched) {
                successPrint(`User ${username} is logged in`);
                req.session.username = username;
                req.session.userId = userId;
                res.locals.logged = true;
                res.redirect('/success');
            } else {
                throw new userError("Invalid username or password",
                    "/login",
                    200);
            }
        })
        .catch((err) => {
            errorPrint("user login failed");
            if (err instanceof userError) {
                errorPrint(err.getMessage());
                req.flash('error', "Invalid username and/or password");
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        })
});

router.post('/register', [
    body('username').not().isEmpty(),
    body('email').isEmail(),
    body('password1').isLength({min: 8}),
    body('password2').isLength({min: 8})
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', 'Registration failed');
        return res.redirect('/registration');
    }
    //validation has passed check, create user

    console.log(req.body);

    let username = req.body.username.toLowerCase();
    let email = req.body.email;
    let password = req.body.password1;

    db.execute("SELECT * FROM users WHERE username=?", [username])
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return db.execute("SELECT * FROM users WHERE email=?", [email]);
            } else {
                throw new userError(
                    "Registration failed: username exists",
                    "/registration",
                    200
                );
            }
        })
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                return bcrypt.hash(password, 15);
            } else {
                throw new userError(
                    "Registration failed: email exists",
                    "/registration",
                    200
                );
            }
        })
        .then((hashedPassword) => {
            let baseSQL = 'INSERT INTO users (`username`, `email`, `password`, `created`) VALUES (?, ?, ?, now())';
            return db.execute(baseSQL, [username, email, hashedPassword]);

        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                successPrint("user was created");
                res.redirect('/login');
            } else {
                throw new userError(
                    "Server error: user not created",
                    "/registration",
                    500
                );
            }
        })
        .catch((err) => {
            errorPrint("user could not be made", err);
            if (err instanceof userError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect(err.getRedirectURL());
            } else {
                next(err);
            }
        })

});

router.post('/createPost', upload.single('photo'), (req, res, next) => {
    //encapsulated in try-catch for when multer destroys wrong filetypes and 'path' is undefined
    try {
        let fileUpload = req.file.path;
        let fileThumbnail = `thumbnail-${req.file.filename}`;
        let destinationThumbnail = req.file.destination + '/' + fileThumbnail;
        let title = req.body.title;
        let desc = req.body.description;
        let fk_userId = req.session.userId;

    sharp(fileUpload).resize(300, 300).toFile(destinationThumbnail)
        .then(() => {
            let baseSQL = 'INSERT INTO posts (title, description, photopath, thumbnail, created, fk_userid) VALUES(?,?,?,?,now(), ?)'
            return db.execute(baseSQL, [title, desc, fileUpload, destinationThumbnail, fk_userId]);
        })
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                res.redirect('/success');
            } else {
                throw new PostError('Post could not be created', '/postimage', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect('/postimage');
            } else {
                next(err);
            }
        })
    }
    catch (err) {
        req.flash('error', 'Wrong filetype chosen');
        res.redirect('/postimage');
    }
});

router.post('/comment', [
    body('comment').not().isEmpty()
],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.redirect('back');
    }
    //commment not empty
    let username = req.session.username;
    let comment = req.body.comment;
    let fk_postid = req.headers.referer.split('/')[4];

    let baseSQL = 'INSERT INTO comments (fk_postid, username, comment, created) VALUES (?,?,?, now())';
    db.execute(baseSQL, [fk_postid, username, comment])
        .then(([results, fields]) => {
            if (results && results.affectedRows) {
                res.redirect('/success');
            } else {
                throw new PostError('Comment could not be posted', '/', 200);
            }
        })
        .catch((err) => {
            if (err instanceof PostError) {
                errorPrint(err.getMessage());
                req.flash('error', err.getMessage());
                res.status(err.getStatus());
                res.redirect('/');
            } else {
                next(err);
            }
        })
});

router.post('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            errorPrint("Session could not be destroyed");
            next(err);
        } else {
            successPrint("Session was destroyed");
            res.clearCookie('csid');
            res.redirect('/');
        }
    })
});

module.exports = router;
