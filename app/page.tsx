"use client";

import { useState, useRef } from "react";

type Mode = "PMC" | "GENERAL" | "LIVE" | "";

/* =======================
   FILE TYPE CONTROL
   ======================= */

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const BLOCKED_FILE_MESSAGE =
  "Excel and PowerPoint files will be supported soon. " +
  "For now, please upload PDF, Word, text, or image files.";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function ask() {
    if (!question.trim() || !mode) return;

    setLoading(true);
    setAnswer("");

    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("mode", mode);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PMC_BACKEND_URL}/ask`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setAnswer(data.answer || "No answer received.");
    } catch {
      setAnswer(
        "The uploaded file could not be processed. " +
          "Please try a smaller file, a different format, or remove the file."
      );
    } finally {
      setLoading(false);
    }
  }

  function placeholderText() {
    if (mode === "PMC")
      return "Ask a Paper Machine Clothing question (forming, felt, dryer fabrics)…";
    if (mode === "GENERAL")
      return "Ask a general question, create plans or itineraries, or build structured dashboards…";
    if (mode === "LIVE")
      return "Ask about current prices, recent announcements, or latest updates…";
    return "Select a question type first…";
  }

  function copyAnswer() {
    navigator.clipboard.writeText(answer);
    alert("Answer copied to clipboard");
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      alert(BLOCKED_FILE_MESSAGE);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFile(file);
  }

  function removeFile() {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main
      style={{
        padding: 24,
        maxWidth: 1200,
        margin: "0 auto",
        background: "#f2f6fb",
      }}
    >
      {/* INSTRUCTION TEXT */}
      <div
        style={{
          textAlign: "center",
          fontSize: 20,
          fontWeight: 600,
          marginBottom: 24,
          color: "#1a73e8",
        }}
      >
        Choose the question type to get the best possible answer.
      </div>

      {/* MODE CARDS */}
      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        {modeCard(
          "PMC Expert Mode",
          "Deep technical guidance on Paper Machine Clothing technology. Best suited for troubleshooting, fabric selection, process optimisation, and interpreting technical documents related to forming, press, and dryer fabrics.",
          "Ask PMC Question",
          "PMC",
          mode,
          setMode
        )}

        {modeCard(
          "General AI Assistant",
          "A versatile AI assistant for everyday professional and personal tasks.Use this mode to create structured plans and itineraries, build text-based dashboards, draft emails, summarise documents, and answer non-PMC questions.",
          "Ask General Question",
          "GENERAL",
          mode,
          setMode
        )}

        {modeCard(
          "Current Updates",
          "Get answers based on the latest available information from live web sources. Ideal for current prices, recent announcements, policy updates, and other time-sensitive factual queries. Document upload is not supported in this mode.",
          "View Current Updates",
          "LIVE",
          mode,
          setMode
        )}
      </div>

      {/* CHAT AREA */}
      <div
        style={{
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
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <strong style={{ color: "#1a73e8" }}>
            {mode ? `Mode: ${mode}` : "Select a mode to start"}
          </strong>

          <button
            onClick={() => {
              if (mode === "LIVE") {
                alert(
                  "Current Updates does not support document upload. " +
                    "Please switch to PMC Expert Mode or General AI Assistant."
                );
                return;
              }
              fileInputRef.current?.click();
            }}
            disabled={!mode || loading}
            title={
              mode === "LIVE"
                ? "File upload not available in Current Updates"
                : "Upload file"
            }
            style={{
              ...uploadBtn,
              opacity: mode === "LIVE" ? 0.5 : 1,
              cursor: mode === "LIVE" ? "not-allowed" : "pointer",
            }}
          >
            +
          </button>

          <input
            type="file"
            ref={fileInputRef}
            hidden
            onChange={onFileSelect}
          />
        </div>

        {/* SELECTED FILE */}
        {selectedFile && (
          <div
            style={{
              fontSize: 13,
              marginBottom: 8,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#eef3fb",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            <span>📎 {selectedFile.name}</span>
            <button onClick={removeFile} style={{ fontSize: 12 }}>
              Remove
            </button>
          </div>
        )}

        {/* QUESTION INPUT */}
        <textarea
          rows={4}
          style={textareaStyle}
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
            style={submitBtn}
          >
            {loading ? "Thinking…" : "Submit"}
          </button>
        </div>

        {/* ANSWER */}
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
                maxHeight: 320,
                overflowY: "auto",
                lineHeight: 1.5,
              }}
            >
              {answer}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <p style={{ marginTop: 20, fontSize: 12, color: "#666" }}>
        Powered by OpenAI and PMC CENTRE’s specialized industry knowledge base
      </p>
    </main>
  );
}

/* =======================
   MODE CARD
   ======================= */

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
        width: 300,
        minHeight: 200,
        padding: "14px 16px",
        borderRadius: 10,
        background: active === value ? "#e8f0fe" : "#ffffff",
        boxShadow: "0 3px 10px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ marginBottom: 6, fontSize: 17 }}>{title}</h3>

      <p style={{ fontSize: 13, color: "#555", lineHeight: 1.4 }}>
        {text}
      </p>

      <button
        onClick={() => setMode(value)}
        style={{
          width: "100%",
          padding: "10px 0",
          marginTop: "auto",
          background: "#1a73e8",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          fontSize: 14,
          cursor: "pointer",
        }}
      >
        {btn}
      </button>
    </div>
  );
}

/* =======================
   STYLES
   ======================= */

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
