

// this is the second step of the program to create the  authentication of the person in the website -->
//  the second step  is work on the jsonwebtoken   find the user and create thew entry token  of form the server   and entry in the web page  -->
//  the user data is save on the sql form structured  format username , password , email   data and time of the entry time saved us -->

//   In this  one feature is  hash_password means  user sends the password  and system is changed into the hash password  for thee security--->

const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret_key  =  process.env.JWT_SECRET_KEY ||' demo-secret-change-me ';

function  requireAuthentication (req , res ,next) {
    const requireheader  = req.headers['authorization'];
    const token = requireheader && requireheader.split(' ')[1];   // for the bearer token from the server -->

    if (!token) {
        return res.status(401).json({message : ' no token provided '});
    }
    
    jwt.verify(token ,secret_key,(err ,decoded) => {
        if (err)  return res.status(401).json({error : 'Token expire  or invalid '});
        req.user = decoded; // fetch the userid , password, role
        next();

    });

}

module.exports = { requireAuthentication , secret_key };