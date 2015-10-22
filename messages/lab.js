function parse(){
var request = new XMLHttpRequest();
request.open("GET", "data.json", true);


request.onreadystatechange = function() {
	if (request.readyState == 4){
		console.log("DATA RECIEVED!");
	}
	request.send(null);
	var data = request.responseText;
}
var parsedData = JSON.parse(data);

}
