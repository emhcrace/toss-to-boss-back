const passport = require("passport");
const KakaoStrategy = require("passport-kakao").Strategy;

module.exports = function configurePassport() {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/auth/kakao/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken; // ✅ 액세스 토큰 저장
        return done(null, profile);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};
