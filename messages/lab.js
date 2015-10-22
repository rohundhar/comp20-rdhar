function parse(){
var data;
var parsedData;
var request = new XMLHttpRequest();
request.open("GET", "data.json", true);

/*request.onreadystatechange = function() {
	if (request.readyState == 4){
		console.log("DATA RECEIVED!");
	} */
	request.send(null);
	data = request.responseText;
//}

console.log("this is the data:", data);
parsedData = JSON.parse(data);

}