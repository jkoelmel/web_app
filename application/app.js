var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session');
var flash = require('express-flash');

var handlebars = require('express-handlebars');
var errorPrint = require('./helpers/debug/debugprinters').errorPrint;
var requestPrint = require('./helpers/debug/debugprinters').requestPrint;
var successPrint = require('./helpers/debug/debugprinters').successPrint;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();


app.engine(
    "hbs",
    handlebars({
        layoutsDir: path.join(__dirname, "views/layouts"),
        partialsDir: path.join(__dirname, "views/partials"),
        extname: ".hbs",
        defaultLayout: "home",
        helpers: {
            emptyObject: (obj) => {
                return !(obj.constructor === Object && Object.keys(obj).length == 0)
            }
        }
    })
)
var mysqlSessionStore = new mysqlSession({/* using default options*/}, require('./conf/database'));

app.use(sessions({
    key: "csid",
    secret: "its a secret",
    store: mysqlSessionStore,
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    if (req.session.username) {
        res.locals.logged = true;
    }
    next();
});

app.use(flash());
app.set("view engine", "hbs");
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, '/public')));

app.use((req, res, next) => {
    requestPrint(req.url);
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (req, res, next) {
    res.status(404).render('error', {
        title: "Page Not Found", header: "Error 404",
        css: "error.css"
    })
});

app.use((err, req, res, next) => {
    errorPrint(err);
    res.status(500);
    res.send("Something went wrong");
    next();
});


module.exports = app;
