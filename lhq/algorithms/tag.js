var Promise = require("bluebird");

module.exports = {
  checkTags: function (data) {
    return new Promise(function(resolve, reject){
      var tags = [];

      var checkMinionsSlayer =  new Promise(function(resolve, reject){
          resolve(tags.push(1));
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
