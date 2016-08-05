'use strict';

$(document).ready(function () {
   
   $.ajax({
       type: "POST",
       url: "/cred",
       success: successHandler
   });
   
   function successHandler (data) {
      if (data.twitterid) {
         var userID = data.twitterid;
         $("#name").val(userID);
         $("#name").html(data.name + " <span class='caret'></span>");
      }
      else {
         window.location = "/";
      }
   }
   
   $("#logout").on("click", function () {
      window.location = "/logout";
   });
   
});
