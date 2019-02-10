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

	    fs.writeFileSync(`./data/${userinput}.xml`,tosave);
	    // for(i = 0; i < x.length; i++) {
		//    	if (x[i].nodeName == 'kids') {
		//    		head = '<h2>Kids</h2>' +
		//    			'<b>Kids food</b>'
		//    		res.write(head);
		// 		// for(n=0; n<x[i].getElementsByTagName('item').length; n++){
		// 	    // 	result += showSushi(x[i].getElementsByTagName('item')[n]);
		// 	    // }
		// 	    res.write('<ul>'+result+'</ul>');
		//    	}
		// }

		
	    res.end(); //end the response
	})


}).listen(8080); //the server object listens on port 8080 

function show(Sushi) {
    name = '';
    price = '';
	disc = 'N/A';
	spy = 'no'
	vgt = 'no'
	choices = Sushi.childNodes;
	for (cc = 0; cc < choices.length; cc++) {
	    switch (choices[cc].nodeName) {
	    	case('name'):
	            name = choices[cc];
	            continue;
	        case('price'):
	            price = choices[cc];
	            continue;
	        case('description'):
	            disc = choices[cc];
	            continue;
	        case('vegetarian'):
	        	vgt = 'yes';
	        	continue;
	        case('spicy'):
	        	spy = 'yes';
	        	continue;
	    }
	}
	result = '<li>Name: ' + name + '</br>';
	if(spy == 'yes'){
		result += '<img src="https://cdn0.iconfinder.com/data/icons/food-2-11/128/food-29-512.png" height="30" width="30"></br>';
	}
	if(vgt == 'yes'){
		result += '<img src="https://cdn1.iconfinder.com/data/icons/alternate-foods/512/alternate_foods-33-512.png" height="30" width="30"></br>';
	}
	result += 'Price: ' + price + '</br>' +
	        'Dicription: ' + disc +'</br></br></li>';
    return result;
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