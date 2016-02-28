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
router.get('/userinfo', function(req, res) {
    var db = req.db;
    res.render('userinfo');
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
    var skills = req.body.skills.split(/[\s,]+/);
    var lookingFor = req.body.lookingFor.split(/[\s,]+/);

    var collection = db.get('users');

    collection.insert({
        "name": name,
        "school": "",
        "skills": skills,
        "lookingFor": lookingFor,
        "email": email,
        "password": pass
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem writing to the DB.");
        } else {
            res.redirect("/login");
        }
    })
});

/*Finds the teammate compatability for one user */
/* GET New User page. */
router.get('/finduser', function(req, res) {
    res.render('finduser', { title: 'Find your teammates' });
});
/* Handles the search user request. */
router.post('/removeuser', function (req, res) {
    var db = req.db;
    var collection = db.get('users');
    var currentuser = req.body.username;
    collection.remove({"name": currentuser},{justOne: true},function(e,user){
        if (e) {
                res.send("Your name does not exist on the Database");
            }
            res.send("You have been successfully removed from the database. Have a Good Day!");
    });
});
/*Handles addition of skills */
router.post('/addskills', function (req,res) {
    var db = req.db;
    var collection = db.get('users');
    var currentuser = req.body.username;
    var skillsadd = req.body.skills.split(/[\s,]+/);
    var lookingForadd = req.body.lookingFor.split(/[\s,]+/);
    collection.findAndModify(
   { "name": {$eq: currentuser} },
   {$addToSet: {skills : skillsadd, lookingFor : lookingForadd}},
   {upsert: false},function(e,works) {
    if (e) {
            res.send("Your skills already exist on the Database");
            }
            res.send("Your preferences have been successfully updated. Have a Good Day!");
    });
});

/*Handles removal of skills */
router.post('/rmskills', function (req,res) {
    var db = req.db;
    var collection = db.get('users');
    var currentuser = req.body.username;
    var skillsadd = req.body.skills.split(/[\s,]+/);
    var lookingforadd = req.body.lookingFor.split(/[\s,]+/);
    collection.findAndModify(
   {"name": currentuser },
   {$pull: {skills : {$in: skillsadd}, lookingFor :{$in: lookingforadd}}},
   {multi: true},function(e,works){
    if (e) {
            res.send("Your skills do not exist on the Database");
            }
            res.send("Your preferences have been successfully updated. Have a Good Day!");
    });
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
