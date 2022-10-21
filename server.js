const fs = require("fs"); // Used to read the SSL cert and key for the HTTPS server
const http = require("http"); // Responds to normal HTTP requests
const https = require("https"); // Responds to HTTPS requests
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const { response } = require("express");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

// Create the HTTPS server using the cert and key
https.createServer({
    key: fs.readFileSync(__dirname + '/config/ssl/domain.key', 'utf8'),
    cert: fs.readFileSync(__dirname + '/config/ssl/domain.crt', 'utf8')
  }, app).listen(process.env.SSL_PORT || 443, () => {
    console.log(`Node HTTPS Server running on port ${process.env.SSL_PORT || 443}`)
})

// Create a regular HTTP server
http.createServer(app).listen(process.env.PORT || 80, () => {
  console.log(`Node HTTP Server running on port ${process.env.PORT || 80}`)
})

// Redirect all HTTP requests to HTTPS when in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV != 'development' && !req.secure) {
    console.log(`Redirecting insecure connection`)
    const hostname = req.headers.host.includes(':') ? req.headers.host.slice(0,req.headers.host.indexOf(':')) : req.headers.host
    return res.redirect(`https://${hostname}:${process.env.SSL_PORT || 443}${req.url}`)
  }
  next()
})


//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);
