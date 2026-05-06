// ===== AI Chat - ALL IN ONE (via OpenRouter) =====
// Get your free API key at: https://openrouter.ai/keys

const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY"; // 🔑 Replace this

let chatHistory = [];

window.sendMessage = async function () {
  const input     = document.getElementById("userInput");
  const chatBox   = document.getElementById("chatBox");
  const model     = document.getElementById("modelSelect").value;
  const sendBtn   = document.getElementById("sendBtn");
  const userText  = input.value.trim();

  if (!userText) return;

  // Append user message
  appendMessage("user", userText);
  chatHistory.push({ role: "user", content: userText });
  input.value = "";
  sendBtn.disabled = true;
  sendBtn.textContent = "Thinking...";

  // Typing indicator
  const typingEl = document.createElement("div");
  typingEl.className = "chat-msg assistant typing";
  typingEl.innerHTML = `<span class="chat-avatar">🤖</span><div class="chat-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  chatBox.appendChild(typingEl);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "ALL IN ONE"
      },
      body: JSON.stringify({
        model: model,
        messages: chatHistory,
        max_tokens: 1024,
        temperature: 0.7
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "API error " + res.status);
    }

    const data    = await res.json();
    const reply   = data.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: reply });

    typingEl.remove();
    appendMessage("assistant", reply, getModelLabel(model));

  } catch (err) {
    typingEl.remove();
    appendMessage("assistant", "⚠️ Error: " + err.message, "Error");
    console.error(err);
  } finally {
    sendBtn.disabled    = false;
    sendBtn.textContent = "Send";
    chatBox.scrollTop   = chatBox.scrollHeight;
  }
};

// Send on Enter key
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); window.sendMessage(); }
  });

  // Clear chat button
  document.getElementById("clearChat")?.addEventListener("click", () => {
    chatHistory = [];
    document.getElementById("chatBox").innerHTML = `
      <div class="chat-welcome">
        <div style="font-size:2.5rem;">🤖</div>
        <p>Ask me anything! I can help with documents, summaries, explanations, and more.</p>
      </div>`;
  });
});

function appendMessage(role, text, label) {
  const chatBox = document.getElementById("chatBox");
  // Remove welcome screen on first message
  chatBox.querySelector(".chat-welcome")?.remove();

  const el = document.createElement("div");
  el.className = `chat-msg ${role}`;

  const avatar = role === "user" ? "👤" : "🤖";
  const name   = role === "user" ? "You" : (label || "Assistant");

  // Convert markdown-like formatting
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");

  el.innerHTML = `
    <span class="chat-avatar">${avatar}</span>
    <div class="chat-bubble-wrap">
      <div class="chat-label">${name}</div>
      <div class="chat-bubble">${formatted}</div>
    </div>`;

  chatBox.appendChild(el);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getModelLabel(model) {
  const labels = {
    "openai/gpt-4o-mini"           : "ChatGPT",
    "anthropic/claude-3-haiku"     : "Claude",
    "google/gemini-pro"            : "Gemini",
    "qwen/qwen-2-7b-instruct"      : "Qwen",
    "meta-llama/llama-3-8b-instruct": "Llama 3"
  };
  return labels[model] || "AI";
}
