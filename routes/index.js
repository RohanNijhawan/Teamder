var express = require('express');
var router = express.Router();

/*GET all info
for debugging only */
router.get('/allinfo', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('allinfo', {
            "users" : docs

        });
    });
});

/*GET all info, testing CSS
for debugging only */
router.get('/allinfopretty', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    collection.find({},{},function(e,docs){
        res.render('allinfopretty', {
            "users" : docs
        });
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* Displays the information pertaining to one of the users */
router.get('/currentuser', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    var currentuser = req.body.username;
    var userdisp;
    collection.find({$text:{ $search: currentuser, $caseSensitive: false}},{},function(e,user){
        if (e) {
                res.send("Your name does not exist on the Database. Please enter your fullname");
            }
            console.log(user);
            userdisp = user; 
        });

    collection.find({},{},function(e,docs){
        console.log(userdisp);
        res.render('currentuser', {
            "users" : docs,
            "user" : userdisp
        });
    }); 
});

/*POST new user info */
router.post('/adduser', function (req, res) {
    var db = req.db;
    var name = req.body.name;
    var school = req.body.school;
    var skills = req.body.skills.split(/[\s,]+/);

    var lookingFor = req.body.lookingFor.split(/[\s,]+/);

    var collection = db.get('users');

    collection.insert({
        "name": name,
        "school": school,
        "skills": skills,
        "lookingFor": lookingFor
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem writing to the DB.");
        } else {
            res.redirect("allinfo");
        }
    })
});
/*Finds the teammate compatability for one user */
/* GET New User page. */
router.get('/finduser', function(req, res) {
    res.render('finduser', { title: 'Find your teammates' });
});
/* Handles the search user request. */
router.post('/searchuser', function (req, res) {
    var db = req.db;
    var collection = db.get('users');
    var currentuser = req.body.username;
    var userdisp;
    collection.find({"name": currentuser},{},function(e,user){
        if (e) {
                res.send("Your name does not exist on the Database. Please enter your fullname");
            }
            userdisp = user; 
        });

    collection.find({},{},function(e,docs){
        console.log(userdisp);
        res.render('currentuser', {
            "users" : docs,
            "user" : userdisp
        });
    });
});
module.exports = router;
