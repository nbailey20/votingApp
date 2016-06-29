'use strict';

$(document).ready(function () {
   $("#create-poll").on("click", function () {
      var title = $("#title-input").val();
      var choices = "'" + $("#choices-input").val().split("\n") + "'";
      var author = $("#name").val();
      var votes = [];
      $("#choices-input").val().split("\n").forEach(function (item) {
         var obj = {};
         obj[item] = 0;
         votes.push(obj);
      });
      alert(JSON.stringify(votes));
      votes = "'" + JSON.stringify(votes) + "'";
      $.ajax({
          type: "POST",
          url: "https://votingapp-bartowski20.c9users.io/make-poll",
          data: {title: title, choices: choices, author: author, votes: votes},
          success: successHandler,
          error: errorHandler
      });
      
      function successHandler (data) {
          window.location.href = "https://votingapp-bartowski20.c9users.io/poll/" + data.substr(1, data.length-2);
      }
      
      function errorHandler (err) {
          alert("things fucked up");
      }
   }); 
});