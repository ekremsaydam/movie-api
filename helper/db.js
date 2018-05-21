const mongoose = require('mongoose');

module.exports = () => {
  mongoose.connect('mongodb://news:abcd1234@ds229790.mlab.com:29790/movie-api');
  mongoose.connection.on('open', () => {
    console.log('MongoDB : Baglandı');
  });

  mongoose.connection.on('error', (err) => {
    console.log('MongoDB: ERROR', err);
  });

  mongoose.Promise = global.Promise;
};