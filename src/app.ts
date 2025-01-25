import express from "express";
import dotnev from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import session from "express-session";
import connectDB from "./database/connect";
import { getGoogleUser } from "./utils/googleAuth";
import { getFacebookUser } from "./utils/facebookAuth";
import passport from "passport";
import "./utils/passport";

dotnev.config();
const app = express();
const PORT: number | string = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(path.resolve(), "public")));
app.use(cookieParser());
// ---------
app.use(
  session({
    secret:
      process.env.ACCESS_TOKEN ||
      "7ea890302bf4c8dda9de988ac1d989f9de8b381d72d0d94c92837c17280c25fe0e1854016b98",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

//Google auth route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req: express.Request, res: express.Response) => {
    res.redirect("/profile");
  }
);
// Facebook Auth Route
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/profile");
  }
);

// Home Route
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user}`);
  } else {
    res.send("Please log in using Google or Facebook");
  }
});
app.get("/logout", (req, res) => {
  req.logOut(() => {
    res.redirect("/");
  });
});
app.get("/", (req, res) => {
  res.send("<a href='auth/google'>Login with Google</a>");
});
// --------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`The app is running at : http://localhost:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Error while connecting to the database");
  });
