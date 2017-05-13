var express = require('express');
var request = require('request');
var rp = require('request-promise');

var match = require('../algorithms/matches');
var tag = require('../algorithms/tag');

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
        match.fetch(accountId,apikey).then(function(matches){
          var pml = [];
          for (var i = 0; i < matches.length; i++) {
            pml.push(matches[i]);
          }
          if (pml.length < 10) {
              /*render not enough matches*/
              console.log("not enough matches found");
          }
          else{
            /*Get matchlist complete now render*/
            /*PML is player match list
            /*Add Code Here to check tag */
            var matchidList = [];
            for (var i = 0; i < pml.length; i++) {
              matchidList.push(pml[i]["gameId"]);
            }

            var matchuri = "https://na1.api.riotgames.com/lol/match/v3/matches/";
            for (var i = 0; i < matchidList.length; i++) {
              var uris = [];
              uris.push(matchuri + matchidList[i] + "?" + apikey);
            }
            const matchesPromises = uris.map(url => rp(url));
            Promise.all(matchesPromises).then((matchData) => {
              tag.checkTags(matchData).then((tags) =>{
                console.log(tags);
                res.render('index', { result: body,
                                      val: search,
                                      matches: tags
                                    });
              });
            });
          }
        });
      }
      else{
        /*Not found any result by id*/
        res.render('index', { result: 'Err!',
                              val: '',
                              matches:''
                            });
      }
    });
  }
  else {
    /*No search*/
    res.render('index', { result: 'Not Found',
                          val:'',
                          matches:''
                        });
  }
});

module.exports = router;
