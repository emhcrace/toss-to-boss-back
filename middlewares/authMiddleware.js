const authMiddleware = (req, res, next) => {
    console.log("📌 세션 데이터:", req.session); // ✅ 세션 값 확인
  
    if (!req.session || !req.session.accessToken) {
      console.error("❌ 인증 실패 - accessToken 없음");
      return res.status(401).json({ error: "인증된 사용자만 제품을 등록할 수 있습니다." });
    }
  
    next(); // 인증 성공 시 다음 미들웨어 실행
  };
  
  module.exports = authMiddleware;
  