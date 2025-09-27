import React, { useEffect, useMemo, useRef, useState } from "react";
import "./ChatbotSidebar.css";

/**
 * ChatbotSidebar (Bilingual: English/Hindi)
 * - Lightweight, no extra libs needed.
 * - Uses predefined intents for common queries to avoid network calls.
 * - Uses REST API at "/api/chat" by default (Vite proxy can forward to backend).
 *
 * Props:
 * - apiBaseUrl?: string (default: "")
 *      If empty, will call "/api/chat" relative to current origin.
 * - initialLang?: 'en' | 'hi' (default: 'en')
 * - title?: { en: string, hi: string } | undefined
 * - maxMessages?: number (default: 50)
 */
export default function ChatbotSidebar({
  apiBaseUrl = "",
  initialLang = "en",
  title,
  maxMessages = 50,
}) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(initialLang);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      type: "bot",
      reply: {
        en: "Hello! How can I help you today?",
        hi: "नमस्ते! मैं आपकी कैसे सहायता कर सकता/सकती हूँ?",
      },
      suggestions: [
        { en: "How to join class?", hi: "क्लास में कैसे जुड़ें?" },
        { en: "How to download lectures?", hi: "लेक्चर कैसे डाउनलोड करें?" },
      ],
    },
  ]);

  const UI = useMemo(
    () => ({
      title: title || {
        en: "Ask VEDA",
        hi: "वेदा से पूछें",
      },
      placeholder: {
        en: "Type your question...",
        hi: "अपना प्रश्न लिखें...",
      },
      send: { en: "Send", hi: "भेजें" },
      language: { en: "Language", hi: "भाषा" },
      english: { en: "English", hi: "अंग्रेज़ी" },
      hindi: { en: "Hindi", hi: "हिन्दी" },
      minimize: { en: "Hide", hi: "छुपाएं" },
      open: { en: "Open", hi: "खोलें" },
      typing: { en: "Typing...", hi: "लिख रहा है..." },
      errorPrefix: { en: "Error:", hi: "त्रुटि:" },
      retry: { en: "Retry", hi: "फिर कोशिश करें" },
      quickTips: { en: "Quick tips:", hi: "त्वरित सुझाव:" },
    }),
    [title]
  );

  const predefinedIntents = useMemo(
    () => [
      {
        keys: [
          /join class/i,
          /how.*join.*class/i,
          /class.*join/i,
          /क्लास.*जुड़/i,
          /जुड़.*क्लास/i,
        ],
        answer: {
          en:
            "To join a class: 1) Open your schedule, 2) Click the class link, 3) If asked, enter your ID and name. For offline classes, check your local timetable.",
          hi:
            "क्लास में जुड़ने के लिए: 1) अपना शेड्यूल खोलें, 2) क्लास लिंक पर क्लिक करें, 3) यदि पूछा जाए, तो अपना आईडी और नाम दर्ज करें। ऑफलाइन क्लास के लिए स्थानीय समय-सारणी देखें।",
        },
      },
      {
        keys: [
          /download lectures?/i,
          /how.*download.*lecture/i,
          /लेक्चर.*डाउनलोड/i,
          /डाउनलोड.*लेक्चर/i,
        ],
        answer: {
          en:
            "To download lectures: 1) Go to the Lectures section, 2) Select a lecture, 3) Click Download. For low bandwidth, prefer audio-only or lower quality.",
          hi:
            "लेक्चर डाउनलोड करने के लिए: 1) 'Lectures' सेक्शन में जाएँ, 2) लेक्चर चुनें, 3) 'Download' पर क्लिक करें। कम इंटरनेट गति में, केवल ऑडियो या कम गुणवत्ता चुनें।",
        },
      },
    ],
    []
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open]);

  function getUILabel(key) {
    const entry = UI[key];
    if (typeof entry === "string") return entry;
    return entry?.[lang] ?? "";
  }

  function matchPredefined(text) {
    if (!text) return null;
    for (const intent of predefinedIntents) {
      if (intent.keys.some((re) => re.test(text))) {
        return intent.answer;
      }
    }
    return null;
  }

  async function fetchDynamicReply(text) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const base = apiBaseUrl?.replace(/\/$/, "") || "";
    const url = `${base}/api/chat`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ text, lang }),
        signal: controller.signal,
      });

      clearTimeout(id);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data?.reply?.en || !data?.reply?.hi) return null;
      return {
        reply: data.reply,
        suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
      };
    } catch (e) {
      clearTimeout(id);
      return { error: e.message || "Network error" };
    }
  }

  async function handleSend(e) {
    e?.preventDefault?.();
    setError("");

    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => {
      const next = [...prev, { type: "user", text: trimmed }];
      if (next.length > maxMessages) next.splice(0, next.length - maxMessages);
      return next;
    });
    setInput("");
    setSending(true);

    const localAnswer = matchPredefined(trimmed);
    if (localAnswer) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", reply: localAnswer, suggestions: [] },
      ]);
      setSending(false);
      return;
    }

    const result = await fetchDynamicReply(trimmed);
    if (result?.error) {
      setError(result.error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          reply: {
            en: "Sorry, I could not fetch a response. Please try again.",
            hi: "क्षमा करें, मैं उत्तर नहीं ला सका/सकी। कृपया फिर प्रयास करें।",
          },
          suggestions: [],
        },
      ]);
      setSending(false);
      return;
    }
    if (result?.reply) {
      setMessages((prev) => [
        ...prev,
        { type: "bot", reply: result.reply, suggestions: result.suggestions || [] },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          reply: {
            en: "I don't have an answer for that yet.",
            hi: "मेरे पास अभी इसके लिए उत्तर उपलब्ध नहीं है।",
          },
          suggestions: [],
        },
      ]);
    }
    setSending(false);
  }

  function handleSuggestionClick(sugg) {
    setInput(sugg[lang] || sugg.en || "");
    setTimeout(() => handleSend(), 0);
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSend(e);
    }
  }

  return (
    <div className={`veda-chatbot ${open ? "open" : "closed"}`} lang={lang}>
      {!open && (
        <button
          aria-label={getUILabel("open")}
          className="toggle-btn"
          onClick={() => setOpen(true)}
          title={getUILabel("open")}
        >
          💬
        </button>
      )}

      {open && (
        <div className="panel" role="complementary" aria-label="Chatbot">
          <div className="header">
            <div className="title" style={{ fontFamily: "'Noto Sans Devanagari', 'Mangal', system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif" }}>
              {getUILabel("title")}
            </div>
            <div className="controls">
              <label className="lang-label" htmlFor="lang-select">
                {getUILabel("language")}:
              </label>
              <select
                id="lang-select"
                className="lang-select"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label={getUILabel("language")}
              >
                <option value="en">{UI.english[lang]}</option>
                <option value="hi">{UI.hindi[lang]}</option>
              </select>
              <button
                className="close-btn"
                onClick={() => setOpen(false)}
                title={getUILabel("minimize")}
                aria-label={getUILabel("minimize")}
              >
                ✕
              </button>
            </div>
          </div>

          <div className="messages" ref={listRef}>
            {messages.map((msg, idx) => {
              if (msg.type === "user") {
                return (
                  <div key={idx} className="msg user" aria-label="Your message">
                    <div className="bubble">{msg.text}</div>
                  </div>
                );
              }
              return (
                <div key={idx} className="msg bot" aria-label="Bot message">
                  <div className="bubble">
                    {msg.reply?.[lang] || msg.reply?.en || ""}
                    {msg.suggestions?.length ? (
                      <div className="suggestions">
                        <div className="suggestions-label">{getUILabel("quickTips")}</div>
                        <div className="chips">
                          {msg.suggestions.map((s, i) => (
                            <button
                              key={i}
                              className="chip"
                              onClick={() => handleSuggestionClick(s)}
                            >
                              {s?.[lang] || s?.en}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
            {sending && (
              <div className="msg bot">
                <div className="bubble typing">
                  <span className="dot" />
                  <span className="dot" />
                  <span className="dot" />
                  <span className="typing-label">{getUILabel("typing")}</span>
                </div>
              </div>
            )}
          </div>

          {!!error && (
            <div className="error" role="alert">
              <strong>{UI.errorPrefix[lang]} </strong>
              {error} {" "}
              <button className="retry" onClick={() => setError("")}>
                {getUILabel("retry")}
              </button>
            </div>
          )}

          <form className="composer" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={getUILabel("placeholder")}
              aria-label={getUILabel("placeholder")}
              maxLength={300}
              inputMode="text"
              autoComplete="off"
            />
            <button type="submit" disabled={sending || !input.trim()}>
              {getUILabel("send")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
