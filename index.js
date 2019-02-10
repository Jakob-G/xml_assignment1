var fs = require('fs');
var http = require('http');
var xmldom = require('xmldom');
const parse = require('csv-parse');
var root = '';
var userinput = process.argv[2].toUpperCase();
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const status = "Active"
//console.log(input)

http.createServer(function (req, res) {
	parser = new xmldom.DOMParser();
	xmldoc = parser.parseFromString(`<classes></classes>`, 'text/xml');
	root = xmldoc.documentElement;
	res.writeHead(200, { 'Content-Type': 'text/html' });
	result = '';
	x = root.childNodes;

	const input = fs.readFileSync('data/Subject_Course_Timetables.csv')
	const output = []
	parse(input, {
		trim: true,
		skip_empty_lines: true,
		from_line: 2
	})
		.on('readable', function () {
			let record
			//filters the data to remove inactive and weekend classes
			while (record = this.read()) {
				if (record[0] == status) {
					if (weekdays.indexOf(record[5]) > -1) {
						//creates the xml
						makeXml(record, userinput)
					} else {
					}
				} else {
				}

			}
		})
		.on('end', function () {
			serializer = new xmldom.XMLSerializer();
			tosave = serializer.serializeToString(xmldoc);
			//adds the xml version and doctipe tags
			tosave=`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE classes SYSTEM "classes.dtd"> ${tosave}`;
			fs.writeFileSync(`./data/201830-${userinput}.xml`, tosave);
			result = show(x);
			//console.log(result)
			res.write(result);
			res.end();
		})


}).listen(8080); //the server object listens on port 8080 

function show(data) {
	for (i = 0; i < data.length; i++) {
		sub = x[i].childNodes
		//adds the headder
		result += `<h2>${x[i].nodeName}</h2><ul>`
		for (n = 0; n < sub.length; n++) {
			courses = sub[n].childNodes
			//adds a line in the list
			result += `<li>${courses[0].childNodes[0].nodeValue} : ${courses[1].childNodes[0].nodeValue} from ${courses[2].childNodes[0].nodeValue} - ${courses[3].childNodes[0].nodeValue} in room ${courses[6].childNodes[0].nodeValue}</li>`
		}
		result += `</ul>`
	}
	return result
}


function makeXml(data, course) {
	//makes sure it is the right course / program (acit ect.)
	if (data[1].substring(0, 4) == course) {
		//checks if there is a existing set for the data if not it makes one
		if (root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0] == undefined) {
			newItem = xmldoc.createElement(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`);
			root.appendChild(newItem)
		}
		z=0
		make=true
		//checks if there is already an existing couse (some courses have multiple teachers) add the teacher to the couse if true
		//  .replace(/ /g, "_") turns spaces into _'s as they are better for the xml element names
		while(z<root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0].childNodes.length){
			if(root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0].childNodes[z].childNodes[0].childNodes[0].nodeValue == data[3] && 
			root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0].childNodes[z].childNodes[2].childNodes[0].nodeValue == data[6] &&
			root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0].childNodes[z].childNodes[1].childNodes[0].nodeValue == data[5] ){
				teacher = xmldoc.createElement('Teacher');
				teacher.textContent = data[8].trim();
				root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0].childNodes[z].appendChild(teacher)
				make = false;
				break;
			}
			z++
		}
		if(make == true){
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
			//  .replace(/\*/g, '').trim()  is used to remove *'s and leading and trailing whitespace
			name.textContent = data[3].replace(/\*/g, '').trim();
			day.textContent = data[5].replace(/\*/g, '').trim();
			sTime.textContent = data[6].replace(/\*/g, '').trim();
			eTime.textContent = data[7].replace(/\*/g, '').trim();
			sDate.textContent = data[10].replace(/\*/g, '').trim();
			eDate.textContent = data[11].replace(/\*/g, '').trim();
			room.textContent = data[9].replace(/\*/g, '').trim();
			max.textContent = data[12].replace(/\*/g, '').trim();
			act.textContent = data[13].replace(/\*/g, '').trim();
			hrs.textContent = data[14].replace(/\*/g, '').trim();
			teacher.textContent = data[8].replace(/\*/g, '').trim();
			//append to root
			course.appendChild(name)
			course.appendChild(day)
			course.appendChild(sTime)
			course.appendChild(eTime)
			course.appendChild(sDate)
			course.appendChild(eDate)
			course.appendChild(room)
			course.appendChild(max)
			course.appendChild(act)
			course.appendChild(hrs)
			course.appendChild(teacher)
			root.getElementsByTagName(`set_${data[1].substring(5, 8).replace(/ /g, "_")}`)[0].appendChild(course);
		}
	}
}