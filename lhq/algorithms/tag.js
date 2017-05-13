
function checkMinionsSlayer(tags, data){
  return 1;
}

module.exports = {
  checkTags: function (data) {
    var tags = [];

    checkMinionsSlayer(tags, data);
    return tags;
  }
};
