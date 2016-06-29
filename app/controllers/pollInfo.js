'use strict';

$(document).ready(function () {
   $.ajax({
       type: "POST",
       url: location.href,
       success: successHandler,
       error: errorHandler
   });
   
   $("#choices").on("click",  ".option", function (event) {
       var id = event.target.id;
       var chosen = $("#"+id).html();
       $("#choice").html(chosen);
   })
});

function successHandler (data) {
       var title = JSON.stringify(data[0].title);
       var choices = data[0].choices;
       var votes = JSON.stringify(data[0].votes);

       var options = "";
       var i = 1;
       choices.forEach(function (element) {
           options += "<li class='option' id='option" + i + "'>" + element + "</li>";
           i++;
       });
       $("#title").html(title.substr(1, title.length-2));
       $("#choices").html(options);
       $("#polldata").html(votes);
}
   
function errorHandler (err) {
       alert("error pulling page data");
}