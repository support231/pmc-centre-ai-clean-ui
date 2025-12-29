"use client";

import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"PMC" | "GENERAL" | "">("");

  async function ask() {
    if (!question.trim() || !mode) return;

    setLoading(true);
    setAnswer("");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PMC_BACKEND_URL}/ask`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          mode,
        }),
      }
    );

    const data = await res.json();
    setAnswer(data.answer || "No answer received.");
    setLoading(false);
  }

  function placeholderText() {
    if (mode === "PMC") {
      return "Ask a Paper Machine Clothing question (forming, felt, dryer fabrics)…";
    }
    if (mode === "GENERAL") {
      return "Ask a general technical or knowledge question…";
    }
    return "Select a question type first…";
  }

  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>PMC CENTRE AI</h1>

      <p style={{ marginTop: 10, color: "#555" }}>
        Choose the question type to get the best answer.
      </p>

      <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
        <button
          onClick={() => setMode("PMC")}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: mode === "PMC" ? "#ddd" : "#f5f5f5",
            border: "1px solid #999",
          }}
        >
          Ask PMC Question
        </button>

        <button
          onClick={() => setMode("GENERAL")}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: mode === "GENERAL" ? "#ddd" : "#f5f5f5",
            border: "1px solid #999",
          }}
        >
          Ask General Question
        </button>
      </div>

      <textarea
        rows={4}
        style={{ width: "100%", marginTop: 20 }}
        placeholder={placeholderText()}
        value={question}
        disabled={!mode || loading}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <button
          onClick={ask}
          disabled={!mode || !question.trim() || loading}
          style={{ padding: "8px 16px" }}
        >
          {loading ? "Thinking…" : "Submit"}
        </button>
      </div>

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
