'use strict';

$(document).ready(function () {
   var userID;
   
   $.ajax({
       type: "GET",
       url: "https://votingapp-bartowski20.c9users.io/access-token" + location.search,
       success: successHandler,
       error: backHome
   });
   
   function successHandler (data) {
       userID = JSON.stringify(data.id);
       $("#name").val(userID);
       $("#name").html(JSON.stringify(data.name).substr(1, data.name.length) + " <span class='caret'></span>");
   }
   
   function backHome (err) {
      window.location.href = "https://votingapp-bartowski20.c9users.io/";
   }
   
   $("#logout").on("click", function () {
      $.ajax({
         type: "GET",
         url: "https://votingapp-bartowski20.c9users.io/logout",
         success: backHome
      });

   });
});