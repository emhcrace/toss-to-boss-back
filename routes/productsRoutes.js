const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../config/db'); // DB 연결 파일 import

// 파일 업로드 설정 (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 저장 경로
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}${ext}`;
    cb(null, uniqueName);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('JPG, PNG, GIF만 업로드 가능합니다.'));
    }
    cb(null, true);
  },
});

// 📌 [POST] 제품 추가 API
router.post('/', upload.single('image_url'), async (req, res) => {
  try {
    const { name, category } = req.body; // 필수 필드
    const image_url = req.file ? `/uploads/${req.file.filename}` : ''; // 이미지 경로
    const status = 'In Stock'; // 기본값
    const company = 'Default Company'; // 기본값
    const branch = '하남위례'; // 기본값

    // 입력값 검증
    if (!name || !category) {
      return res.status(400).json({ error: '상품명과 카테고리는 필수입니다.' });
    }

    const sql = `
      INSERT INTO product_list (name, status, company, branch, image_url, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [name, status, company, branch, image_url, category]);

    res.json({
      success: true,
      insertedId: result.insertId,
      data: { name, status, company, branch, image_url, category },
    });
  } catch (err) {
    console.error('❌ 제품 삽입 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;