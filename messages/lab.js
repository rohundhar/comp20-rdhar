function parse(){
var data;
var parsedData;
var request = new XMLHttpRequest();
request.open("GET", "data.json", true);

request.onreadystatechange = function() {
	if (request.readyState == 4){
		console.log("DATA RECIEVED!");
	}
	request.send(null);
	data = request.responseText;
	parsedData = JSON.parse(data);
}

}