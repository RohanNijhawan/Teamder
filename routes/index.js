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

/* GET login page. */
router.get('/login', function(req, res) {
    res.render('login');
});

/* GET signup page. */
router.get('/signup', function(req, res) {
    res.render('signup');
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* Displays the information pertaining to one of the users */
router.post('/currentuser', function(req, res) {
    var db = req.db;
    var collection = db.get('users');
    console.log("login request from " + req.body.email + ", using password: " + req.body.password);
    var currentuser = req.body.email;
    var password = req.body.password;
    var userdisp;
    collection.findOne({"email": currentuser},{},function(e,user){
        if (e || user==null) {
            console.log("made it");
            res.redirect("/login", { error: "invalid email"});
        } else {
            console.log("entered password: " + password + " user password: " + user["password"]);
            if (password===user["password"]) {
                userdisp = user; 
                collection.find({},{},function(e,docs){
                    console.log(userdisp);
                    res.render('currentuser', {
                        "users" : docs,
                        "user" : userdisp
                    });
                }); 
            } else {
                res.redirect("/login", { error: "invalid password"});
            } 
        }  
    });   
});

/*POST new user info */
router.post('/adduser', function (req, res) {
    var db = req.db;
    var name = req.body.name;
    var email = req.body.email;
    //security? what's security...?
    var pass = req.body.password;
    // var skills = req.body.skills.split(/[\s,]+/);
    // var lookingFor = req.body.lookingFor.split(/[\s,]+/);

    var collection = db.get('users');

    collection.insert({
        "name": name,
        "school": "",
        "skills": [],
        "lookingFor": [],
        "email": email,
        "password": pass
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
<<<<<<< HEAD
    var currentuser = req.username;
    console.log(name);
    collection.find({$text:{ $search: currentuser, $caseSensitive: false}},{},function(e,docs){
        if (e) {
                res.send("Your name does not exist on the Database. Please enter your fullname");
            }
            var userdisp = user; 
        });

    collection.find({},{},function(e,docs){
=======
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
>>>>>>> origin/master
        res.render('currentuser', {
            "users" : docs,
            "user" : userdisp
        });
<<<<<<< HEAD
    }); 
=======
    });
>>>>>>> origin/master
});
module.exports = router;
