

// import the major things 


const  express = require('express');   // for  the express 
const bcrypt  = require('bcryptjs');   // for the hash_password
const  jwt = require('jsonwebtoken');  // for the  json web token 
const { pool } = require('../config/db');  // for the fetch the database  form the file  config--
const { requireAuthentication, secret_key } = require('../middleware/auth'); // the authentication function and secret key--

// this important 
const router =  express.router();

//

router.post('/register', async (req,res) =>{
    const { username , passwordhash, full_name,email, bio } = req.body;
    if (!username || !password) {
        return res.status(400).json({err : ' username and password are required '});
    }
    try {
        const passwordhash = await bcrypt.hash(password, 10);
        const [result] =  await  pool.query(`
            INSERT INTO users (username , password_hash,  full_name ,email , bio) VALUES (?,?,?,?,?)` ,
        [username, passwordhash , full_name || null, email || null , bio || null]);
        res.status(201).json({message : 'user registered ',userid : result.inserted});
    } catch (err) {
        if (err.code ===  'ER_DUP_ENTRY') {
            return res.status(409).json({message : 'the username is already taken'});
        }
        res.status(402).json({ error : ' thee Registration failed  ', detail : err.message});
    }
});

// Login procedure  with the token sign in --->


router.post('/login', async (req ,res ) =>{
    const {username , password } = req.body;

    const [rows] = await pool.query(`SELECT * FROM users WHERE username = ?`, [username]);
    const user = rows[0];
    if (!user) return  res.status(401).json({ error :  'Invaid username or password '});

    const  ok = await bcrypt.compare(password,user.password_hash);
    if (!ok) return res.status(401).json({ err : ' invalid username or password  '});

    const token = jwt.sign( {userid : user.id, username : user.username, role: user.role },
        secret_key,{expiresIn: '2h'}
    );
    res.json({message :' login sucessfull ', token});
});

// this is fetch the profile from the server  perpare for the user --->

router.get('/profile', requireAuthentication , async (req, res) =>{
    const [rows] = await pool.query(
    `SELECT id , username, full_name, email , bio  role ceated_at `
    [req.user.userid]
    );
    if (!rows [0]) return res.status(404).json({ err : 'data not founded'});
    res.json(rows[0]);
});

//  ---to update the profile  

router.put('/profile', requireAuthentication, async (req, res) =>{
    const {full_name , email, bio} = req.body;
    try{
        await pool.query(`
            UPDATE users SET full_name = ?, email = ?, bio = ? WHERE    id =?`,
        [full_name,email,bio, req.user.userid]
    );
    resjson({message :'profile update '});
    } catch {
        if (err .code  === 'ER_DUP_ENTRY') return  res.status(409).json({err :' email already in use'});
        res.status(500).json({error : ' updated failed ', detail: err.message });
    }

});

module.exports =router;
