const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');

router.get('/', (req, res) => {
  // const promise = Movie.find({});

  const promise = Movie.aggregate([

    {
      $lookup: {
        from: 'directors',
        localField: 'director_id',
        foreignField: '_id',
        as: 'director'
      }
    }
  ]);

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// Between year

router.get('/between/:start_year/:end_year', (req, res) => {
  const { start_year, end_year } = req.params;

  const promise = Movie.find({
    year: {
      '$gte': parseInt(start_year),
      '$lte': parseInt(end_year)
    }
  });

  promise.then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });
});

// Top 10 List

router.get('/top10', (req, res) => {
  const promise = Movie.find({}).sort({ imdb_score: 1 }).limit(10);

  promise.then((movies) => {
    if (!movies) {
      res.json({ message: 'Movies not found', code: 100 });
    } else {
      res.json(movies);
    }
  }).catch((err) => {
    res.json(err);
  });
});

// Silme 

router.delete('/:movie_id', (req, res) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id);

  promise
    .then((data) => {
      if (!data) {
        res.json({ message: 'The movie was not found', code: 99 });
      } else {
        res.json({ status: 1 });
      }
    }).catch((err) => {
      res.json(err);
    });
});

// Güncelleme
router.put('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, { new: true });
  promise.then((data) => {
    if (!data) {
      next({
        message: 'The Movie was not found',
        code: 99
      });
    } else {
      res.json(data);
    }
  }).catch((err) => {
    res.json(err);
  });
});

// Movie List with ID
router.get('/:movie_id', (req, res, next) => {
  const promise = Movie.findById(req.params.movie_id);

  promise.then((movie) => {
    if (!movie) {
      next({ message: 'The movie was not found', code: 1 });
    }
    res.json(movie);
  }).catch((err) => {
    res.json(err);
  });

});



router.post('/', function(req, res) {
  // const { title, imdb_score, category, country, year } = req.body;
  // const movie = new Movie({
  //   title: title,
  //   imdb_score: imdb_score,
  //   category: category,
  //   country: country,
  //   year: year
  // });

  const movie = new Movie(req.body);
  movie.save().then((data) => {
    res.json(data);
  }).catch((err) => {
    res.json(err);
  });

  // movie.save((err, data) => {
  //   if (err) {
  //     res.json(err);
  //   } else {
  //     res.json({ status: 1 });
  //   }
  // });



});

module.exports = router;