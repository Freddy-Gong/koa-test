const key = require('./keys')
const mongoose = require('mongoose')
const User = mongoose.model('user')
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = key.keyOrSecret;
opts.issuer = 'accounts.examplesoft.com';
opts.audience = 'yoursite.net';


module.exports = passport => {
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        console.log(jwt_payload)
        // User.findOne({id: jwt_payload.sub}, async (err, user) => {
        //     if (err) {
        //         return done(err, false);
        //     }
        //     if (user) {
        //         return done(null, user);
        //     } else {
        //         return done(null, false);
        //         // or you could create a new account
        //     }
        // });
    }));
}