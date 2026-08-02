

// The read the file with the file system   (fs)
// is work like the module of  (fs)

//code--->
 
const fs = require('fs');

fs.readFile('sample.txt','utf8',(err , data) => {
    if (err)throw err;
    console.log(data);
}
);
