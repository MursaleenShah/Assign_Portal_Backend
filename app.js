require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const user = require("./models/usermodel.js");
//const userSchema = require("./models/usermodel.js");
const submission = require("./models/submissionmodel.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const session = require("express-session");
const app = express();
const port = 3000;
const path = require('path');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 24 * 60 * 60 * 1000 } ,
      //cookie: { secure: false }, 
    })
  );

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://shahmursalin9:${process.env.MONGODB_KEY}@cluster0.24mhl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
  console.log("mongodb connected!");
}
const User = new mongoose.model("user", user);
const Submission = new mongoose.model("submission",submission)


app.get("/",(req, res)=>{
  res.render("home");
});
app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/student",(req,res)=>{
  res.render("student");
})
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ email: username });

    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function (err, result) {
        if (result === true) {
          req.session.user = foundUser;
          console.log("Session set after login:", req.session.user);
          if(foundUser.role === "student"){
            res.render("secrets");
          }else if(foundUser.role === "admin"){
            res.redirect("/dash");
          }
        } else {
          res.status(400).send("Invalid password.");
        }
      });
    } else {
      res.status(404).send("User not found.");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("An error occurred while logging in.");
  }
});

app.get("/register", (req, res) => {
    res.render("register");
});
app.post("/register", async (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
    try {
      const newUser = new User({
        email: req.body.username,
        password: hash,
        role:req.body.role,
      });

      await newUser.save();
      req.session.user = newUser;
      if(newUser.role === "student"){
        res.render("secrets");
      }else if(newUser.role === "admin"){
        res.redirect("/dash");
      }

    } catch (err) {
      console.log(err);
      res.status(500).send("An error occurred while registering the user.");
    }
  });
});
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(500).send("An error occurred during logout.");
    } else {
      res.redirect("/"); 
    }
  });
});



function isAuthenticated(req, res, next) {
  console.log("Checking authentication...");
 
  if (req.session.user) {
    console.log("User authenticated:", req.session.user);
    return next(); 
  } else {
    res.redirect("/login"); 
  }
}

app.get("/submit", isAuthenticated, async(req, res) => {
  if (req.session.user && req.session.user.role === "student") {
    const admins = await User.find({ role: "admin" }); 
    res.render("submit", { admins });
  } else {
    res.redirect("/login");
  }
});


app.post("/submit", isAuthenticated, async (req, res) => {
  if (req.session.user && req.session.user.role === "student") {
    const submissionData = JSON.parse(req.body.data); 
    const adminId = req.body.adminId; 

    try {
      const newSubmission = new Submission({
        studentId: req.session.user._id,
        adminId: adminId,
        data: submissionData,
      });
      await newSubmission.save();

      res.send("Submission successful!");
      //res.render("secrets");
      //console.log("Submission successful");


    } catch (err) {
      console.log(err);
      res.status(500).send("Error submitting data.");
    }
  } else {
    res.redirect("/login");
  }
});

app.get("/dash", isAuthenticated, async (req, res) => {
  console.log("Session user:", req.session.user);
  if (req.session.user && req.session.user.role === "admin") {
    try {
      const submissions = await Submission.find({ adminId: req.session.user._id }).populate('studentId');  // Get submissions for the logged-in admin
      console.log("Submissions fetched:", submissions);
      res.render("dash", {submissions}  );

    } catch (err) {
      console.log(err);
      res.status(500).send("Error fetching submissions.");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/admin/accept", isAuthenticated, async (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    try {
      const submissionId = req.body.submissionId;
      await Submission.findByIdAndUpdate(submissionId, { status: "accepted" });
      res.redirect("/dash");  
    } catch (err) {
      console.log(err);
      res.status(500).send("Error accepting the submission.");
    }
  } else {
    res.redirect("/login");
  }
});

app.post("/admin/reject", isAuthenticated, async (req, res) => {
  if (req.session.user && req.session.user.role === "admin") {
    try {
      const submissionId = req.body.submissionId;
      await Submission.findByIdAndUpdate(submissionId, { status: "rejected" });
      res.redirect("/dash");  
    } catch (err) {
      console.log(err);
      res.status(500).send("Error rejecting the submission.");
    }
  } else {
    res.redirect("/login");
  }
});


app.listen(port, () => {
  console.log(`server is running on port : ${port}`);
});
