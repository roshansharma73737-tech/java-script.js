
/// this is create for the api end point in the web page ---> 
//  created the one by one  in the loop  like 1) first create the  route for the  user in the url function -->
/** first fo create the register  page 
 * and second login  with the JWT  authentication page is  */ 


// third one is for used file filter and update the profile avatar---> in the form  picture -->



//back to the program ->
// import the major this in   import the export file  function --->

const  express = require('express');
const  jwt =  require('jsonwebtoken');
const  bcrypt  = require('bcryptjs');
const {pool } =  require('../config/db');
const path = require('path');
const { authrequire , secret_key } = require('../middelware/Auth');
const upload = require('../middelware/upload');

 // create the t router for the server and the routes -->
  
const router  = express.Router();

//next all  operaation are perform on the router ---> let's begin 

// start with the register -->

router.post('/register',async (req , res ) =>{
    const { username ,password} = req.body;
    if (!username || !password) { 
        return res.status(400).json({error :'the username and password is not given'});
    } 
    try {
        const passwordhash = await bcrypt.hash(password , 10);
        const [result ] = await pool.query(
            'INSERT INTO users (username , password_hash) VALUES (?,?)',
            [username , passwordhash]
        );
        res.status(201).json({message : 'the paswaord is hashed successfull..! , user registered  sucess  ',userid :result.inserId});
    }catch (err) {
        if (err.code  ===   'ER_DUP_ENTRY') return  res.status(402).json({error : ' username is already taken '});
        res.status(403).json({message  : ' Registration failed --', detail : err.message});

    }
});

//  the first  registered one is completed -->
// the next is the  login endpoints --


router.post('/login ', async(req ,res) => {
    const {username , password } = req.body;
    const [rows] =  await pool.query('SELECT * FROM user  WHERE username = ? ',[usesrname]);

    const user = rows[0];
    if (!user) return res.status(401).json({erroe :'The username and pssword is invalid -->'});

    const ok = await bcrypt.compare(password ,user.password_hash);
    if (! ok) return res.status(402).json({error : ' invalid ussername and password '});

    const token = jwt.sign({userid :user.id ,username : user.username},secret_key , {expiresIn : '2h'});
    res.json({message : 'the usr login sucessufull ', token});

});

// the first and second phrases are completed  with the integrated endpoints -->
// let's start the the profile  update with the avatar -->


// in the web browser -->


router.put('/profile/avatar', authrequire,upload.single('avatar'),async(req,res)=>{
    if (!req.file) return res.status(400).josn({ error : ' no image file recevied(field name must be "avatar)'});

    //store only in the file not in thee bytes--->
    const requirefile =  `/uploads/${req.file.filename}`;

    await pool.query('UPDATE users SET avatar_path = ?',[requirefile,req.user.userid]);
    res.status(201).json({
        message : 'avatar apdated sucessfull',
        avatar_path : req.file.size,
        mimetype : req.file.mimetype,
    });
});


//       thee fetch the profile of the user from the server-->
router.get('/profile', authrequire ,async(req,res)=>{
    const  [rows] = await pool.query('SELECT id ,username , avatar_path,created_at FROM users WHERE  id=?',[req.user.userid]);
    if (!rows) return res.json(rows[0]);
});

module.exports = router;