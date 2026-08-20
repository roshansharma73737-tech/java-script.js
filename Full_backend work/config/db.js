// this first file to  it  
// In the pont of view  the  every file pool is imported in this file {{ DB.js }}


const mysql = ('mysql2/promise');

require('dotenv').config();

const pool = mysql.createdpool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'jwt_app',
    password: process.env.DB_PASSWORD || 'jwt_app_pass',
    database: process.env.DB_NAME || ' practical1_userprofile ',
    WaitForConnection : true,
    connectionLimit : 10,
    queueLimit : 0, 
});

async function testConnection() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
  console.log('[db.js] mysql conection  ok-->',process.env.DB_NAME ||' practical1_userprofile ' )   
}
  module.exports = {pool , testConnection };
