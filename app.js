const express = require("express"),
    bodyparser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    dotenv = require("dotenv"),
    connectDB = require("./config/db"),
    morgan = require("morgan"), // any type of request is showed down in the console
    passport = require('passport'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    expressLayouts = require('express-ejs-layouts');


// Load config file
dotenv.config({ path: './config/config.env' });


// Passport config
require('./config/passport')(passport)

connectDB();

const app = express()

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Static files
app.use(express.static('public'));

//Layouts
app.use(expressLayouts);

// EJS Template
app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(methodOverride("_method"));


// Sessions         
app.use(session({
    secret: 'keyboard cat',
    resave: false, // save sessions only when there is some change in 
    saveUninitialized: false,
    // storing session so that on restarting server , session continues..
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//ROUTES

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

const port = process.env.PORT || 8080;
app.listen(port, function() {
    console.log(`Server Running in ${process.env.NODE_ENV} mode.`);
    console.log(`Go to http://localhost/${port}`);
})