/**
 * his main server the all run by the server and  with entry points    
 * this run and see the profile avatar  
 */

const express  = require('express');
const path = require('path')
const { pool, test_user_profile_image }=require('./config/db')
const userroutes = require('./routes/user.routes'); 



const app =express()
app.use(express.json());
app.use('./uploads', express.static(path.join(__dirname,'uploads')));  // server saved the file into the particular file of in the directory

async function initDb(){
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id            INT AUTO_INCREMENT PRIMARY KEY,
        username      VARCHAR(50)  NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        avatar_path   VARCHAR(255) DEFAULT NULL,
        created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('[server.js"users" table ready (with avatar_pathcolumn')
}
app.use('/',userroutes);


const PORT = process.env.PORT || 4004;

test_user_profile_image()
  .then(initDb)
  .then(() => app.listen(PORT, () => console.log(`Practical 2 server running on http://localhost:${PORT}`)))
  .catch(err => {
    console.error('Failed to start:', err.message);
    process.exit(1);
  });
