function parse(){
var data;
var parsedData;
var request = new XMLHttpRequest();

//request.open("GET", "data.json", true);

request.onreadystatechange = function() {
	if (request.readyState == 4){
		console.log("DATA RECEIVED!");
		var parsedData = JSON.parse(request.responseText);
		console.log("parsed the data", parsedData);
	} */
	//request.send(null);
}
request.open("GET", "data.json", true);
request.send(null);

//parsedData = JSON.parse(data);
//console.log("this is the data:", parsedData);

}