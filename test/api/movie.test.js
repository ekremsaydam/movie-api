const chai = require('chai');
const chaiHttp = require('chai-http');
// const should = chai.should();
const server = require('../../app');
chai.use(chaiHttp);

let token, movieId;

// GET movies all Test
describe('> /api/movies TEST', () => {

  before((done) => {
    chai.request(server)
      .post('/auth')
      .send({ username: 'test8', password: '12345678' })
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  describe('> /GET movies', () => {
    it('it should GET all the movies', (done) => {
      chai.request(server)
        .get('/api/movies')
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          done();
        });
    });
  });

  // (POST) Movie 
  describe('> /POST Movie', () => {
    it('it should POST a movie', (done) => {
      const movie = {
        title: 'Test Film Title',
        director_id: '5b032548db1e6f27d896d730',
        category: 'Test Category',
        country: 'Turkiye',
        year: (new Date).getFullYear,
        imdb_score: 8
      };

      chai.request(server)
        .post('/api/movies')
        .send(movie)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('director_id');
          res.body.should.have.property('category');
          res.body.should.have.property('country');
          res.body.should.have.property('year');
          res.body.should.have.property('imdb_score');
          movieId = res.body._id;
          done();
        });
    });
  });

  // GET Movie:directory_id
  describe('> /GET/:movie_id movie', () => {
    it('it should GET a movie by the given id', (done) => {
      chai.request(server)
        .get('/api/movies/' + movieId)
        .set('x-access-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
          res.body.should.have.property('director_id');
          res.body.should.have.property('category');
          res.body.should.have.property('country');
          res.body.should.have.property('year');
          res.body.should.have.property('imdb_score');
          res.body.should.have.property('_id').eql(movieId);
          done();
        });
    });
  });

  describe('> /PUT/:movie_id', () => {

    it('it should PUT a movie given by id', (done) => {
      const movie = {
        title: 'Update Title',
        director_id: '5b032548db1e6f27d896d731',
        category: 'Update Category',
        country: 'Fransa',
        year: 1980,
        imdb_score: 9.9
      };
      chai.request(server)
        .put('/api/movies/' + movieId)
        .set('x-access-token', token)
        .send(movie)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('title').eql(movie.title);
          res.body.should.have.property('director_id').eql(movie.director_id);
          res.body.should.have.property('category').eql(movie.category);
          res.body.should.have.property('country').eql(movie.country);
          res.body.should.have.property('year').eql(movie.year);
          res.body.should.have.property('imdb_score').eql(movie.imdb_score);
          done();
        });
    });
  });


  describe('> /DELETE/:movie_id movie', () => {
    it('it should DELETE a movie given by id', (done) => {
      chai.request(server)
        .del('/api/movies/' + movieId)
        .set('x-access-token', 'token')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.property('status').eql(1);
          done();
        });
    });
  });

});