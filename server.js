require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectDB = require("./config/mongoDBConnection/db");
connectDB();

const userAuthRoute = require('./routes/userRoute/userAuthRoute');
const userProfileRoute = require('./routes/userRoute/userProfileRoute');
const formRoute  = require('./routes/formRoute/formRoute');
const generateFormRoute = require('./routes/generateRoute/generateFormRoute')
const googleAuthRoute = require('./routes/userRoute/googleAuthRoute');

const checkForAuthenticationCookie = require("./authMiddleware/authMiddleware");

app.use("/api/auth", userAuthRoute, googleAuthRoute);
app.use(
  "/api/user",
  checkForAuthenticationCookie("token"),
  userProfileRoute,
  formRoute,
  generateFormRoute
);

app.get("/test-puppeteer", async (req, res) => {
  try {
    const puppeteer = require("puppeteer");

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto("https://example.com");
    await browser.close();

    res.send("✅ Puppeteer is working!");
  } catch (err) {
    res.status(500).json({
      message: "❌ Puppeteer failed",
      error: err.message,
      stack: err.stack,
    });
  }
});

app.get("/debug-chrome", async (req, res) => {
  const puppeteer = require("puppeteer");
  res.send({
    executablePath: puppeteer.executablePath?.(),
    browserVersion: puppeteer.browserRevision,
  });
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
