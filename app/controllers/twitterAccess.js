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
       userID = "4659395603";//JSON.stringify(data.id);
       $("#name").val(userID);
       $("#name").html(data); //JSON.stringify(data.name).substr(1, data.name.length));
   }
   
   function backHome (err) {
      window.location.href = "https://votingapp-bartowski20.c9users.io/";
   }
   
   $("#name").on("click", function () {
      $.ajax({
         type: "GET",
         url: "https://votingapp-bartowski20.c9users.io/logout",
         success: backHome
      });

   });
});