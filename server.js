const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: envFile });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const configurePassport = require("./config/passportConfig"); // ✅ 패스포트 설정 파일 불러오기
const path = require("path");
const productsRouter = require('./routes/productsRoutes');

console.log(`Loaded env file: ${envFile}`);
console.log(`Current ENV: ${process.env.NODE_ENV}`);

// ✅ passport 설정 적용
configurePassport();

// Express 서버 생성
const app = express();
const PORT = process.env.SERVER_PORT;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // 정적 파일 서빙

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
    saveUninitialized: false, // ✅ 로그인한 사용자만 세션 저장
    cookie: { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production' ? true : false, // ✅ 개발 환경에서는 false
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' // ✅ 크로스 도메인 지원
    },
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
const itemsRouter = require('./routes/itemsRoutes');


// ✅ API 라우트 적용
app.use("/auth", authRoutes);
app.use("/kakao", kakaoRoutes);
app.use("/user", userRoutes);
app.use("/logout", logoutRoutes);
app.use('/items', itemsRouter); // 라우트 적용
app.use('/products', productsRouter);


// 서버 실행
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: ${process.env.BACKEND_URL}`);
});

