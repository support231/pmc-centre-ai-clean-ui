"use client";

import { useState, useRef } from "react";

type Mode = "PMC" | "GENERAL" | "LIVE" | "";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function ask() {
    if (!question.trim() || !mode) return;

    setLoading(true);
    setAnswer("");

    try {
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
    } catch {
      setAnswer("Error contacting backend. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function placeholderText() {
    if (mode === "PMC") {
      return "Ask a Paper Machine Clothing question (forming, felt, dryer fabrics)…";
    }
    if (mode === "GENERAL") {
      return "Ask a general question (draft email, explain concept, GK)…";
    }
    if (mode === "LIVE") {
      return "Ask for latest developments, current events, or recent announcements…";
    }
    return "Select a question type first…";
  }

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
    alert("Answer copied to clipboard");
  }

  return (
    <main style={{ padding: 40, maxWidth: 1100, margin: "0 auto" }}>
      {/* HEADER */}
      <h1>PMC CENTRE AI</h1>
      <p style={{ marginTop: 8, color: "#555" }}>
        Choose the question type to get the best possible answer.
      </p>

      {/* MODE BLOCKS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          marginTop: 30,
          flexWrap: "wrap",
        }}
      >
        {/* PMC MODE */}
        <div style={cardStyle(mode === "PMC")}>
          <h3>PMC Expert Mode</h3>
          <p>
            Deep technical guidance on Paper Machine Clothing technology.
            Best for troubleshooting, fabric selection, and process questions.
          </p>
          <button onClick={() => setMode("PMC")} disabled={loading}>
            Ask PMC Question
          </button>
        </div>

        {/* GENERAL MODE */}
        <div style={cardStyle(mode === "GENERAL")}>
          <h3>General AI Assistant</h3>
          <p>
            Use AI for general knowledge, drafting letters or emails,
            explanations, and non-PMC questions.
          </p>
          <button onClick={() => setMode("GENERAL")} disabled={loading}>
            Ask General Question
          </button>
        </div>

        {/* LIVE MODE */}
        <div style={cardStyle(mode === "LIVE")}>
          <h3>Live Web Search</h3>
          <p>
            Get answers based on the latest available information from the web.
            Ideal for recent developments, announcements, and current events.
          </p>
          <button onClick={() => setMode("LIVE")} disabled={loading}>
            Live Search (Latest Info)
          </button>
        </div>
      </div>

      {/* CHAT AREA */}
      <div
        style={{
          marginTop: 40,
          padding: 20,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      >
        {/* CHAT TOOLBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <strong>
            {mode ? `Mode: ${mode}` : "Select a mode to start"}
          </strong>

          {/* FILE UPLOAD */}
          <div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!mode || loading}
              title="Upload file (demo)"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              +
            </button>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={() =>
                alert("File upload UI only (backend not connected yet).")
              }
            />
          </div>
        </div>

        {/* QUESTION INPUT */}
        <textarea
          rows={4}
          style={{ width: "100%", padding: 8 }}
          placeholder={placeholderText()}
          value={question}
          disabled={!mode || loading}
          onChange={(e) => setQuestion(e.target.value)}
        />

        {/* SUBMIT */}
        <div style={{ marginTop: 10 }}>
          <button
            onClick={ask}
            disabled={!mode || !question.trim() || loading}
            style={{ padding: "8px 16px" }}
          >
            {loading ? "Thinking…" : "Submit"}
          </button>
        </div>

        {/* ANSWER */}
        {answer && (
          <div
            style={{
              marginTop: 20,
              padding: 15,
              borderTop: "1px solid #ddd",
              whiteSpace: "pre-wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 6,
              }}
            >
              <strong>Answer</strong>
              <button onClick={copyAnswer}>Copy</button>
            </div>
            {answer}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <p style={{ marginTop: 30, fontSize: 12, color: "#666" }}>
        Powered by OpenAI and PMC CENTRE’s specialized industry knowledge base
      </p>
    </main>
  );
}

/* ---------- STYLES ---------- */

function cardStyle(active: boolean): React.CSSProperties {
  return {
    flex: "1 1 300px",
    padding: 20,
    border: "1px solid #ccc",
    borderRadius: 6,
    backgroundColor: active ? "#f2f2f2" : "#fff",
  };
}
