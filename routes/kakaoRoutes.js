const express = require("express");
const axios = require("axios");
const qs = require("qs"); // ✅ x-www-form-urlencoded 변환용 라이브러리
const router = express.Router();

// 🔹 카카오 메시지 전송 API (세션에서 토큰 사용)
router.post("/send-message", async (req, res) => {
  if (!req.session || !req.session.accessToken) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  // ✅ 프론트엔드에서 templateId가 전달되지 않았을 경우 예외 처리
  if (!req.body.templateId) {
    return res.status(400).json({ message: "템플릿 ID가 필요합니다." });
  }

  try {
    const requestBody = qs.stringify({ template_id: req.body.templateId });

    const response = await axios.post(
      "https://kapi.kakao.com/v2/api/talk/memo/send",
      requestBody, // ✅ 데이터 변환 적용
      {
        headers: {
          Authorization: `Bearer ${req.session.accessToken}`, // ✅ 세션에 저장된 토큰 사용
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ 카카오 메시지 전송 성공:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ 카카오 메시지 전송 실패:", error.response?.data || error.message);
    res.status(500).json({ message: "카카오 메시지 전송 실패", error: error.response?.data || error.message });
  }
});

module.exports = router;
