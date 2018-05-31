const express = require('express');
const router  = express.Router();
const Note    = require('../models/note');
const User    = require("../models/user");


router.get('/notes', (req, res, next) => {
  Note.find()
  .then(notes => {
    res.json(notes);
  })
  .catch(err => {
    res.json(err);
  })
})

router.get('/notes/:id', (req, res, next) => {
  Note.findById(req.params.id)
  .then((theNote)=>{
    res.json(theNote);
  })
  .catch((err)=>{
    res.json(err)
  })
});

router.post('/notes/create', (req, res, next)=>{
    const newNote = {
      user: req.user.username,
      title: req.body.title,
      text: req.body.text,
      category: req.body.category,
      urgency: req.body.urgency,
      status: req.body.status,
      date: Date.now()
    }
    Note.create(newNote)
    .then((noteJustCreated)=>{
      res.json(noteJustCreated)
    })
    .catch((err)=>{
      res.json(err)
    })
  });


    router.post('/note/delete/:id', (req, res, next)=>{
      Note.findByIdAndRemove(req.params.id)
      .then((noteJustDeleted)=>{
        res.json(noteJustDeleted)
      })
      .catch((err)=>{
        res.json(err)
      })

    })

    router.post('/note/update/:id', (req, res, next)=>{
      Note.findByIdAndUpdate(req.params.id, req.body)
      .then((updatedNote)=>{
        res.json(updatedNote)
      })
      .catch((err)=>{
        res.json(err)
      })
    })

    router.post('/note/adduser/:id', (req, res, next) => {
      Note.findById(req.params.id)
      .then((updatedNote) => {
        User.findOne({username: req.body.username})
        .then((user) => {
          if (!updatedNote.user.includes(user.username)) {
            updatedNote.user.unshift(user.username);
            updatedNote.save();
            res.json(updatedNote);
          } else {
            res.json({
              message: "This user is already in the team"
            })
            return;
          }
        })
        .catch(() => {
          res.json({
            message: "Username not found"
          })
          return;
        })        
      })
      .catch(() => {
        res.json({
          message: "errors"
        });
      })
    })

module.exports = router;
