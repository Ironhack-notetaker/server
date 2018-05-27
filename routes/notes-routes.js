const express = require('express');
const router  = express.Router();
const Note    = require('../models/note');

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

//add a NEW task
router.post('/notes/create', (req, res, next)=>{
  console.log(req.body);
    const newNote = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      urgency: req.body.urgency
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

module.exports = router;
