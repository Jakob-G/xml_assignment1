var fs = require('fs');
var http = require('http');
var xmldom = require('xmldom');
const parse = require('csv-parse');
var root = '';
var root2 = '';
var userinput = process.argv[2].toUpperCase();
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const status = "Active"
//console.log(input)
var teachers = [];

http.createServer(function (req, res) {
	parser = new xmldom.DOMParser();
	xmldoc = parser.parseFromString(`<classes></classes>`, 'text/xml');
	xmldoc2 = parser.parseFromString(`<classes></classes>`, 'text/xml');
	root = xmldoc.documentElement;
	root2 = xmldoc2.documentElement;
	res.writeHead(200, { 'Content-Type': 'text/html' });
	result = '';
	student = root.childNodes;
	teacher = root2.childNodes;
	

	const input = fs.readFileSync('data/Subject_Course_Timetables.csv')
	const output = []
	parse(input, {
		trim: true,
		skip_empty_lines: true,
		from_line: 17
	})
		.on('readable', function () {
			let record
			//filters the data to remove inactive and weekend classes
			while (record = this.read()) {
				if (record[0] == status) {
					if (weekdays.indexOf(record[5]) > -1) {
						//creates the xml
						makeStudentXml(record, userinput)
						makeTeacherList(record, userinput)
					} else {
					}
				} else {
				}

			}
		})
		.on('end', function () {
			parse(input, {
				trim: true,
				skip_empty_lines: true,
				from_line: 17
		})
			.on('readable', function () {
				let record
				//filters the data to remove inactive and weekend classes
				while (record = this.read()) {
					if (record[0] == status) {
						if (weekdays.indexOf(record[5]) > -1) {
							//creates the xml
							makeTeacherXml(record, teachers)
						}
					}
				}
			})
			.on('end', function () {
				serializer = new xmldom.XMLSerializer();
				tosave2 = serializer.serializeToString(xmldoc2);
				tosave=`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE classes SYSTEM "classes.dtd"> ${tosave}`;
				fs.writeFileSync(`./data/201830-${userinput}-Teacher.xml`, tosave2);
				if(req.url == '/teachers'){
					result = showTeacher(teacher)
					//console.log(result)
					res.write(result);
					res.end();
				}
				
			})
			serializer = new xmldom.XMLSerializer();
			tosave = serializer.serializeToString(xmldoc);
			
			//adds the xml version and doctipe tags
			tosave=`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE classes SYSTEM "classes.dtd"> ${tosave}`;
			//tosave=`<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE classes SYSTEM "classes.dtd"> ${tosave}`;
			fs.writeFileSync(`./data/201830-${userinput}.xml`, tosave);
			
			if(req.url == '/'){
				result = showStudent(student)
				res.write(result);
				res.end();
			}
		
			//console.log(result)
			
		})


}).listen(8080); //the server object listens on port 8080 

function showStudent(data) {
	//console.log(data)
	for (i = 0; i < data.length; i++) {
		sub = data[i].childNodes
		//adds the headder
		result += `<h2>${data[i].nodeName} ${data[i].attributes[0].value}</h2><ul>`
		for (n = 0; n < sub.length; n++) {
			courses = sub[n].childNodes
			//adds a line in the list
			result += `<li>${sub[n].attributes[0].value}</li>`	}
		result += `</ul>`
	}
	return result
}

function showTeacher(data) {
	//console.log(root2.childNodes.length)
	for (i = 0; i < root2.childNodes.length; i++) {
		sub = root2.childNodes[i].childNodes
		//console.log(root2.childNodes[i].nodeName)
		//adds the headder
		result += `<h2>${root2.childNodes[i].attributes[0].value}</h2><ul>`
		for (n = 0; n < sub.length; n++) {
			courses = sub[n].childNodes
			//adds a line in the list
			result += `<li>${sub[n].attributes[0].value}</li>`
			}
		result += `</ul>`
	}
	return result
}


function makeStudentXml(data, course) {
	//chceck for existing course
	//if there is an existing course check for exiseting block(day, sTime, eTime)
	//if course == true && block == true ---> add teacher only
	//if course == true && block == false ---> add new block
	//if course == false --- > add new course

	//makes sure it is the right course / program (acit ect.)
	if (data[1].substring(0, 4) == course) {
		//checks if there is a existing set for the data if not it makes one
		pos=0
		make=true
		ckCourse = false
		ckBlock = false
		c=0
		b=0
		//check for existing set
		while(pos<root.getElementsByTagName('Set').length){
			if (root.getElementsByTagName(`Set`)[pos].attributes[0].value == data[1].substring(5, 8).replace(/ /g, "_")) {
				make=false
				break
			}
			pos++
		}
		z=0
		//add new set if needed
		if(make == true){
			newItem = xmldoc.createElement(`Set`);
			newItem.setAttribute('name',`${data[1].substring(5, 8).replace(/ /g, "_")}`)
			//console.log(newItem.attributes[0].value)
			root.appendChild(newItem)
		}
		else{
			for(x in root.getElementsByTagName(`Set`)[pos].childNodes){
				if (isNaN(parseInt(x)) == false){
					if(root.getElementsByTagName(`Set`)[pos].childNodes[x].attributes[0].value == data[3].replace(/\*/g, '').trim()){
						ckCourse = true
						c = x
					}
				}
			}
			if(ckCourse == true){
				for(y in root.getElementsByTagName(`Set`)[pos].childNodes[c].childNodes){
					if (isNaN(parseInt(y)) == false){
						if(root.getElementsByTagName(`Set`)[pos].childNodes[c].childNodes[y].childNodes[0].childNodes[0].data == data[5].replace(/\*/g, '').trim() ||
							root.getElementsByTagName(`Set`)[pos].childNodes[c].childNodes[y].childNodes[1].childNodes[0].data == data[6].replace(/\*/g, '').trim() ||
							root.getElementsByTagName(`Set`)[pos].childNodes[c].childNodes[y].childNodes[2].childNodes[0].data == data[7].replace(/\*/g, '').trim()){
								ckBlock = true
								b = y
						}
					}
				}
			}
		}
		if(ckBlock == true){
			teacher = xmldoc.createElement('Teacher');
			//add text to elements
			teacher.textContent = data[8].replace(/\*/g, '').trim();
			//append to root
			block.appendChild(teacher)
			root.getElementsByTagName(`Set`)[pos].childNodes[c].childNodes[b].appendChild(teacher);
		}
		if(ckCourse == true){
			//create elements
			block = xmldoc.createElement('Block')
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
			block.appendChild(day)
			block.appendChild(sTime)
			block.appendChild(eTime)
			block.appendChild(sDate)
			block.appendChild(eDate)
			block.appendChild(room)
			block.appendChild(max)
			block.appendChild(act)
			block.appendChild(hrs)
			block.appendChild(teacher)
			root.getElementsByTagName(`Set`)[pos].childNodes[c].appendChild(block);
		}
		if(ckCourse == false){
			//create elements
			block = xmldoc.createElement('Block')
			course = xmldoc.createElement('Course');
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
			course.setAttribute('name',data[3].replace(/\*/g, '').trim())
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
			block.appendChild(day)
			block.appendChild(sTime)
			block.appendChild(eTime)
			block.appendChild(sDate)
			block.appendChild(eDate)
			block.appendChild(room)
			block.appendChild(max)
			block.appendChild(act)
			block.appendChild(hrs)
			block.appendChild(teacher)
			course.appendChild(block)
			root.getElementsByTagName(`Set`)[pos].appendChild(course);
		}
	}
}

function makeTeacherList(data, course){
	if (data[1].substring(0, 4) == course && data[8].length > 2) {
		if(teachers.indexOf(data[8]) == -1){
			teachers.push(data[8])
			//console.log(data[8])
		}
	}
}
function makeTeacherXml(data, list) {
	//chceck for existing course
	//if there is an existing course check for exiseting block(day, sTime, eTime)
	//if course == true && block == true ---> add teacher only
	//if course == true && block == false ---> add new block
	//if course == false --- > add new course

	//makes sure it is the right course / program (acit ect.)
	if (list.indexOf(data[8]) > -1) {
		//checks if there is a existing set for the data if not it makes one
		pos=0
		make=true
		ckCourse = false
		ckBlock = false
		c=0
		b=0
		//check for existing set
		while(pos<root2.getElementsByTagName('Teacher').length){
			if (root2.getElementsByTagName(`Teacher`)[pos].attributes[0].value == data[8].replace(/\*|\,/g, '').trim().replace(/ /g, '_')) {
				make=false
				break
			}
			pos++
		}
		z=0
		//add new set if needed
		if(make == true){
			newItem = xmldoc.createElement(`Teacher`);
			newItem.setAttribute('name',`${data[8].replace(/\*|\,/g, '').trim().replace(/ /g, '_')}`)
			//console.log(newItem.attributes[0].value)
			root2.appendChild(newItem)
		}
		else{
			for(x in root2.getElementsByTagName(`Teacher`)[pos].childNodes){
				if (isNaN(parseInt(x)) == false){
					if(root2.getElementsByTagName(`Teacher`)[pos].childNodes[x].attributes[0].value == data[3].replace(/\*/g, '').trim()){
						ckCourse = true
						c = x
					}
				}
			}
		}
		if(ckCourse == true){
			//create elements
			block = xmldoc.createElement('Block')
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
			day.textContent = data[5].replace(/\*/g, '').trim();
			sTime.textContent = data[6].replace(/\*/g, '').trim();
			eTime.textContent = data[7].replace(/\*/g, '').trim();
			sDate.textContent = data[10].replace(/\*/g, '').trim();
			eDate.textContent = data[11].replace(/\*/g, '').trim();
			room.textContent = data[9].replace(/\*/g, '').trim();
			max.textContent = data[12].replace(/\*/g, '').trim();
			act.textContent = data[13].replace(/\*/g, '').trim();
			hrs.textContent = data[14].replace(/\*/g, '').trim();
			//append to root
			block.appendChild(day)
			block.appendChild(sTime)
			block.appendChild(eTime)
			block.appendChild(sDate)
			block.appendChild(eDate)
			block.appendChild(room)
			block.appendChild(max)
			block.appendChild(act)
			block.appendChild(hrs)
			root2.getElementsByTagName(`Teacher`)[pos].childNodes[c].appendChild(block);
		}
		if(ckCourse == false){
			//create elements
			block = xmldoc.createElement('Block')
			course = xmldoc.createElement('Course');
			day = xmldoc.createElement('Day');
			sTime = xmldoc.createElement('Start_Time');
			eTime = xmldoc.createElement('End_Time');
			sDate = xmldoc.createElement('Start_Date');
			eDate = xmldoc.createElement('End_Date');
			room = xmldoc.createElement('Room');
			max = xmldoc.createElement('Max');
			act = xmldoc.createElement('Act');
			hrs = xmldoc.createElement('Hrs');
			//add text to elements
			//  .replace(/\*/g, '').trim()  is used to remove *'s and leading and trailing whitespace
			course.setAttribute('name',data[3].replace(/\*/g, '').trim())
			day.textContent = data[5].replace(/\*/g, '').trim();
			sTime.textContent = data[6].replace(/\*/g, '').trim();
			eTime.textContent = data[7].replace(/\*/g, '').trim();
			sDate.textContent = data[10].replace(/\*/g, '').trim();
			eDate.textContent = data[11].replace(/\*/g, '').trim();
			room.textContent = data[9].replace(/\*/g, '').trim();
			max.textContent = data[12].replace(/\*/g, '').trim();
			act.textContent = data[13].replace(/\*/g, '').trim();
			hrs.textContent = data[14].replace(/\*/g, '').trim();
			//append to root
			block.appendChild(day)
			block.appendChild(sTime)
			block.appendChild(eTime)
			block.appendChild(sDate)
			block.appendChild(eDate)
			block.appendChild(room)
			block.appendChild(max)
			block.appendChild(act)
			block.appendChild(hrs)
			course.appendChild(block)
			root2.getElementsByTagName(`Teacher`)[pos].appendChild(course);
		}
	}
}