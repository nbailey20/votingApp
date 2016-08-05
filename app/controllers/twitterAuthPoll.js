'use strict';

$(document).ready(function () {
    $("#twitter").on("click", function () {
      var id = window.location.href.substr(window.location.href.length-24, window.location.href.length);
      $.ajax({
          type: "POST",
          url: "/savepoll",
          data: {id: id},
          success: function (data) {
              window.location.href = "https://votingapp-bartowski20.c9users.io/auth";
          }
      });
   }); 
});
   
