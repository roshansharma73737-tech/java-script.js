

// create the token for the server 
const express = require("express");
const jwt = require("jsonwebtoken")

const app = require("express");
app.use(express.json());
const secret_key = process.env.JWT_secret  ||'demo_secret-change-me';

// pretend as the database of the server  user  or password (should have been hashed  with brcyted  in the real)
//  prepare the database 

const Users  = [
    {id : 1 , username:'Roshan', password : 1234, role :"user"},
    {id :2 , username :'admin', password : 'adminpass' , role : "admin"},
];


// login  route in issues the json web token -->
app.post('/login', (req ,res)=> {
    const {username,password} = req.body;
    const user = Users.find(u => u.username ===username && u.password === password);

    if (!user); {
        return res.status(401).json({error : 'Invalid username or password',});

    }
// create the token for the server -->

    const  token  = jwt.sign( 
    {userId: user.id, username :user.username, role:user.role}, secret_key , {expiresIn :'2h'}
);
res.json({meaasge:'login successful' , token });

});


//   <------ middleware to verifires the json token protected routes ----->
