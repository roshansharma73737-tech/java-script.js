const express = require("express");

const router = express.Router();
router.get( "/", (req , res ) => {
    res.send("<h1> this is home page </h1>");
}) ;


router.get("/about",(req , res )=>{
    res.send("<h1> About by the page </h1>");
});

module.exports = router;