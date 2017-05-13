var request = require('request');

module.exports = {
  fetch100: function (id, key) {
    return new Promise(function(resolve, reject){
      var uri = 'https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/' + id + '?' + key;
      request(uri, function(error, response, body){
        if(!error && response.statusCode == 200){
          var matchlist = JSON.parse(body);
          resolve(matchlist);
        }
        else{
          console.log("error");
        }
      });
    });
  }
};
