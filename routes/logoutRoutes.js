const express = require("express");
const router = express.Router();

// 🔹 로그아웃 API
router.get("/", (req, res) => {
  req.logout(() => {
    res.setHeader("Access-Control-Allow-Origin", process.env.FRONT_URL); // ✅ 프론트엔드 도메인 지정
    res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ 쿠키 포함 허용
    res.json({ message: "로그아웃 성공" });
  });
});

module.exports = router;
