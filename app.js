// Core Module
const path = require("path");

// External Module
const express = require("express");
const session = require("express-session");
const multer = require("multer");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();
const MongoDBStore = require("connect-mongodb-session")(session);
const DB_PATH = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { default: mongoose } = require("mongoose");

const app = express();

// Security Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(mongoSanitize());

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://airbnb-frontend-eight.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const store = new MongoDBStore({
  uri: DB_PATH,
  collection: "sessions",
});

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(multer({ storage: multerStorage, fileFilter }).single("photo"));
app.use(express.static(path.join(process.cwd(), "public")));
app.use("/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store,
  }),
);

// Auth middleware handled by JWT in routes via isAuth util

app.use(authRouter);
app.use(storeRouter);

app.use("/host", hostRouter);

app.use(errorsController.pageNotFound);

mongoose
  .connect(DB_PATH)
  .then(() => {
    console.log("Connected to Mongo");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to Mongo: ", err);
  });
