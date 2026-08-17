
// create the   JWt with the middleware   role based authenticatin code between the amin and users-->

const express = require('express');
const jwt = require('jsonwebtoken');
const secret_key = process.env.jwt_secret || 'my-secret-key-is-for-demo';

const app = express();
app.use(express.json());

const users = [
    {userid: 1, usename:'roshan',password : 1234, role :'user'},
    {userid:2, usename:'admin',password:'adminpass', role:'admin'},

];
 

app.post('/login',(req,res) => {
    const user = users.find(u => u.username === username  &&  u.password === password);
    if (!user)  {
        return res.status(401).json({error : 'invalid password or username'});
    }

    const token =  jwt.sign(
        {userId :user.userid ,username : user.username, role :user.role},
        secret_key,
        {expiresIn: '2h'}
    );
    res.json({token})
});

// middleware of the   to check the token  for authentication --->

function authentication(req , res, next) {
    const authheader = req.headers['authorization'];
    const token = authheader &&  authheader.split(' ')[1];
    if (!token) {
        return res.status(401).json({error : ' NO token invalid or expire token '});
    }

    jwt.verify(token ,secret_key,(err,decoded) => {
        if (err)  return  res.status(403).json({error : 'invalid or expire token  provided'});

        req.user = decoded;
        next ();
    });

}


// new one added  role based authentication   between admin  or user--->

function authrole(...allowroles){
    return (req , res  ,next) => {
        if (!allowroles.includes(req.user.role)) {
            return res.status(403).json({ message : ` forbbiden requires roles [${allowroles.join(', ')}], you have '${req.user.role}'`, });
        }
        next();
    };
    
}
app.get('/dashboard',authentication,(req,res) => {
    res.json({message : `Dashboard  for  ${req.user.username} (role :${req.user.role})` });

});

//only admin routes handle-->

app.get('/admin/users', authentication ,authrole ('admin'),(req, res ) =>{
    res.json({message : ' admin  only data ', users: users.map(u  => ({id : u.userid, username : u.username })) });

});

const port = 3002;
app.listen(port, () =>
    console.log(` server running on the http://localhost:${port}`));