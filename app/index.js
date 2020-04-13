const express = require('express');
const jsonErrorHandler = require('express-json-error-handler').default;
const passport = require('passport');
const routes = require('./routes').routingMiddleware();
const sequelize = require('./models');
const morgan = require('morgan')
const cors = require('cors')
const db = require('./data-access');
global.sequelize = sequelize;

// App setup
const app = express();

app.use(cors())
app.options('*', cors()) 
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(morgan('combined'));
app.use(routes);
app.use(passport.initialize());
app.use(jsonErrorHandler());

// Passport
const ExtractJwt = require('passport-jwt').ExtractJwt
const JwtStrategy = require('passport-jwt').Strategy

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}, async (jwt_payload, done) => {
  try {
    const user = await db.users.findById(jwt_payload.id);
    if (user) return done(null, true)
    else return done(null, false)
  } catch (error) {
    return done(error, false) 
  }
}));

module.exports = app;
