const express = require("express");
const passport = require("passport");
const router = express.Router();

// 🔹 카카오 로그인 요청
router.get("/kakao", passport.authenticate("kakao", { scope: ["profile_nickname", "account_email"] }));

// 🔹 카카오 로그인 콜백
router.get(
  "/kakao/callback",
  passport.authenticate("kakao", { failureRedirect: "/login", session: true }),
  (req, res) => {
    req.session.accessToken = req.user.accessToken; // ✅ 세션에 토큰 저장
    res.redirect(process.env.FRONT_URL); // ✅ 프론트엔드로 리디렉트
  }
);

module.exports = router;
