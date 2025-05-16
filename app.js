// Import required modules
import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js"; // ✅ Include .js extension for ESM

// Initialize Express app
const app = express();

// Load environment variables from config.env
config({ path: "./config.env" });

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:3000" || "https://gym-contact-frontend.vercel.app/"],
    methods: ["POST"],
    credentials: true,
  })
);

// 🔍 Test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// 📬 Route to handle contact form submission
app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body || {};

  // Debug log to inspect incoming data
  console.log("Incoming Request Body:", req.body);

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all details",
    });
  }

  try {
    // Send the email
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
