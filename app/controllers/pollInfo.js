'use strict';

var title;
var choices;
var votes;

$(document).ready(function () {
   makeAjax1();
   
   google.charts.load('current', {'packages':['corechart']});
   google.charts.setOnLoadCallback(drawChart);
   
   $("#choices").on("click",  ".option", function (event) {
       var id = event.target.id;
       var chosen = $("#"+id).html();
       if (chosen == "Custom Option...") {
           $("#customvote").html('<p class="custom-text col-xs-6">New Option:</p><input id="newinput" class="col-xs-6 custom-input" type="text">');
       }
       $("#choice").html(chosen);
   });
   
   
   $("#vote").on("click", function () {
       var vote = $("#choice").html();
       if (vote.substr(0,19) == "Choose an option...") {
           alert("Please select an option before voting.");
       }
       else if (vote.substr(0, 16) == "Custom Option...") {
           var writein = $("#newinput").val();
           var id = window.location.pathname.substr(window.location.pathname.length-24, window.location.pathname.length);
           $.ajax({
             type: "POST",
             url: "https://votingapp-bartowski20.c9users.io/vote",
             data: {vote: writein, id: id, choice: writein},
             success: successer,
             error: errorer
           });
           
       }
       else {
            var id = window.location.pathname.substr(window.location.pathname.length-24, window.location.pathname.length);
           $.ajax({
             type: "POST",
             url: "https://votingapp-bartowski20.c9users.io/vote",
             data: {vote: vote, id: id},
             success: successer,
             error: errorer
           });
       }
   });
   
   $("#share").on("click", function () {
       var url = "https://twitter.com/intent/tweet?text="+$("#title").html()+" %7C Voter&url=https://votingapp-bartowski20.c9users.io/poll/";
       url += window.location.pathname.substr(window.location.pathname.length-24, window.location.pathname.length);
       window.open(url, "_blank"); 
   });
   
   
   $("#delete").on("click", function () {
      var makeSure = confirm("Are you sure you want to delete this poll?"); 
      if (makeSure) {
           var id = window.location.pathname.substr(window.location.pathname.length-24, window.location.pathname.length);
           $.ajax({
             type: "POST",
             url: "/deletePoll",
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
        url: window.location.href,
        success: successHandler1,
        error: errorHandler
    });
}

function successHandler1 (data) {
       title = JSON.stringify(data.title);
       choices = data.choices;
       votes = JSON.stringify(data.votes);
        
       var options = "";
       var i = 1;
       choices.forEach(function (element) {
           options += "<li class='option' id='option" + i + "'>" + element + "</li>";
           i++;
       });
      
       $("#title").html(title.substr(1, title.length-2));
       if (data.user) {
           if (data.user.twitterid) {
               options += "<li class='option' id='writein'>Custom Option...</li>";
               if (data.user.twitterid == data.createdby) {
                    $("#delete").html("<button id='deletepoll' class='btn btn-danger delete-button'>Delete Poll</button>");
               }
           }
       }
       $("#choices").html(options);
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
   } 
   
function successer(data) {
      alert("Cast vote for " + data);
      $("#choice").html("Choose an option... <span class='caret'></span>");
      $("#customvote").html("");
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
