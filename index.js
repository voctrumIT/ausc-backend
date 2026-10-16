import express from "express";
import cors from "cors";
import contactus from "./routes/contactus.route.js";
import student from "./routes/student.route.js";
import account from "./routes/user.route.js";
import blogs from "./routes/blogs.route.js";
import admin from "./routes/admin.route.js";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';

dotenv.config();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

const app = express();
const PORT = process.env.PORT || 9002;

const allowedOrigins = [
  'http://localhost:3000',
  'https://ausc.edu.au',
  'https://www.ausc.edu.au',
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json({ limit: "20mb" }));
app.use(cookieParser());

// routes
app.use("/api/contactus", contactus);
app.use("/api/student", student);
app.use('/api/account', account);
app.use('/api/blogs', blogs);
app.use('/api/admin', admin);



// Debug and Health routes at the very top
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running", env: process.env.NODE_ENV });
});

// Start server only after DB connects
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
