var express = require('express');
var request = require('request');
var Promise = require("bluebird");
var rp = Promise.promisifyAll(require("request"), {multiArgs: true});

var match = require('../algorithms/matches');
var tag = require('../algorithms/tag');



var router = express.Router();

var apikey =  "api_key=RGAPI-76ec015c-d650-4411-a0fe-0fac31572163";
var urlprefix = "https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/"

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { result: 'Please Search',
                        val: "",
                        tags:""
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
            var uris = [];
            for (var i = 0; i < matchidList.length; i++) {
              uris.push(matchuri + matchidList[i] + "?" + apikey);
            }
            Promise.map(uris, function(url) {
                return rp.getAsync(url).spread(function(response,body) {
                    var answer = JSON.parse(body);
                    return answer;
                });
            })
            .then(function(results) {
                 // results is an array of all the parsed bodies in order
                 tag.checkTags(accountId, results).then((tags) =>{
                   res.render('index', { result: body,
                                         val: search,
                                         tags: tags
                                       });
                 });
            }).catch(function(err) {
                console.log(err);
                 // handle error here
            });
          }
        });
      }
      else{
        /*Not found any result by id*/
        res.render('index', { result: 'Err!',
                              val: '',
                              tags:''
                            });
      }
    });
  }
  else {
    /*No search*/
    res.render('index', { result: 'Not Found',
                          val:'',
                          tags:''
                        });
  }
});

module.exports = router;
