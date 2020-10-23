require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');


require('./configs/db.config');


const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
// hbs.registerPartials(path.join(__dirname, "/views/partials"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


//set up the session(cookies)
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


app.use(session({
  secret: 'foo', 
  saveUninitialized: false, 
  resave: false, 
  cookie : {
    maxAge: 24*60*60*1000 
  }, 
  store: new MongoStore({
    mongooseConnection: mongoose.connection, 
    ttl: 24*60*60
  })
  
}));

// default value for title local
app.locals.title = 'Meet Pup';

// to keep the user logged out!!
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

const apiRoutes = require("./routes/api.routes");
app.use("/", apiRoutes);

const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
app.use('/', authRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/", profileRoutes);

const eventsRoutes = require("./routes/events.routes");
app.use("/", eventsRoutes);

const petProfileRoutes = require("./routes/petprofile.routes");
app.use("/", petProfileRoutes);

const messageRoutes = require("./routes/message.routes");
app.use("/", messageRoutes);



module.exports = app;
