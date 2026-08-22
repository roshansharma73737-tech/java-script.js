

// import the express and jsonwebtoken  


const  jwt = require('jsonwebtoken');
require('dotenv').config();

const secret_key  =  process.env.JWT_SECRET_KEY || 'ROSHAN_S_SECRET_KEY'
function authrequire(req ,res ,next) {
    const authheaders = req.headers['Authorization'];
    const token = authheaders && authheaders.split(' ')[1];
    if (!token) return res.status(401).json({err : ' the token is not provided'});

    jwt.verify(token ,secret_key,(err,decoded) => {
        if(err) return  res.status(401).json({message : 'the token invalid or expire '});
        req.user = decoded;
        next();
       });

}
module.exports ={ authrequire , secret_key}