const express     = require("express");
const router      = express.Router();
const User        = require("../models/user");
const Note        = require("../models/note");
const Team        = require("../models/team")
const ensureLogin = require("connect-ensure-login");
const passport    = require("passport");
const flash       = require("connect-flash");
const bcrypt      = require("bcryptjs");
const bcryptSalt  = 10;
const session     = require("express-session");
const clone       = require('clone');


router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" && password === "") {
    res.status(400).json({
      message: 'Enter a username and password'
    })
    return;
  }
  if (username === "") {
    res.status(400).json({
      message: 'Please enter a username'
    });
    return;
  }
  if (password === "") {
    res.status(400).json({
      message: 'Please enter a password'
    });
    return;
  }

  User.findOne({
    username: username
  }, "username", (err, user) => {
    if (user !== null) {
      res.status(400).json({
        message: 'This username is already taken'
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = User({
      username: username,
      password: hashPass,
    });

    newUser.save((err) => {
      if (err) {
        res.status(400).json({
          message: 'Something went wrong'
        });
        return;
      }

      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({
            isLoggedIn: false,
            userInfo: null,
            message: 'Unauthorized'
          })
          return;
        }
        res.status(200).json(req.user);
      });

    });
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({ username: req.body.username })
    .then((user) => {
      if (user === null) {
        res.status(400).json({
          error: 'Username is invalid'
        });
        return;
      }
      const isPasswordGood =
        bcrypt.compareSync(req.body.password, user.password);
      if (isPasswordGood === false) {
        res.status(400).json({
          error: 'Password is invalid'
        });
        return;
      }

      req.login(user, (err) => {
        user.password = undefined;
        
        res.status(200).json({
          isLoggedIn: true,
          userInfo: user,
          message: 'Logged in'
        });
      }); // req.login
    })

    .catch((err) => {
      console.log('POST /login ERROR!');
      console.log(err);

      res.status(500).json({
        error: 'Log in database error'
      });
    });

}); // POST /login

router.delete('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.status(200).json({
    isLoggedIn: false,
    userInfo: null,
    message: 'Logged out'
  });
});

router.get('/loggedin', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.json({
      isLoggedIn: true,
      userInfo: req.user,
      message: 'Success'
    });
    return;
  } else {
    res.json({
      isLoggedIn: false,
      userInfo: null,
      message: 'Unauthorized'
    })
    return;
  }
})

router.get('/private/:id', (req, res, next) => {
  User.findById(req.params.id)
  .then(user => {
    res.json();
  });
});

router.post('/favorites/:id/:noteId', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id)
  .then((user) => {
    Note.findById(req.params.noteId)
    .then((note) => {
      user.favorites.unshift(note._id);
      user.save();
    })
  })
})

router.post('/removefavorite/:id/:noteId', (req, res, next) => {
  User.findByIdAndUpdate(req.params.id)
  .then((user) => {
    Note.findById(req.params.noteId)
    .then((note) => {
      const idIndex = user.favorites.indexOf(note._id)
      console.log(idIndex)
      delete user.favorites.splice(idIndex, 1);
      user.save()
    })
  })
  return;
})

router.post('/team/new', (req, res, next) => {
  const newTeam = {
    user: req.body.user,
    note: req.body.note,
    teamName: req.body.teamName,
    urgency: req.body.urgency,
    status: req.body.status,
    theme: req.body.theme
  }

  const teamName = req.body.teamName;

  Team.findOne({
    teamName: teamName
  }, "teamName", (err, team) => {
    if (team !== null) {
      res.status(400).json({
        message: "This team name is already taken"
      })
      return;
    }
  })

  Team.create(newTeam)
    .then((teamJustCreated) => {
      User.findByIdAndUpdate(req.user._id)
      .then((updatedUser) => {
        console.log(updatedUser)
        updatedUser.teams.unshift(clone(newTeam._id))
        updatedUser.teams.save()
        res.json(updatedUser)
      })
      teamJustCreated.save 
      res.json(teamJustCreated)
    })
    .catch((err) => {
      res.json(err)
    })

}); // End of '/team/new'

router.post('/team/users/:id', (req, res, next) => {
  Team.findByIdAndUpdate(req.params.id)
  .exec()
  .then((team) => {
    team.user.unshift(req.user.username)
    team.save();
    res.json(team);
    User.findByIdAndUpdate(req.user._id)
    .then((user) => {
      user.teams.unshift(team._id)
      user.save();
    })
  })
  .catch((err) => {
    res.json(err)
  })
}) 

router.get('/getfavorites', (req, res, next) => {
  Note.find({_id: req.user.favorites})
    .exec()
    .then((noteResult) => {
      res.json(noteResult)
    })
    .catch((err) => {
      res.json(err);
    })
})

router.get('/getteams', (req, res, next) => {
  Team.find({_id: req.user.teams})
  .exec()
  .then((teamResult) => {
    res.json(teamResult);
  })
  .catch((err) => {
    res.json(err);
  })
})

router.get('/userinfo', (req, res, next) => {
  User.findById(req.user._id)
  .exec()
  .then((theUser) => {
    res.json(theUser);
  })
  .catch((err) => {
    res.json(err)
  })
})

router.post('/updateuser', (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body)
  .then((updatedUser) => {
    res.json(updatedUser);
  })
  .catch((err) => {
    res.json(err);
  })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(200).json(req.user);
  }
}

// router.get('/quicky', (req, res, next) => {
//     username: req.user.username
//     res.redirect('/api/quicky/:username');
// })

// router.post('/user/updateteams/:id', (req, res, next) => {
//   const newTeam = new teamModel ({
//     user: req.body.user,
//     note: req.body.note,
//     teamName: req.body.teamName,
//     urgency: req.body.urgency,
//     status: req.body.status,
//     theme: req.body.theme
//   }) 
//   User.findById(req.params.id)
//   .then((updatedUser) => {
//     updatedUser.userInfo.teams.unshift(clone(newTeam.teamName))
//     updatedUser.userInfo.save()
//     res.json(updatedUser);
//     newTeam.save()
//   })
//   .catch((err) => {
//     res.json(err)
//   })
// })


module.exports = router;