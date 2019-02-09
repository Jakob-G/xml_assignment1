const parse = require('csv-parse');
var fs = require('fs');

const input = fs.readFileSync('data/Kids_menu.csv')
	
const output = []
parse(input, {
  trim: true,
  skip_empty_lines: true
})
.on('readable', function(){
  let record
  while (record = this.read()) {
    output.push(record)
    console.log(record)
  }
})
.on('end', function(){
  //console.log(output)
})

