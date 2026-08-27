"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "سلام 👋\nمن فروشنده هوشمند هستم.\nسؤال خودت را بنویس تا با هم شروع کنیم."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e.preventDefault();

    const text = input.trim();

    if (!text || loading) {
      return;
    }

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: text
      }
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: newMessages
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "خطایی در دریافت پاسخ رخ داد."
        );
      }

      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: data.content
        }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "فعلاً اتصال هوش مصنوعی برقرار نیست.\n" +
            "بعداً بخش اتصال هوش مصنوعی را تنظیم می‌کنیم."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        direction: "rtl"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "850px",
          height: "90vh",
          background: "white",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
        }}
      >
        <header
          style={{
            padding: "20px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px"
              }}
            >
              فروشنده هوشمند
            </h1>

            <p
              style={{
                margin: "5px 0 0",
                color: "#777",
                fontSize: "13px"
              }}
            >
              چت‌بات اختصاصی شما
            </p>
          </div>

          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#22c55e"
            }}
          />
        </header>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            background: "#fafafa"
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.role === "user"
                    ? "flex-start"
                    : "flex-end",
                marginBottom: "12px"
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "12px 16px",
                  borderRadius: "16px",
                  lineHeight: "1.8",
                  whiteSpace: "pre-wrap",
                  background:
                    message.role === "user"
                      ? "#e9e9e9"
                      : "#171717",
                  color:
                    message.role === "user"
                      ? "#111"
                      : "#fff"
                }}
              >
                {message.content}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end"
              }}
            >
              <div
                style={{
                  background: "#171717",
                  color: "white",
                  padding: "12px 16px",
                  borderRadius: "16px"
                }}
              >
                در حال پاسخ...
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={sendMessage}
          style={{
            display: "flex",
            gap: "10px",
            padding: "15px",
            borderTop: "1px solid #eee"
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            disabled={loading}
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "13px",
              fontSize: "15px",
              outline: "none"
            }}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "0 22px",
              background: "#171717",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ارسال
          </button>
        </form>
      </div>
    </main>
  );
          }
