'use strict';

var title;
var choices;
var votes;

$(document).ready(function () {
   makeAjax();
  // setTimeout(drawChart, 250);
   google.charts.load('current', {'packages':['corechart']});
   google.charts.setOnLoadCallback(drawChart);
   
   $("#choices").on("click",  ".option", function (event) {
       var id = event.target.id;
       var chosen = $("#"+id).html();
       $("#choice").html(chosen);
   });
   
   $("#vote").on("click", function () {
       var vote = $("#choice").html();
       var id = location.href.substr(location.href.length-24, location.href.length);
       $.ajax({
         type: "POST",
         url: "https://votingapp-bartowski20.c9users.io/vote",
         data: {vote: vote, id: id},
         success: successer,
         error: errorer
       });
   });
});

function makeAjax() {
       $.ajax({
              type: "POST",
              url: location.href,
              success: successHandler,
              error: errorHandler
          });
}

function successHandler (data) {
        title = JSON.stringify(data[0].title);
        choices = data[0].choices;
        votes = JSON.stringify(data[0].votes);
       
       var options = "";
       var i = 1;
       choices.forEach(function (element) {
           options += "<li class='option' id='option" + i + "'>" + element + "</li>";
           i++;
       });
       $("#title").html(title.substr(1, title.length-2));
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
   }; 
   
   function successer(data) {
      alert("Cast vote for " + data);
      makeAjax();
}

   function errorer(err) {
     alert('error with casting vote');
   }


