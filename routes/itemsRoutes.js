const express = require('express');
const router = express.Router();
const db = require('../config/db'); // DB 연결 파일을 import

// 📌 [GET] 모든 아이템 조회 API
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM atoItems');
    res.json(rows);
  } catch (err) {
    console.error('❌ 데이터 조회 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

// 📌 [POST] 아이템 추가 API
router.post('/', async (req, res) => {
  try {
    const { name, price, description, biz, nickname, date } = req.body;
    const sql = 'INSERT INTO atoItems (name, price, description, biz, nickname, date) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, price, description, biz, nickname, date]);

    res.json({ success: true, insertedId: result.insertId });
  } catch (err) {
    console.error('❌ 데이터 삽입 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
