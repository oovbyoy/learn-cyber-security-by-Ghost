import { useState } from "react";
import Head from "next/head";
import "../styles/globals.css";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [lang, setLang] = useState("العربية");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { role: "user", content: input };
    setMessages([...messages, newMsg]);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: newMsg.content, language: lang })
    });

    const data = await res.json();
    const reply = { role: "assistant", content: data.reply };
    setMessages((prev) => [...prev, reply]);
    setLoading(false);
  }

  return (
    <>
      <Head><title>Zalm AI Chat</title></Head>
      <div className="chatPage">
        <h1>Zalm <span className="accent">AI</span></h1>
        <div className="langSelect">
          <label>Language: </label>
          <select value={lang} onChange={(e) => setLang(e.target.value)}>
            <option>العربية</option>
            <option>English</option>
          </select>
        </div>
        <div className="chatBox">
          {messages.map((m, i) => (
            <div key={i} className={m.role}>{m.content}</div>
          ))}
          {loading && <div className="assistant">...</div>}
        </div>
        <form onSubmit={sendMessage} className="chatForm">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="اكتب رسالتك..." />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}