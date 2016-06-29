'use strict';

$(document).ready(function (){
   $("#vote").on("click", function () {
      var vote = $("#choice").html();
      var id = location.href.substr(location.href.length-24, location.href.length);
      $.ajax({
         type: "POST",
         url: "https://votingapp-bartowski20.c9users.io/vote",
         data: {vote: vote, id: id},
         success: successer,
         error: errorer
     });
   }); 
});



function successer(data) {
    alert("Cast vote for " + data);
    location.reload();
}

function errorer(err) {
    alert('error with casting vote');
}