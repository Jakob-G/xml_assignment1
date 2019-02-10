var fs = require('fs');
var http = require('http');
var xmldom = require('xmldom');
const parse = require('csv-parse');
var root = '';
var userinput = process.argv[2]
//console.log(input)

http.createServer(function (req, res) {
	parser = new xmldom.DOMParser();
	xmldoc = parser.parseFromString(`<${userinput}></${userinput}>`, 'text/xml');
	root = xmldoc.documentElement;
	res.writeHead(200, {'Content-Type': 'text/html'});
	result = '';
	x = root.childNodes;

	const input = fs.readFileSync('data/Subject_Course_Timetables.csv')
	const output = []
	parse(input, {
		trim: true,
		skip_empty_lines: true,
		from_line: 2
	})
	.on('readable', function(){
		let record
		//console.log(userinput)
	  	while (record = this.read()) {
	   		//output.push(record)
	    	makeXml(record,userinput)
	  	}
	})
	.on('end', function(){
	  	serializer = new xmldom.XMLSerializer();
	    tosave = serializer.serializeToString(xmldoc);
		fs.writeFileSync(`./data/201830-${userinput}.xml`,tosave);
		result = show(x);
		//console.log(result)
		res.write(result);
	    res.end(); //end the response
	})


}).listen(8080); //the server object listens on port 8080 

function show(data) {
	for(i=0; i< data.length; i++){
		sub = x[i].childNodes
		//console.log(x[i].nodeName)
		result += `<h2>${x[i].nodeName}</h2><ul>`
		for(n=0; n< sub.length; n++){
			courses = sub[n].childNodes
			//console.log(courses[0].childNodes[0].nodeValue)
			result += `<li>${courses[0].childNodes[0].nodeValue}</li>`
		}
		result += `</ul>`
	}
	return result
}


function makeXml(data, course) {
	if(data[1].substring(0, 4) == course){
		if(root.getElementsByTagName(data[1].substring(5, 8).replace(/ /g,"_"))[0] == undefined){
			newItem = xmldoc.createElement(data[1].substring(5, 8).replace(/ /g,"_"));
			root.appendChild(newItem)
		}
		//create elements
		course = xmldoc.createElement('Course');
		name = xmldoc.createElement('Name');
		day = xmldoc.createElement('Day');
		sTime = xmldoc.createElement('Start_Time');
		eTime = xmldoc.createElement('End_Time');
		teacher = xmldoc.createElement('Teacher');
		sDate = xmldoc.createElement('Start_Date');
		eDate = xmldoc.createElement('End_Date');
		room = xmldoc.createElement('Room');
		max = xmldoc.createElement('Max');
		act = xmldoc.createElement('Act');
		hrs = xmldoc.createElement('Hrs');
		//add text to elements
		name.textContent = data[3];
		day.textContent = data[5];
		sTime.textContent = data[6];
		eTime.textContent = data[7];
		teacher.textContent = data[8].trim();
		sDate.textContent = data[9];
		eDate.textContent = data[10];
		room.textContent = data[11];
		max.textContent = data[12];
		act.textContent = data[13];
		hrs.textContent = data[14];
		//append to root
		course.appendChild(name)
		course.appendChild(day)
		course.appendChild(sTime)
		course.appendChild(eTime)
		course.appendChild(teacher)
		course.appendChild(sDate)
		course.appendChild(eDate)
		course.appendChild(room)
		course.appendChild(max)
		course.appendChild(act)
		course.appendChild(hrs)
		root.getElementsByTagName(data[1].substring(5, 8).replace(/ /g,"_"))[0].appendChild(course);  
	}
}