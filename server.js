/*
  Lightweight Express server to serve the chatbot widget and provide a demo
  bilingual /api/chat endpoint.
*/

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "100kb", type: "application/json" }));

// Serve static files from public/
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

// Demo bilingual chat endpoint
app.post("/api/chat", async (req, res) => {
  const { text = "", lang = "en" } = req.body || {};

  let en = "I don't have an answer for that yet.";
  let hi = "मेरे पास अभी इसके लिए उत्तर उपलब्ध नहीं है।";
  let suggestions = [
    { en: "How to join class?", hi: "क्लास में कैसे जुड़ें?" },
    { en: "How to download lectures?", hi: "लेक्चर कैसे डाउनलोड करें?" }
  ];

  try {
    if (/join class/i.test(text) || /क्लास.*जुड़/i.test(text)) {
      en = "To join a class: open schedule, click the class link, and enter your ID if prompted.";
      hi = "क्लास में जुड़ने के लिए: शेड्यूल खोलें, क्लास लिंक पर क्लिक करें, और पूछे जाने पर अपना आईडी दर्ज करें।";
    } else if (/download lectures?/i.test(text) || /लेक्चर.*डाउनलोड/i.test(text)) {
      en = "Go to Lectures, select a lecture, and click Download. Prefer audio-only for low bandwidth.";
      hi = "Lectures में जाएँ, लेक्चर चुनें और Download पर क्लिक करें। कम इंटरनेट गति में केवल ऑडियो चुनें।";
    }

    return res.json({
      reply: { en, hi },
      suggestions,
      meta: { source: "demo", confidence: 0.7 }
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

// Fallback to index.html for root
app.get(["/", "/index.html"], (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
