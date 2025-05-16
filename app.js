import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

// Load environment variables from config.env
config({ path: "./config.env" });

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Correct CORS configuration
const allowedOrigins = [
"https://gym-contact-frontend.vercel.app",
"http://localhost:3000",
];

app.use(
cors({
origin: function (origin, callback) {
if (!origin || allowedOrigins.includes(origin)) {
callback(null, true);
} else {
callback(new Error("Not allowed by CORS"));
}
},
methods: ["GET", "POST", "OPTIONS"],
credentials: true,
})
);

// ✅ Handle preflight requests
app.options("*", cors());

// 🔍 Test route
app.get("/", (req, res) => {
res.send("API is running ✅");
});

// 📬 Route to handle contact form submission
app.post("/send/mail", async (req, res) => {
const { name, email, message } = req.body || {};

console.log("Incoming Request Body:", req.body);

if (!name || !email || !message) {
return res.status(400).json({
success: false,
message: "Please provide all details",
});
}

try {
await sendEmail({
email: "jayasrirepro@gmail.com",
subject: "GYM WEBSITE CONTACT",
message,
userEmail: email,
});

res.status(200).json({
  success: true,
  message: "Message Sent Successfully.",
});
} catch (error) {
console.error("Email sending failed:", error);
res.status(500).json({
success: false,
message: "Internal Server Error.",
});
}
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
console.log(`Server listening at port ${PORT}`);
});