const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

const app = express();

// Body parser middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// DB Config
const dbCloud = require("./config/keys").mongoURI;
const dbLocal = "mongodb://localhost/devconnector";

// Connect to MongoDB
mongoose
  .connect(dbLocal) // Connect to local DB if running
  .then(() => console.log("Connected to local MongoDB"))
  .catch(() => {
    mongoose
      .connect(dbCloud)
      .then(() => console.log("Connected to MLab MongoDB"))
      .catch(err => console.log(err));
  });

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000; // heroku or local:5000

app.listen(port, () => console.log(`Server running on port ${port}`));
