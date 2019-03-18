# xml_assignment 2
##How to Use
run npm install to get the needed packages
run node index.js with your progam of choice ex acit or cvil
go to localhost:8080 for the students
  and localhost:8080/teachers  fot the teachers
##how it works
###reading the csv
1. reads through the csv creates the student xml and the list of teachers 
2. reads through again and makes the teacher xml with the teacher list
###making the xml's
```
check for existing teacher/set
if(above is false){
    make new teacher/set
    add new course
    add new block
}
else{
    check for existing course
    if(above is true){
        //student only
        check for existing block
        if(above is true){
            add teacher to block
            break
        }
        //end student only
        add new block to course
    } 
    add new course
    add block to course
}
```