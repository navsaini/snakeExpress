var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('snake', { title: 'Express' });
});

router.get('/scores', function(req, res, next) {
    var db = req.db;
    var data = db.get("scores");
    data.find({},{},function(err, docs){
        res.render('scores', {
            'scores' : docs
        });
    });
});

router.post('/', function(req, res) {
    var db = req.db;
    var score = req.body.score;
    var collection = db.get('scores');

    // Submit to the DB
    collection.insert({
        "score" : score,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
    });
});

module.exports = router;
