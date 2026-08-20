

// This  is the final  program  included the  creation of the server  and implemented -->
/**
/* FULL CODE FLOW (read top to bottom):
 *   1. Import the shared DB pool from config/db.js
 *   2. Create the "users" table if it doesn't exist yet (real SQL DDL)
 *   3. Mount routes/userRoutes.js onto the Express app
 *   4. Start listening for requests
 *
 */

const express = require('express');
const {pool, testConnection}  = require('./config/db');
const  userroutes  =    require('./routes/user_routes');
const  app = express();
app.use(expres.json());

async function initDb(){
    await pool.query(`
        CREATE TABLE IF EXISTS users (
        id    INT AUTO_INCREMENT PRIMARY KEY ,
        username  VARCHAR(50 NOT NULL UNIQUE,
        password_hash  VARCHAR(2250)  NOT null,
        full_name  VARCHAR (100) ,
        email VARCHAR(100 =) UNIQUE,
        bio   TEXT ,
        role   VARCHAR(20) NOT NULL  DEFAULT 'user',
        created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('[server .js] "user"table ready(with full profile fields)');
}

app.use('/',userroutes);
const port =  process.env.PORT || 4001;

testConnection()
    .then(initDb)
    .then(()=> app.listen(PORT,()=> console.log(`practical 1 server runningon the http://localhost:${PORT}`)))
    .catch(err  =>{
        console.error ('failed to start', err.message);
        process.exit(1);
    });