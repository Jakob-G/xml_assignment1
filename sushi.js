var fs = require('fs');
var http = require('http');
var xmldom = require('xmldom');
const parse = require('csv-parse');
var root = '';

http.createServer(function (req, res) {
	data = fs.readFileSync('data/newOrder.xml')
	parser = new xmldom.DOMParser();
	xmldoc = parser.parseFromString(data.toString(), 'text/xml');
	root = xmldoc.documentElement;
	res.writeHead(200, {'Content-Type': 'text/html'});
	heading = '<h1>'+root.getElementsByTagName('restaurant')+'</h1>';
	res.write(heading);
	heading = '<h1> By: '+root.getElementsByTagName('author')+'</h1>';
	res.write(heading);
	result = '';
	x = root.childNodes;

	const input = fs.readFileSync('data/Kids_menu.csv')
	const output = []
	parse(input, {
		trim: true,
		skip_empty_lines: true,
		from_line: 1
	})
	.on('readable', function(){
		let record
	  	while (record = this.read()) {
	   		//output.push(record)
	    	addBurger(record)
	  	}
	})
	.on('end', function(){
	  	serializer = new xmldom.XMLSerializer();
	    tosave = serializer.serializeToString(xmldoc);

	    fs.writeFileSync('./data/sushi.xml',tosave);
	    for (i = 0; i < x.length; i++) {
			result = ''
			if (x[i].nodeName == 'nigiri') {
				head = '<h2>Nigiri</h2>' +
					'<b>'+x[i].getElementsByTagName('description')[0]+'</b>'
				res.write(head);
				for(n=0; n<x[i].getElementsByTagName('item').length; n++){
			    	result += showSushi(x[i].getElementsByTagName('item')[n]);
			    }
			    res.write('<ul>'+result+'</ul>');
		   	}
		   	if (x[i].nodeName == 'maki') {
		   		head = '<h2>Maki</h2>' +
		   			'<b>'+x[i].getElementsByTagName('description')[0]+'</b>'
		   		res.write(head);
				for(n=0; n<x[i].getElementsByTagName('item').length; n++){
			    	result += showSushi(x[i].getElementsByTagName('item')[n]);
			    }
			    res.write('<ul>'+result+'</ul>');
		   	}
		   	if (x[i].nodeName == 'kids') {
		   		head = '<h2>Kids</h2>' +
		   			'<b>Kids food</b>'
		   		res.write(head);
				for(n=0; n<x[i].getElementsByTagName('item').length; n++){
			    	result += showSushi(x[i].getElementsByTagName('item')[n]);
			    }
			    res.write('<ul>'+result+'</ul>');
		   	}
		}

		
	    res.end(); //end the response
	})


}).listen(8080); //the server object listens on port 8080 

function showSushi(Sushi) {
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

//name price dicription

function addBurger(data) {
	if(root.getElementsByTagName('kids')[0] == undefined){
   		console.log('hi')
   		newItem = xmldoc.createElement('kids');
    	root.appendChild(newItem)
	}
	else{
		console.log(root.getElementsByTagName('kids').length)
		item = xmldoc.createElement('item');
	    food = xmldoc.createElement('name');
	    food.textContent = data[1];
	    item.appendChild(food)
	    price = xmldoc.createElement('price');
	    price.textContent = data[4];
	    item.appendChild(price)
	    name = xmldoc.createElement('description');
	    name.textContent = data[2];
	    item.appendChild(name)
	    if(data[3] == "y"){
	    	veg = xmldoc.createElement('vegetarian');
	    	veg.textContent = 'yes';
	    	item.appendChild(veg)
	    }
	    root.getElementsByTagName('kids')[0].appendChild(item);  
   	} 
}