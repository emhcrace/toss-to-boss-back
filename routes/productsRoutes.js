const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const db = require('../config/db'); // DB 연결 파일 import
const authMiddleware = require('../middlewares/authMiddleware'); // 인증 미들웨어 추가

// 파일 업로드 설정 (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/'); // 저장 경로
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

// 📌 [POST] 제품 추가 API (✅ 카카오 인증 필수)
router.post('/', authMiddleware, upload.single('image_url'), async (req, res) => {
  try {
    console.log("📌 요청 데이터:", req.body);
    console.log("📌 업로드된 파일:", req.file);

    const { name, category, price, unit, supplier } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : '/uploads/default.png';
    const status = 'In Stock';
    const company = 'Default Company';
    const branch = '하남위례';

    // 입력값 검증
    if (!name || !category || !price || !unit || !supplier) {
      console.error("❌ 필수 필드 누락:", { name, category, price, unit, supplier });
      return res.status(400).json({ error: '상품명, 카테고리, 가격, 단위, 발주처는 필수입니다.' });
    }

    // 가격이 숫자인지 확인
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      console.error("❌ 유효하지 않은 가격:", price);
      return res.status(400).json({ error: '유효한 가격을 입력하세요.' });
    }

    const sql = `
      INSERT INTO product_list (name, status, company, branch, image_url, category, price, unit, supplier)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await db.query(sql, [
      name, status, company, branch, image_url, category, parsedPrice, unit, supplier
    ]);

    console.log("✅ 제품 등록 성공:", result);
    res.json({
      success: true,
      insertedId: result.insertId,
      data: { name, status, company, branch, image_url, category, price: parsedPrice, unit, supplier },
    });
  } catch (err) {
    console.error("❌ 제품 삽입 실패:", err);
    res.status(500).json({ error: '서버 오류', details: err.message });
  }
});


module.exports = router;
