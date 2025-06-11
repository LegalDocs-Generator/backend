require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 6001;

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

const userAuthRoute = require("./routes/userAuthRoute");
const googleAuthRoute = require("./routes/userAuthRoute");
const userProfileRoute = require("./routes/userProfileRoute");
const formRoute = require('./routes/formRoute')

app.use("/api/auth", userAuthRoute, googleAuthRoute);
app.use("/api/user", userProfileRoute,formRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
