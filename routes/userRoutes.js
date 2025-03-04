const express = require("express");
const router = express.Router();

// 🔹 로그인된 사용자 정보 반환
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: req.user,
      accessToken: req.session.accessToken, // ✅ 세션에 저장된 토큰 반환
    });
  } else {
    res.status(401).json({ message: "로그인되지 않음" });
  }
});

module.exports = router;


