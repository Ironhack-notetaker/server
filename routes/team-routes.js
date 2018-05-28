const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const NoteModel = require('../models/note');
const clone = require('clone');

router.get('/team', (req, res, next) => {
  Team.find()
    .then(team => {
      res.status(200).json(team);
      console.log(req.body)
    })
    .catch(err => {
      res.json(err);
    })
})

router.get('/team/:teamID', (req, res, next) => {
  Team.findById(req.params.teamID)
    .then((theTeam) => {
      res.json(theTeam);
    })
    .catch((err) => {
      res.json(err)
    })
});

//add a NEW task
// router.post('/team/new', (req, res, next) => {

//   const newTeam = {
//     user: req.body.user,
//     note: req.body.note,
//     teamName: req.body.teamName,
//     urgency: req.body.urgency,
//     status: req.body.status,
//     theme: req.body.theme
//   }

//   const teamName = req.body.teamName;

//   Team.findOne({
//     teamName: teamName
//   }, "teamName", (err, team) => {
//     if (team !== null) {
//       res.status(400).json({
//         message: "This team name is already taken"
//       })
//       return;
//     }
//   })

//   Team.create(newTeam)
//     .then((teamJustCreated) => {
//       res.json(teamJustCreated)
//       User.findById(user.userInfo._id)
//         .then((updatedUser) => {
//           updatedUser.userInfo.teams.unshift(clone(newTeam.teamName))
//           updatedUser.userInfo.teams.save()
//           res.json(updatedUser)
//         })
//     })
//     .catch((err) => {
//       res.json(err)
//     })

// });

router.post('/team/delete/:id', (req, res, next) => {
  Team.findByIdAndRemove(req.params.id)
    .then((teamJustDeleted) => {
      res.json(teamJustDeleted)
    })
    .catch((err) => {
      res.json(err)
    })

})

router.post('/team/update/:id', (req, res, next) => {
  Team.findByIdAndUpdate(req.params.id, req.body)
    .then((updatedTeam) => {
      res.json(updatedTeam)
      req.updatedTeam.save();
    })
    .catch((err) => {
      res.json(err)
    })

})

router.post('/team/notes/:id', (req, res, next) => {
  const newNote = new NoteModel({
    user: req.body.user,
    title: req.body.title,
    text: req.body.text,
    status: req.body.status,
    urgency: req.body.urgency,
    category: req.body.category,
    date: Date.now(),
    theme: req.body.theme,
    format: req.body.format,
  })
  Team.findById(req.params.id)
    .then((team) => {
      console.log(team);
      team.note.unshift(clone(newNote))
      team.save()
      res.json(team)
      newNote.save()
    })
    .catch(err => {
      console.log(err);
      res.json(err);
    })
})

module.exports = router;