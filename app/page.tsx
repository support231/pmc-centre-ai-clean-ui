"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [intent, setIntent] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setIntent("");

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();

    setIntent(data.intent || "UNKNOWN");
    setAnswer(data.answer || "No answer received.");
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>PMC CENTRE AI – Clean UI (Prototype)</h1>

      <textarea
        rows={4}
        style={{ width: "100%", marginTop: 20 }}
        placeholder="Ask a PMC technical question…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={ask}
        disabled={loading}
        style={{ marginTop: 10, padding: "8px 16px" }}
      >
        {loading ? "Thinking…" : "Ask"}
      </button>

      {(answer || intent) && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ccc",
            whiteSpace: "pre-wrap",
          }}
        >
          {intent && (
            <div style={{ marginBottom: 10, color: "#666" }}>
              <strong>Intent:</strong> {intent}
            </div>
          )}

          {answer}
        </div>
      )}
    </main>
  );
}
