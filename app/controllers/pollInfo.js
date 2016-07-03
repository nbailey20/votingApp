'use strict';

var title;
var choices;
var votes;

$(document).ready(function () {
   if (document.referrer.substr(0, 23) == "https://api.twitter.com") {
       setTimeout(makeAjax1, 750);
   }
   else {
       makeAjax1();
   }
   
   google.charts.load('current', {'packages':['corechart']});
   google.charts.setOnLoadCallback(drawChart);
   
   $("#choices").on("click",  ".option", function (event) {
       var id = event.target.id;
       var chosen = $("#"+id).html();
       $("#choice").html(chosen);
   });
   
   $("#vote").on("click", function () {
       var vote = $("#choice").html();
       var id = location.pathname.substr(location.pathname.length-24, location.pathname.length);
       $.ajax({
         type: "POST",
         url: "https://votingapp-bartowski20.c9users.io/vote",
         data: {vote: vote, id: id},
         success: successer,
         error: errorer
       });
   });
   
   $("#share").on("click", function () {
       var url = "https://twitter.com/intent/tweet?text="+$("#title").html()+" %7C Voter&url=https://votingapp-bartowski20.c9users.io/poll/";
       url += location.pathname.substr(location.pathname.length-24, location.pathname.length);
       window.open(url, "_blank"); 
   });
   
   
   $("#delete").on("click", function () {
      var makeSure = confirm("Are you sure you want to delete this poll?"); 
      if (makeSure) {
           var id = location.pathname.substr(location.pathname.length-24, location.pathname.length);
           $.ajax({
             type: "POST",
             url: "https://votingapp-bartowski20.c9users.io/deletePoll",
             data: {id: id},
             success: successDelete,
             error: errorDelete
           });
      }
   });
   
});

function makeAjax1() {
       $.ajax({
              type: "POST",
              url: location.href,
              success: successHandler1,
              error: errorHandler
          });
}

function successHandler1 (data) {
        title = JSON.stringify(data.title);
        choices = data.choices;
        votes = JSON.stringify(data.votes);
        var header = '<div class="col-xs-2 header-title"><a class="header-title" href="https://votingapp-bartowski20.c9users.io/user">Voter</a>' 
		header += '</div><div class="col-xs-6"></div><div class="col-xs-1 header-home"><a class="header-home" href="https://votingapp-bartowski20.c9users.io/user">Home</a>'
		header += '</div><div class="col-xs-1 header-mypolls"><a class="header-mypolls" href="https://votingapp-bartowski20.c9users.io/mypolls">My Polls</a>'
		header += '</div><div class="col-xs-1 header-newpoll"><a class="header-newpoll" href="https://votingapp-bartowski20.c9users.io/newpoll">New Poll</a>'
		header += '</div><div class="col-xs-1"><div class="dropdown">'
		header += '<button class="header-name btn btn-default dropdown-toggle" id="name" data-toggle="dropdown">Loading...<span class="caret"></span></button>'
		header += '<ul class="dropdown-menu"><li id="logout"><a href="https://votingapp-bartowski20.c9users.io/logout">Logout</a></li></ul></div></div>'
       
       var options = "";
       var i = 1;
       choices.forEach(function (element) {
           options += "<li class='option' id='option" + i + "'>" + element + "</li>";
           i++;
       });
       $("#title").html(title.substr(1, title.length-2));
       $("#choices").html(options);
       if (data.loggedIn == "yes") {
           $("#header").html(header);
           $("#name").html(data.name + '<span class="caret"></span>');
           $("#delete").html("<button id='deletepoll' class='btn btn-danger delete-button'>Delete Poll</button>");
       }
       drawChart();
}
  
   
function errorHandler (err) {
       alert("error pulling page data");
}


function drawChart() {
       var dataArray = [['Choice', 'Number of Votes']];
       var results = JSON.parse(votes);
       choices.forEach(function (element) {
          dataArray.push([element, results[element]]);
       });
       var data = google.visualization.arrayToDataTable(dataArray);

       var options = {
          backgroundColor: { fill: "lightgray" },
          legend: {position: "bottom"},
          pieSliceText: "value"
       };

       var chart = new google.visualization.PieChart(document.getElementById('piechart'));
       chart.draw(data, options);
   }; 
   
   function successer(data) {
      alert("Cast vote for " + data);
      makeAjax1();
}

   function errorer(err) {
     alert('error with casting vote');
   }


function successDelete (data) {
    window.location.href = "https://votingapp-bartowski20.c9users.io/user";
}

function errorDelete (err) {
    alert("error with deleting poll");
}
