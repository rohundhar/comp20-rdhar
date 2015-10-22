function parse(){
var data;
var parsedData;
var request = new XMLHttpRequest();
request.open("GET", "data.json", true);
request.open("GET", "data.json", true);
request.send(null);

request.onreadystatechange = function() {
	if (request.readyState == 4){
		console.log("DATA RECEIVED!");
		parsedData = JSON.parse(request.responseText);

		var output = "<ul>";
		for (var i=0; i<2; i++){
			output += "<li>" + parsedData[i].content + " -- " + parsedData[i].username + "</li>";
		}
		output += "</ul>";

		var element = document.getElementById('messages');
		element.innerHTML = output;
	} 

}

}