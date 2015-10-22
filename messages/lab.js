function parse(){
var data;
var parsedData;
var request = new XMLHttpRequest();
var element;
request.open("GET", "data.json", true);
request.open("GET", "data.json", true);
request.send(null);

request.onreadystatechange = function() {
	if (request.readyState == 4){
		console.log("DATA RECEIVED!");
		parsedData = JSON.parse(request.responseText);
	} 

}

//document.h2.innerHTML = parsedData[1].id;
element = document.getElementById('messages');
element.document.write = parsedData[0].id;
element.document.write = parsedData[0].content;
console.log("parsed the data", parsedData);


}