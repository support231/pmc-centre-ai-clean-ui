"use client";

import { useState, useRef, useEffect } from "react";

type Mode = "PMC" | "GENERAL" | "LIVE" | "";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  file?: {
    name: string;
    type: string;
  };
};

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/png",
  "image/webp",
];

const BLOCKED_FILE_MESSAGE =
  "Excel and PowerPoint files are not supported. Please upload PDF, Word, text, or image files.";

export default function Home() {
  const [mode, setMode] = useState<Mode>("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function onModeChange(m: Mode) {
    setMode(m);
    setMessages([]);
    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startNewChat() {
    setMessages([]);
    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      alert(BLOCKED_FILE_MESSAGE);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
  }

  async function sendMessage() {
    if (!input.trim() || !mode) return;

    // 🔒 freeze file reference
    const fileForThisMessage = selectedFile;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      file: fileForThisMessage
        ? { name: fileForThisMessage.name, type: fileForThisMessage.type }
        : undefined,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setInput("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setLoading(true);

    try {
      const contextText = updatedMessages
        .slice(-6)
        .map((m) =>
          m.role === "user"
            ? `User: ${m.content}`
            : `Assistant: ${m.content}`
        )
        .join("\n");

      const formData = new FormData();
      formData.append("question", contextText);
      formData.append("mode", mode);

      if (fileForThisMessage) {
        formData.append("file", fileForThisMessage);
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PMC_BACKEND_URL}/ask`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "No answer received.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I had trouble processing that request. Could you clarify what you want me to do?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function editMessage(index: number) {
    const msg = messages[index];
    if (msg.role !== "user") return;
    setInput(msg.content);
    setMessages(messages.slice(0, index));
  }

  function copyMessage(text: string) {
    navigator.clipboard.writeText(text);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function placeholderText() {
    if (mode === "PMC")
      return "Ask a Paper Machine Clothing question…";
    if (mode === "GENERAL")
      return "Ask a general question…";
    if (mode === "LIVE")
      return "Ask about recent updates…";
    return "Select a mode to start…";
  }

  return (
    <main style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={startNewChat}>New Chat</button>
      </div>

      <div style={{ minHeight: 400 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 14 }}>
            <div>
              {m.file && <div>📎 {m.file.name}</div>}
              <strong>{m.role === "user" ? "You" : "AI"}:</strong> {m.content}
            </div>
            {m.role === "user" && (
              <button onClick={() => editMessage(i)}>✏️</button>
            )}
            {m.role === "assistant" && (
              <button onClick={() => copyMessage(m.content)}>📋</button>
            )}
          </div>
        ))}
        {loading && <div>Thinking…</div>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          onClick={() => {
            if (mode === "LIVE") {
              alert("File upload not supported in Live mode.");
              return;
            }
            fileInputRef.current?.click();
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

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText()}
        />

        <button onClick={sendMessage}>Send</button>
      </div>
    </main>
  );
}
