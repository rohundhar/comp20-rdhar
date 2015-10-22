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
		console.log("parsed the data", parsedData);
	} 
}
document.body.innerHTML = parsedData.[1].id;


}