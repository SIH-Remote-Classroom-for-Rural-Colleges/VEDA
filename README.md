# VEDA Chatbot Widget (Bilingual: English/Hindi)

Lightweight, low-bandwidth React chatbot sidebar with bilingual UI and responses, plus a minimal Express backend. No bundler required; runs via CDN React + Babel for convenience.

## Features

- Bilingual UI (English/Hindi) with instant toggling.
- Predefined answers for common questions (works offline/without backend).
- REST API integration for dynamic bilingual responses: `POST /api/chat`.
- Collapsible sidebar, mobile-friendly, and UTF-8-compatible for Devanagari.
- Minimal dependencies for low bandwidth and quick startup.

## Project Structure

- `server.js` — Express server that serves static files and provides `/api/chat`.
- `package.json` — Node manifest with start script.
- `public/index.html` — Root page loading React via CDN and the widget.
- `public/ChatbotSidebar.jsx` — Chatbot sidebar React component.
- `public/ChatbotSidebar.css` — Styles for the chatbot.

## Prerequisites

- Node.js 16+ recommended.

## Install and Run

```bash
npm install
npm start
```

The server will start at:

```
http://localhost:8080
```

Open the URL in your browser, click the chat bubble at the bottom-right to open the chatbot, and try queries like:

- "How to join class?"
- "How to download lectures?"
- "क्लास में कैसे जुड़ें?"
- "लेक्चर कैसे डाउनलोड करें?"

## API Contract

Endpoint: `POST /api/chat`

Request:

```json
{
  "text": "How to join class?",
  "lang": "en"
}
```

Response:

```json
{
  "reply": {
    "en": "To join a class: open schedule, click the class link, and enter your ID if prompted.",
    "hi": "क्लास में जुड़ने के लिए: शेड्यूल खोलें, क्लास लिंक पर क्लिक करें, और पूछे जाने पर अपना आईडी दर्ज करें।"
  },
  "suggestions": [
    { "en": "Class schedule timing?", "hi": "क्लास का समय क्या है?" },
    { "en": "Troubleshooting audio", "hi": "ऑडियो समस्या का हल" }
  ],
  "meta": { "source": "demo", "confidence": 0.7 }
}
```

Error:

```json
{ "error": "Message here" }
```

The frontend expects both `reply.en` and `reply.hi` so users can switch languages instantly.

## Customization

- Change the title, default language, and API base URL in `public/index.html` where `ChatbotSidebar` is instantiated.
- Update predefined intents and answers in `public/ChatbotSidebar.jsx` under `predefinedIntents`.
- Adjust styles in `public/ChatbotSidebar.css` (colors, sizes, spacing).

## Notes for Low Bandwidth Environments

- Predefined answers avoid network calls for common queries.
- History is capped (`maxMessages`) to reduce memory.
- 10s request timeout with graceful error messaging.
- No heavy UI libraries; just React via CDN and plain CSS.

## License

MIT
