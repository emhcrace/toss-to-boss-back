require('dotenv').config();
const mysql = require('mysql2');

// ✅ MySQL2 Connection Pool 설정
const pool = mysql.createPool({
  connectionLimit: 10, // 최대 연결 수
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectTimeout: 10000,  // 연결 타임아웃 설정 (10초)
  waitForConnections: true
}).promise(); // ✅ promise 기반으로 변경 (async/await 사용 가능)

async function testDB() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MariaDB 연결 성공!');
    connection.release();
  } catch (err) {
    console.error('❌ MariaDB 연결 실패:', err.message);
  }
}

// ✅ 서버 시작 시 DB 연결 확인
testDB();

module.exports = pool;
