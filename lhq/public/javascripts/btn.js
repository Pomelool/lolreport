$("form1").submit(function(){
  var query = $('#input-me').val();
  $.post("http://localhost:3000/",{query:query}, function(data){});
});
