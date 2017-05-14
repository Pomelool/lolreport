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

      var durations = []
      for (var i = 0; i < data.length; i++) {
        durations.push(data[i]['gameDuration']);
      }
      /*playerdts is a {} which has the 20 games data of the player provided */
      /* add code here */

      var checkMinionsSlayer =  new Promise(function(resolve, reject){
          var tmk = 0;
          var time =0;
          for (var i = 0; i < playerdts.length; i++) {
            tmk += playerdts[i]['stats']['totalMinionsKilled'];
            tmk += playerdts[i]['stats']['neutralMinionsKilled'];
            time += durations[i];
          }
          var avgtmk = tmk/(time/60.0);
          console.log('Minions Slayer: ' + avgtmk + (" (> 6.2/min)"));
          if(avgtmk >= 6.5){
            resolve(tags.push('Minions_Slayer'));
          }
          else{
            resolve(tags);
          }
        });

      var checkYourHouseIsMine = new Promise(function(resolve, reject){
          var nmkej = 0;
          for (var i = 0; i < playerdts.length; i++) {
            nmkej += playerdts[i]['stats']['neutralMinionsKilledEnemyJungle'];
          }
          var avgnmkej = nmkej/playerdts.length;
          console.log('Your house is Mine: ' + avgnmkej + (" (> 20/match)"));
          if(avgnmkej >= 20){
            resolve(tags.push('Your_House_Is_Mine'));
          }
          else{
            resolve(tags);
          }
      });

      Promise.all([checkMinionsSlayer,
                   checkYourHouseIsMine
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
