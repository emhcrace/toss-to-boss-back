const express = require("express");
const axios = require("axios");
const router = express.Router();

// 🔹 카카오 메시지 전송 API (세션에서 토큰 사용)
router.post("/send-message", async (req, res) => {
  if (!req.isAuthenticated() || !req.session.accessToken) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/send",
      {
        template_id: req.body.templateId, // ✅ 프론트에서 받은 템플릿 ID 사용
      },
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`, // ✅ 세션에 저장된 토큰 사용
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: "카카오 메시지 전송 실패", error: error.response.data });
  }
});

module.exports = router;
