function parse(){
var data;
var parsedData;
var request = new XMLHttpRequest();
request.open("GET", "data.json", true);
request.open("GET", "data.json", true);
request.send(null);

request.onreadystatechange = function() {
	if (request.readyState == 4){
		parsedData = JSON.parse(request.responseText);

		var output = "";
		for (var i=0; i<2; i++){
			output += "<p>" + parsedData[i].content + " -- " + parsedData[i].username + "</p>";
		}

		var element = document.getElementById('messages');
		element.innerHTML = output;
	} 

}

}