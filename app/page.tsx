"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"PMC" | "GENERAL" | "">("");

  async function ask(selectedMode: "PMC" | "GENERAL") {
    if (!question.trim()) return;

    setMode(selectedMode);
    setLoading(true);
    setAnswer("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PMC_BACKEND_URL}/ask`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mode: selectedMode,
        }),
      }
    );

    const data = await res.json();
    setAnswer(data.answer || "No answer received.");
    setLoading(false);
  }

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>PMC CENTRE AI</h1>

      <textarea
        rows={4}
        style={{ width: "100%", marginTop: 20 }}
        placeholder="Type your question here…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
        <button
          onClick={() => ask("PMC")}
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          Ask PMC Question
        </button>

        <button
          onClick={() => ask("GENERAL")}
          disabled={loading}
          style={{ padding: "8px 16px" }}
        >
          Ask General Question
        </button>
      </div>

      {loading && (
        <div style={{ marginTop: 20 }}>Thinking…</div>
      )}

      {answer && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ccc",
            whiteSpace: "pre-wrap",
          }}
        >
          {answer}
        </div>
      )}
    </main>
  );
}
