import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User, userDocument } from "../models/user.model"; // Ensure User and userDocument are properly defined in your model
import dotenv from "dotenv";
dotenv.config();
// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        const email = emails && emails[0]?.value; // Use optional chaining in case emails is undefined

        let user = await User.findOne({ provider: "google", providerId: id });

        if (!user) {
          user = new User({
            fullName: displayName,
            email: email,
            provider: "google",
            providerId: id,
          });
          await user.save();
        }

        done(null, user); // Pass the user object
      } catch (error) {
        done(error, undefined); // Pass error and undefined
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_SECRET || "",
      callbackURL: "http://localhost:8000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails } = profile;
        console.log(profile);
        const email = emails && emails[0]?.value; // Use optional chaining in case emails is undefined

        let user = await User.findOne({ provider: "facebook", providerId: id });
        console.log(id, displayName, emails);
        if (!user) {
          user = new User({
            fullName: displayName,
            email: email,
            provider: "facebook",
            providerId: id,
          });
          await user.save();
        }

        done(null, user); // Pass the user object
      } catch (error) {
        done(error, undefined); // Pass error and undefined
      }
    }
  )
);

// Serialize User
passport.serializeUser((user, done) => {
  // Serialize user by ID; assume userDocument has an _id property
  done(null, (user as userDocument)._id.toString());
});

// Deserialize User
passport.deserializeUser(async (id: string, done) => {
  try {
    const user: userDocument | null = await User.findById(id); // Find user by ID
    if (user) {
      done(null, user); // Pass user object if found
    } else {
      done(null, undefined); // Pass undefined if user not found
    }
  } catch (error) {
    done(error, undefined); // Pass error and undefined if an exception occurs
  }
});

export default passport;
