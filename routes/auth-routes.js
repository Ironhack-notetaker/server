const express        = require("express");
const router         = express.Router();
const User           = require("../models/user");
const ensureLogin    = require("connect-ensure-login");
const passport       = require("passport");
const flash          = require("connect-flash");
const bcrypt         = require("bcryptjs");
const bcryptSalt     = 10;
const session        = require("express-session");


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" && password === "") {
    res.status(400).json({ message: 'Enter a username and password' })
    return;
  }
  if (username === "") {
    res.status(400).json({ message: 'Please enter a username' });
    return;
  }
  if (password === "") {
    res.status(400).json({ message: 'Please enter a password' });
    return;
  }
  
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({ message: 'This username is already taken' });
      return;
    }
    
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass,
      // email: email
    });
    
    newUser.save((err) => {
      if (err) {
        res.status(400).json({ message: 'Something went wrong' });
        return;
      }

      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({ message: 'Something went wrong' })
          return;
        }
        res.status(200).json(req.user);
      });

    });
  });
});

router.post('/login', (req,res, next) => {
  User.findOne({ username: req.body.username })
		.then((userFromDb) => {
      if (userFromDb === null) {
        res.status(400).json({ error: 'Username is invalid' });
				return;
			}
			const isPasswordGood =
				bcrypt.compareSync(req.body.password, userFromDb.password);
				if (isPasswordGood === false) {
					res.status(400).json({ error: 'Password is invalid' });
					return;
				}

				req.login(userFromDb, (err) => {
					// clear the "encryptedPassword" before sending the user info
					// ( otherwise its a security risk )
					userFromDb.encryptedPassword = undefined;
				
						res.status(200).json({
						isLoggedIn: true,	
						userInfo:	userFromDb
						});
				}); // req.login
		})

		.catch((err) => {
			console.log('POST /login ERROR!');
			console.log(err);

			res.status(500).json({ error: 'Log in database error' });
		});

}); // POST /login

// router.post("/login", (req, res, next) => {
//   passport.authenticate('local', (err, theUser, failureDetails) => {

//      if (err) {
//       res.status(500).json({ message: 'Something went wrong' });
//       return;
//     }

//     if (!theUser) {
//       res.status(401).json(failureDetails);
//       return;
//     }

//     req.login(theUser, (err) => {
//       if (err) {
//         res.status(500).json({ message: 'Something went wrong' });
//         return;
//       }
//       res.status(200).json(req.user);
//     })
//   });
// })

// router.get("/login", (req, res, next) => {
//   res.render("passport/login", { "message": req.flash("error") });
// });


// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/private-page",
//   failureRedirect: "/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

// router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//   console.log("hi")
//  res.render("private", { user: req.user });
// });

// router.get("/private-page",  (req, res) => {
//   res.render("private");
// });


// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/login");
// });





router.post('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Success' })
});

router.post('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
    return;
  }

  res.json({ message: 'Unauthorized' });
});

router.post('/private', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({ message: 'This is a private message' });
    return;
  }
  res.status(403).json({ message: 'Unauthorized' });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(200).json(req.user);
  }
}

// function checkRoles(role) {
//   return function(req, res, next) {
//     if (req.isAuthenticated() && req.user.role === role) {
//       return next();
//     } else {
//       res.redirect('/')
//     }
//   }
// }

 module.exports = router;