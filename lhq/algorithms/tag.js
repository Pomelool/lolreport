var Promise = require("bluebird");

module.exports = {
  checkTags: function (aid, data) {
    return new Promise(function(resolve, reject){
      /*participant number */
      var tags = [];

      var participantIds = [];
      for (var i = 0; i < data.length; i++) {
        var pdts = data[i]["participantIdentities"];
        for (var j = 0; j < pdts.length; j++) {
          if (pdts[j]['player']['accountId'] == aid) {
            participantIds.push(pdts[j]['participantId']);
          }
        }
      }
      var playerdts = [];
      for (var i = 0; i < data.length; i++) {
        var playerdt = data[i]['participants'][participantIds[i] - 1]
        playerdts.push(playerdt);
      }
      /*playerdts is a {} which has the 20 games data of the player provided */
      /* add code here */

      
      var checkMinionsSlayer =  new Promise(function(resolve, reject){
          console.log(playerdts);
          resolve(tags);
        });

      var checkNeverCs = new Promise(function(resolve, reject){
          resolve(tags.push(2));
        });

      Promise.all([checkMinionsSlayer,
                   checkNeverCs
                 ])
              .then(function(){
                resolve(tags);
              })
              .catch(reason => {
                console.log(reason);
              });
    });
  }
};
