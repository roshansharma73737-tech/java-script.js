const express = require("express");

const app = express();

// import the homepage and the user about about page --->

const  homeroutes = require("./routes/home_routes");
const userrouteres = require("./routes/user_routes");


//  Use Routes---->
app.use ("/" , homeroutes);
app.use("/user" , userrouteres);
 
// start  the server--->
app.listen(  3000,() => {
    console.log("The Html page server is started -->");  
});