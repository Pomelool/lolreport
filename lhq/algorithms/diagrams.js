var match = require('../algorithms/matches');
var Promise = require("bluebird");

module.exports = {
  pie1: function(data, renderObject){
    return new Promise(function(resolve, reject){
      var pieOfChampionChoice = new Promise(function(resolve, reject){
        console.log("working");
      });

      resolve(renderObject);
    });
  }
}
