'use strict';

$(document).ready(function () {
   if (document.referrer.substr(0, 23) == "https://api.twitter.com") {
      makeAjax2(); 
  };
   
   $("#logout").on("click", function () {
      $.ajax({
         type: "GET",
         url: "https://votingapp-bartowski20.c9users.io/logout",
         success: backHome
      });

   });
});


function makeAjax2() {
    $.ajax({
       type: "GET",
       url: "https://votingapp-bartowski20.c9users.io/access-token" + location.search,
       success: successHandler2,
       error: backHome
   });
}


function successHandler2 (data) {
       var userID = JSON.stringify(data.id);
       $("#name").val(userID);
       $("#name").html(JSON.stringify(data.name).substr(1, data.name.length) + " <span class='caret'></span>");
 }
   
function backHome (err) {
    window.location.href = "https://votingapp-bartowski20.c9users.io/";
}