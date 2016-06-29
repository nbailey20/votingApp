'use strict';

$(document).ready(function () {
    setTimeout(pullData, 250);
});

function pullData() {
    var id = $("#name").val();
    $.ajax({
       type: "POST",
       url: "https://votingapp-bartowski20.c9users.io/mypolls",
       data: {id: id},
       success: successHandler,
       error: errorHandler
   });
}

function successHandler(data) {
    var html = "";
    data.forEach(function (element) {
        var title = JSON.stringify(element.title);
        var id = JSON.stringify(element["_id"]);
        var url = "https://votingapp-bartowski20.c9users.io/poll/" + id.substr(1, id.length-2);
        html += "<p><a class='data btn btn-default' href='" + url + "'>" + title.substr(1, title.length-2) + "</a></p>";
    });
    $("#polls").html(html);
}
   
function errorHandler (err) {
    alert("something messed up with mypolls data");
}