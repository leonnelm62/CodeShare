var express = require('express');
var router = express.Router();
var passport = require('passport');

router.route('/login')
    .get(function(req, res, next) {
        res.render('login', { title: 'Connexion à votre compte' });
    })
    .post(passport.authenticate('local', {
        failureRedirect: '/login'
    }), function(req, res) {
        res.redirect('/');
    });

router.route('/register')
    .get(function(req, res, next) {
        res.render('register', { title: 'Nouvelle inscription' });
    })
    .post(function(req, res, next) {
        req.checkBody('name', 'Le champs nom est vide').notEmpty();
        req.checkBody('email', 'Le champs email est vide ou invalide').isEmail();
        req.checkBody('password', 'Le champs mot de passe est vide').notEmpty();
        req.checkBody('password', 'Ce mot de passe ne correspond pas').equals(req.body.confirmPassword).notEmpty();

        var errors = req.validationErrors();
        if (errors) {
            res.render('register', {
                name: req.body.name,
                email: req.body.email,
                errorMessages: errors
            });
        } else {
            var user = new User();
            user.name = req.body.name;
            user.email = req.body.email;
            user.setPassword(req.body.password);
            user.save(function(err) {
                if (err) {
                    res.render('register', { errorMessages: err });
                } else {
                    res.redirect('/login');
                }
            })
        }
    });

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
}));

module.exports = router;