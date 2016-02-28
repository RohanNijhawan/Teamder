var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/*POST new user info */
router.post('/adduser', function (req, res) {
    var db = req.db;

    var name = req.body.name;
    var school = req.body.school;
    var skills = req.body.skills.split(',');
    var lookingFor = req.body.lookingFor.split(',');

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
})

module.exports = router;
