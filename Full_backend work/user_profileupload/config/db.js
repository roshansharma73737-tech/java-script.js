

// import the major requirments -->

const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host : process.env.DB_HOST || 'localhost',
    user : process.env.DB_USER || 'jwt_app',
    password : process.env.DB_PASSWORD || 'jwt_app_pass',
    database : process.env.DB_NAME || 'user_profile_practical',
    waitForConnections :true,
    connectionLimit : 10,
    queueLimit : 0,
});

async function test_user_profile_image(){
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('[db.js] MySQL connection OK ->', process.env.DB_NAME || 'user_profile_practical');
}



module.exports = { pool , test_user_profile_image };