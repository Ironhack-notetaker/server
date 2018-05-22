const express = require('express');
const router  = express.Router();
const Team    = require('../models/team');

router.get('/team', (req, res, next) => {
  Team.find()
  .then(team => {
    res.json(team);
  })
  .catch(err => {
    res.json(err);
  })
})

router.get('team/:teamID', (req, res, next) => {
  Team.findById(req.params.teamID)
  .then((theTeam)=>{
    res.json(theTeam);
  })
  .catch((err)=>{
    res.json(err)
  })
});



//add a NEW task
router.post('/teams', (req, res, next)=>{
  console.log(req.body);
    const newTeam = {
      user: req.body.user,
      note: req.body.note,
      teamName: req.body.teamName,
      urgency: req.body.urgency,
      status: req.body.status,
      theme: req.body.theme
    }
 
    Team.create(newTeam)
    .then((teamJustCreated)=>{
      res.json(teamJustCreated)
    })
    .catch((err)=>{
      res.json(err)
    })

  });


    router.post('/team/delete/:id', (req, res, next)=>{
      Team.findByIdAndRemove(req.params.id)
      .then((teamJustDeleted)=>{
        res.json(teamJustDeleted)
      })
      .catch((err)=>{
        res.json(err)
      })

    })

    router.post('/team/update/:id', (req, res, next)=>{
      console.log(req.body)
      Team.findByIdAndUpdate(req.params.id, req.body)
      .then((updatedTeam)=>{
        res.json(updatedTeam)
      })
      .catch((err)=>{
        res.json(err)
      })

    })

module.exports = router;