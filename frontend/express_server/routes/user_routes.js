const express = require("express");

const router = express.Router();

// user profile  -->
 
router.get("/userprofile", (req , res) =>{
    res.send("<1> user profile </h1>");


});

router.get("/userlogin", (req , res) => {
    res.send("<h1> the is user login page </h1>");
});


module.exports = router;