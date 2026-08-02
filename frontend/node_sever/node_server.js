
// creatin the server by the  node.js  

const http = require("http")

const server = http.createServer(( req , res) => {
    res.write("hello this made by  the node.js");
    res.end();

});

server.listen(3000, () =>{
    console.log("server running on the browser  port 3000--!")
});