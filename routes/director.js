const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Models

const Director = require('../models/Director');

router.post('/', (req, res) => {
  const director = new Director(req.body);

  const promise = director.save();

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

router.get('/', (req, res) => {
  const promise = Director.aggregate([

    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    },
    // {
    //   $unwind: {
    //     path: '$movies',
    //     preserveNullAndEmptyArrays: true
    //   }
    // },
    // {
    //   $group: {
    //     _id: {
    //       _id: '$_id',
    //       name: '$name',
    //       surname: '$surname',
    //       bio: '$bio'
    //     },
    //     movies: {
    //       $push: '$movies'
    //     }
    //   }
    // }, 
    {
      $project: {
        _id: 1,
        name: 1,
        surname: 1,
        movies: 1
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});



// Yonetmene Göre movies

router.get('/:director_id', (req, res) => {
  const directorid = req.params.director_id;
  const promise = Director.aggregate([

    {
      $match: {
        _id: mongoose.Types.ObjectId(directorid)
      }
    },
    {
      $lookup: {
        from: 'movies',
        localField: '_id',
        foreignField: 'director_id',
        as: 'movies'
      }
    }
  ]);

  promise.then((data) => {
    console.log(data);
    if (data.length === 0 || !data) {
      res.json({ message: 'The director was not found', code: 99 });
    } else {
      res.json(data);
    }
  }).catch((err) => {
    res.json(err);
  });

});

// yonetmen guncelleme

router.put('/:director_id', (req, res) => {
  const promise = Director.findByIdAndUpdate(
    req.params.director_id,
    req.body, {
      new: true
    }
  );

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// yönetmen silme

router.delete('/:director_id', (req, res) => {
  const promise = Director.findByIdAndRemove(
    req.params.director_id
  );

  promise.then((director) => {
    if (!director) {
      res.json({ message: 'The director was not found', code: 99 });
    } else {
      res.json({ status: 1 });
    }
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;