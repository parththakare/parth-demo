const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
const MONGO_URI = "mongodb+srv://parth_2005:asWQ0qFVFG9QMpsM@cluster0.a2h0inr.mongodb.net/kishkam_lab";

mongoose
  .connect(MONGO_URI) // ⬅️ Removed useNewUrlParser & useUnifiedTopology
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Schema & Model
const SubmissionSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  time: String,
});

const Submission = mongoose.model("Submission", SubmissionSchema);

// ✅ POST route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, msg: "All fields required" });

    const newSubmission = new Submission({
      name,
      email,
      message,
      time: new Date().toLocaleString(),
    });

    await newSubmission.save();
    res.status(200).json({ success: true, msg: "Saved to MongoDB Atlas" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

// ✅ Get route
app.get("/api/submissions", async (req, res) => {
  const submissions = await Submission.find();
  res.json(submissions);
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
