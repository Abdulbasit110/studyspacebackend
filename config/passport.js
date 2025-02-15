const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../api/models/user.model");
// const bcrypt = require("bcrypt");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // e.g., "http://localhost:8080/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find the user based on their Google email address
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });
        if (!user) {
          // If the user does not exist, create a new user record
          user = new User({
            name: profile.displayName,
            email: email,
            username: email.split("@")[0],
            // For Google-authenticated users, you may leave passwordHash empty or set a dummy value.
            passwordHash: "oauth",
            role: "user",
          });
          await user.save();
        }
        // Pass the user object to the next middleware
        return done(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return done(error, null);
      }
    }
  )
);

// Optional: Serialize and deserialize user if you use sessions (not required for JWT-based auth)
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (error) {
//     done(error, null);
//   }
// });
