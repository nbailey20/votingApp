'use strict';

$(document).ready(function () {
    $("#twitter").on("click", function () {
      var id = location.href.substr(location.href.length-24, location.href.length);
      window.location.href = "https://votingapp-bartowski20.c9users.io/request-token-poll/" + id;
   }); 
});
   
