var express = require('express');
var request = require('request');

var match = require('../algorithms/matches');

var Promise = require("bluebird");

var router = express.Router();

var apikey =  "api_key=RGAPI-78d17105-595f-471d-8dcc-17a954c91fca";
var urlprefix = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { result: 'Please Search',
                        val: "",
                        matches:""
                      });
});

router.post('/', function(req, res, next) {
  var search = req.body.query;
  if(search != null && search != ''){
    var uri = urlprefix + search + "?" + apikey;
    request(uri, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var data = JSON.parse(body);
        var accountId = data['accountId'];
        var loadMatches = match.fetch100(accountId,apikey)
        .then(function(matches){
          res.render('index', { result: body,
                                val: search,
                                matches: matches
                              });
        });
      }
      else{
        res.render('index', { result: 'Err!',
                              val: '',
                              matches:''
                            });
      }
    });
  }
  else {
    console.log("test");
    res.render('index', { result: 'Not Found',
                          val:'',
                          matches:''
                        });
  }
});

module.exports = router;
