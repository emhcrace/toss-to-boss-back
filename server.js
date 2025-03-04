const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const configurePassport = require("./config/passportConfig"); // ✅ 패스포트 설정 파일 불러오기
const path = require("path");
const db = require('./config/db'); // DB 연결 파일

console.log(`Loaded env file: ${envFile}`);
console.log(`Current ENV: ${process.env.NODE_ENV}`);

// ✅ passport 설정 적용
configurePassport();

// Express 서버 생성
const app = express();
const PORT = process.env.SERVER_PORT;

// CORS 설정
app.use(
  cors({
    origin: process.env.FRONT_URL, // ✅ 프론트엔드 도메인 지정
    credentials: true, // ✅ 쿠키 & 세션 허용
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.KAKAO_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true, secure: false }, // ✅ HTTPS 환경에서는 secure: true 설정
  })
);

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, './public')));

// 기본 경로('/')로 접속 시 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'));
});

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session());

// ✅ API 라우트 불러오기
const authRoutes = require("./routes/authRoutes");
const kakaoRoutes = require("./routes/kakaoRoutes");
const userRoutes = require("./routes/userRoutes");
const logoutRoutes = require("./routes/logoutRoutes");


// ✅ API 라우트 적용
app.use("/auth", authRoutes);
app.use("/kakao", kakaoRoutes);
app.use("/user", userRoutes);
app.use("/logout", logoutRoutes);

// // 📌 [GET] 모든 아이템 조회 API (async/await 사용)
app.get('/api/items', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM atoItems');
    res.json(rows);
  } catch (err) {
    console.error('❌ 데이터 조회 실패:', err.message);
    res.status(500).json({ error: '서버 오류' });
  }
});



// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: ${process.env.BACKEND_URL}`);
});


// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const db = require('./config/db'); // DB 연결 파일

// const session = require("express-session");
// const passport = require("passport");
// const KakaoStrategy = require("passport-kakao").Strategy;


// const app = express();
// const PORT = process.env.SERVER_PORT || 8001;

// // ✅ 미들웨어 설정
// app.use(cors({ origin: process.env.FRONT_URL, // ✅ 특정 도메인만 허용
//    credentials: true ,// ✅ 쿠키 및 인증 정보 포함 허용
//   }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // ✅ 기본 라우트
// app.get('/', (req, res) => {
//   res.send('✅ Atoketo Backend is Running!');
// });

// // 📌 [GET] 모든 아이템 조회 API (async/await 사용)
// app.get('/api/items', async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM atoItems');
//     res.json(rows);
//   } catch (err) {
//     console.error('❌ 데이터 조회 실패:', err.message);
//     res.status(500).json({ error: '서버 오류' });
//   }
// });

// // 📌 [POST] 아이템 추가 API
// app.post('/api/items', async (req, res) => {
//   try {
//     const { name, price, description, biz, nickname, date } = req.body;
//     const sql = 'INSERT INTO atoItems (name, price, description, biz, nickname, date) VALUES (?, ?, ?, ?, ?, ?)';
//     const [result] = await db.query(sql, [name, price, description, biz, nickname, date]);

//     res.json({ success: true, insertedId: result.insertId });
//   } catch (err) {
//     console.error('❌ 데이터 삽입 실패:', err.message);
//     res.status(500).json({ error: '서버 오류' });
//   }
// });


// app.use(express.json());
// app.use(
//   session({
//     secret: process.env.KAKAO_CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//       httpOnly: true,
//       secure: false, // ⚠️ HTTPS가 아닌 경우 false (배포 시 true 설정 필요)
//     },
//   })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// passport.use(
//   new KakaoStrategy(
//     {
//       clientID: process.env.KAKAO_CLIENT_ID,
//       clientSecret: process.env.KAKAO_CLIENT_SECRET, // REST API 키 필요
//       callbackURL: `${process.env.BACKEND_URL}/auth/kakao/callback`,
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       // console.log("카카오 프로필:", profile);
//       return done(null, profile);
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// app.get(
//   "/auth/kakao",
//   passport.authenticate("kakao", { scope: ["profile_nickname", "account_email"] })
// );

// app.get(
//   "/auth/kakao/callback",
//   passport.authenticate("kakao", {
//     failureRedirect: "/login",
//     session: true,
//   }),
//   (req, res) => {
//     res.redirect(process.env.FRONT_URL); // 프론트엔드로 리디렉트
//   }
// );

// app.get("/auth/logout", (req, res) => {
//   req.logout(() => {
//     res.redirect(process.env.FRONT_URL);
//   });
// });

// app.get("/auth/user", (req, res) => {
//   res.send(req.user ? req.user : null);
// });


// // ✅ 서버 실행
// app.listen(PORT, () => {
//   console.log(`✅ Server started on PORT ${PORT}`);
// });
