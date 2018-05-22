const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Router
const router = express.Router();


// Model

const User = require('../models/User');

router.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10).then(function(hash) {
    const user = new User({
      username,
      password: hash
    });

    const promise = user.save();

    promise.then((data) => {
      res.json(data);
    }).catch((err) => {
      res.json(err);
    });
  });
});


// router.post('/auth', (req, res) => {
//   const { username, password } = req.body;

//   User.findOne({
//     username
//   }).then((user) => {
//     if (!user) {
//       res.json({ message: 'Authentication failed, user not found', status: false });
//     } else {
//       bcrypt.compare(password, user.password).then((result) => {
//         if (!result) {
//           res.json({
//             status: false,
//             message: 'Authentication failed, wrong password'
//           });
//         } else {
//           const payload = {
//             username
//           };
//           const token = jwt.sign(
//             payload,
//             req.app.get('api_secret_key'), {
//               expiresIn: 720 // 12 saat
//             });

//           res.json({
//             status: true,
//             token
//           });
//         }
//       });
//     }
//   }).catch((err) => {
//     res.json(err);
//   });



// });

router.post('/auth', (req, res) => {
  const { username, password } = req.body;
  User.findOne({
    username
  }).then((user) => {
    if (!user) {
      res.json({ status: false, message: 'Authentication failed, user not found' });
    } else {
      bcrypt.compare(password, user.password).then((result) => {
        if (!result) {
          res.json({ status: false, message: 'Authentication Failed, wrong password' });
        } else {
          const payload = {
            username
          };
          const token = jwt.sign(payload, req.app.set('api_secret_key'), {
            expiresIn: 720 // 12 saat
          });

          res.json({ status: true, token });
        }
      });
    }
  }).catch((err) => {
    res.json(err);
  });
});

module.exports = router;