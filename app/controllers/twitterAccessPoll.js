'use strict';

$(document).ready(function () {
   makeAjax2();
   
   $("#logout").on("click", function () {
      window.location = "/logout";
   });
});


function makeAjax2() {
    $.ajax({
       type: "POST",
       url: "/cred",
       success: successHandler2
   });
}


function successHandler2 (data) {
    if (data.twitterid) {
        var header = '<div class="col-xs-2 header-title"><a class="header-title" href="https://votingapp-bartowski20.c9users.io/user">Voter</a>';
		header += '</div><div class="col-xs-5"></div><div class="col-xs-1 header-home"><a class="header-home" href="https://votingapp-bartowski20.c9users.io/user">Home</a>';
		header += '</div><div class="col-xs-1 header-mypolls"><a class="header-mypolls" href="https://votingapp-bartowski20.c9users.io/mypolls">My Polls</a>';
		header += '</div><div class="col-xs-1 header-newpoll"><a class="header-newpoll" href="https://votingapp-bartowski20.c9users.io/newpoll">New Poll</a>';
		header += '</div><div class="col-xs-2"><div class="dropdown">';
		header += '<button class="header-name btn btn-default dropdown-toggle" id="name" data-toggle="dropdown">Loading...<span class="caret"></span></button>';
		header += '<ul class="dropdown-menu"><li id="logout"><a href="https://votingapp-bartowski20.c9users.io/logout">Logout</a></li></ul></div></div>';
        var userID = data.twitterid;
        $("#header").html(header);
        $("#name").val(userID);
        $("#name").html(data.name + " <span class='caret'></span>");
    }
 }