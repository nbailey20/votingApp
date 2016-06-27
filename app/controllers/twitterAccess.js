'use strict';

$(document).ready(function () {
   $.ajax({
       type: "GET",
       url: "https://votingapp-bartowski20.c9users.io/access-token" + location.search,
       success: successHandler
   });
   
   function successHandler (data) {
       $("#name").html(JSON.stringify(data.name).substr(1, data.name.length));
   }
});