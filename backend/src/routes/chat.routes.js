import express from "express";

const router = express.Router();

// POST /api/chat
// Expected request body: { text: string, lang?: 'en' | 'hi' }
// Response schema:
// {
//   reply: { en: string, hi: string },
//   suggestions?: Array<{ en: string, hi: string }>,
//   meta?: { source?: string, confidence?: number }
// }
router.post("/chat", async (req, res) => {
  try {
    const { text = "", lang = "en" } = req.body || {};

    let en = "I don't have an answer for that yet.";
    let hi = "मेरे पास अभी इसके लिए उत्तर उपलब्ध नहीं है।";
    const suggestions = [
      { en: "How to join class?", hi: "क्लास में कैसे जुड़ें?" },
      { en: "How to download lectures?", hi: "लेक्चर कैसे डाउनलोड करें?" },
    ];

    if (/join class/i.test(text) || /क्लास.*जुड़/i.test(text)) {
      en = "To join a class: open schedule, click the class link, and enter your ID if prompted.";
      hi = "क्लास में जुड़ने के लिए: शेड्यूल खोलें, क्लास लिंक पर क्लिक करें, और पूछे जाने पर अपना आईडी दर्ज करें।";
    } else if (/download lectures?/i.test(text) || /लेक्चर.*डाउनलोड/i.test(text)) {
      en = "Go to Lectures, select a lecture, and click Download. Prefer audio-only for low bandwidth.";
      hi = "Lectures में जाएँ, लेक्चर चुनें और Download पर क्लिक करें। कम इंटरनेट गति में केवल ऑडियो चुनें।";
    }

    res.json({ reply: { en, hi }, suggestions, meta: { source: "kb", confidence: 0.8 } });
  } catch (err) {
    console.error("/api/chat error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
