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
          body: JSON.stringify({ question, mode }),
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
    if (mode === "PMC")
      return "Ask a Paper Machine Clothing question (forming, felt, dryer fabrics)…";
    if (mode === "GENERAL")
      return "Ask a general question (draft email, explain concept, GK)…";
    if (mode === "LIVE")
      return "Ask about latest developments, announcements, or current events…";
    return "Select a question type first…";
  }

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
    alert("Answer copied");
  }

  return (
    <main
      style={{
        padding: 30,
        maxWidth: 1200,
        margin: "0 auto",
        background: "#f2f6fb",
      }}
    >
      {/* CENTERED INSTRUCTION */}
      <div
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 30,
          color: "#1a73e8",
        }}
      >
        Choose the question type to get the best possible answer.
      </div>

      {/* MODE CARDS */}
      <div
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {modeCard(
          "PMC Expert Mode",
          "Deep technical guidance on Paper Machine Clothing technology. Best for troubleshooting, fabric selection, and process questions.",
          "Ask PMC Question",
          "PMC",
          mode,
          setMode
        )}

        {modeCard(
          "General AI Assistant",
          "Use AI for general knowledge, drafting letters or emails, explanations, and non-PMC questions.",
          "Ask General Question",
          "GENERAL",
          mode,
          setMode
        )}

        {modeCard(
          "Live Web Search",
          "Get answers based on the latest available information from the web. Ideal for recent developments, announcements, and current events.",
          "Live Search (Latest Info)",
          "LIVE",
          mode,
          setMode
        )}
      </div>

      {/* CHAT AREA */}
      <div
        style={{
          marginTop: 40,
          background: "#ffffff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        {/* TOOLBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <strong style={{ color: "#1a73e8" }}>
            {mode ? `Mode: ${mode}` : "Select a mode to start"}
          </strong>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={!mode || loading}
            title="Upload file"
            style={uploadBtn}
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

        <textarea
          rows={4}
          style={textareaStyle}
          placeholder={placeholderText()}
          value={question}
          disabled={!mode || loading}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <div style={{ marginTop: 10 }}>
          <button
            onClick={ask}
            disabled={!mode || !question.trim() || loading}
            style={submitBtn}
          >
            {loading ? "Thinking…" : "Submit"}
          </button>
        </div>

        {answer && (
          <div style={{ marginTop: 20 }}>
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
            <div
  style={{
    whiteSpace: "pre-wrap",
    background: "#f7f9fc",
    padding: 12,
    borderRadius: 6,
    maxHeight: "320px",
    overflowY: "auto",
    lineHeight: 1.5,
  }}
>
  {answer}
</div>

          </div>
        )}
      </div>
    </main>
  );
}

/* ---------- HELPERS ---------- */

function modeCard(
  title: string,
  text: string,
  btn: string,
  value: Mode,
  active: Mode,
  setMode: (m: Mode) => void
) {
  return (
    <div
      style={{
        width: 320,
        padding: 20,
        borderRadius: 10,
        background: active === value ? "#e8f0fe" : "#ffffff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <h3 style={{ marginBottom: 10 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#555", minHeight: 90 }}>{text}</p>
      <button
        onClick={() => setMode(value)}
        style={{
          width: "100%",
          padding: "12px 0",
          background: "#1a73e8",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 15,
          cursor: "pointer",
        }}
      >
        {btn}
      </button>
    </div>
  );
}

const textareaStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 6,
  border: "1px solid #ccc",
};

const submitBtn = {
  padding: "10px 18px",
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const uploadBtn = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  background: "#1a73e8",
  color: "#fff",
  border: "none",
  fontSize: 20,
  cursor: "pointer",
};
