var index=0;
var data=[];
$(document).ready(function() {
  $("#version").html("v0.14");
  
  $("#searchbutton").click( function (e) {
    displayModal();
  });
  
  $("#searchfield").keydown( function (e) {
    if(e.keyCode == 13) {
      displayModal();
    }	
  });
  
  function displayModal() {
    $(  "#myModal").modal('show');

    $("#status").html("Searching...");
    $("#dialogtitle").html("Search for: "+$("#searchfield").val());
    $("#previous").hide();
    $("#next").hide();
    $.getJSON('/search/' + $("#searchfield").val() , function(data) {
      renderQueryResults(data);
    });
  }
  
  $("#next").click( function(e) {
      
        index++;
        $("#shuns00h0").attr('src', data.results[index])
  
      
  });
  
  $("#previous").click( function(e) {
      index--;
      $("#shuns00h0").attr('src', data.results[index])
     
    
  
  });

  function renderQueryResults(data) {
    
    if (data.error != undefined) {
      $("#status").html("Error: "+data.error);
      $("#shuns00h0").attr('src', '')
    
    } else {
      this.data = data;
      $("#status").html(""+data.num_results+" result(s)");
      if(data.results.lenght == 0){
        $("#shuns00h0").attr('src', '')
   
      }
      $("#shuns00h0").attr('src', data.results[0])
    
      console.log("Los datos encontrados fueron: " + data);
      $("#next").show();
      $("#previous").show();
      
     }
   }
});
