var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CodeShare - Plateforme pour un échange de code.' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'CodeShare - Plateforme pour un échange de code.' });
});

router.route('/contact')
  .get(function(req, res, next) {
    res.render('contact', { title: 'CodeShare - Plateforme pour un échange de code.'});
  })
  .post(function(req, res, next) {
    req.checkBody('name', 'Veillez remplir le champ Nom').notEmpty();
    req.checkBody('email', 'Email invalide').isEmail();
    req.checkBody('message', 'Veillez remplir le champ message').notEmpty();
    var errors = req.validationErrors();

    if(errors) {
      res.render('contact', {
        title: 'CodeShare - Plateforme pour un échange de code.',
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        errorMessages: errors
      });
    } else {
      var mailOptions = {
        from: 'CodeShare <no-reply@codeshare.com>',
        to: 'demo.leonnelm62@gmail.com',
        subject: 'Vous avez reçu un nouveau de visiteur 🥰',
        text: req.body.message
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        res.render('thank', { title: 'CodeShare - Plateforme pour un échange de code.' });
      });
    }
  });

module.exports = router;
