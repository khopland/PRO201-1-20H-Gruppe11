const LocalStrategy = require("passport-local").Strategy;
//Bcrypt - Hashing
const bcrypt = require("bcrypt");

const monk = require("monk");
const db = monk(process.env.MONGO_URI);
const users = db.get("users");

module.exports = function initialize(passport) {
  //Local login-strategy using bcrypt to decrypt passwords
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await users.findOne({ username: username });
      console.log("user : " + user);
      if (!user) {
        console.log("No user with that username");
        return done(null, false, { message: "Incorrect username/password." });
      }
      try {
        let passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          console.log("User " + user.username + " successfully logged in ");
          return done(null, user);
        } else {
          console.log("Unsuccessful authorization for user: " + user.username);
          return done(null, false, { message: "Incorrect username/password" });
        }
      } catch (e) {
        return done(e);
      }
    })
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((id, done) => done(null, id));
};