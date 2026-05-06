// ===== AI Chat - ALL IN ONE (via OpenRouter) =====
// Get your free API key at: https://openrouter.ai/keys

const OPENROUTER_API_KEY = "YOUR_OPENROUTER_API_KEY"; // 🔑 Replace this

let chatHistory = [];

async function sendMessage() {
  const input    = document.getElementById("userInput");
  const model    = document.getElementById("modelSelect").value;
  const chatBox  = document.getElementById("chatBox");
  const sendBtn  = document.getElementById("sendBtn");
  const userText = input.value.trim();

  if (!userText) return;

  // Clear welcome screen
  chatBox.querySelector(".chat-welcome")?.remove();

  // Show user message
  chatBox.innerHTML += `
    <div class="chat-msg user">
      <span class="chat-avatar">👤</span>
      <div class="chat-bubble-wrap">
        <div class="chat-label">You</div>
        <div class="chat-bubble">${userText}</div>
      </div>
    </div>`;

  chatHistory.push({ role: "user", content: userText });
  input.value = "";
  sendBtn.disabled    = true;
  sendBtn.textContent = "Thinking...";
  chatBox.scrollTop   = chatBox.scrollHeight;

  // Typing indicator
  const typingId = "typing-" + Date.now();
  chatBox.innerHTML += `
    <div class="chat-msg assistant typing" id="${typingId}">
      <span class="chat-avatar">🤖</span>
      <div class="chat-bubble">
        <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      </div>
    </div>`;
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
        messages: chatHistory
      })
    });

    const data = await res.json();
    console.log("API RESPONSE:", data); // 👈 DEBUG

    // ✅ Validate response before accessing choices
    if (!data.choices || !data.choices.length) {
      throw new Error(data.error?.message || "API returned no choices");
    }

    const reply = data.choices[0].message.content;
    chatHistory.push({ role: "assistant", content: reply });

    // Remove typing indicator & show reply
    document.getElementById(typingId)?.remove();
    chatBox.innerHTML += `
      <div class="chat-msg assistant">
        <span class="chat-avatar">🤖</span>
        <div class="chat-bubble-wrap">
          <div class="chat-label">${getModelLabel(model)}</div>
          <div class="chat-bubble">${reply.replace(/\n/g, "<br>")}</div>
        </div>
      </div>`;

  } catch (error) {
    document.getElementById(typingId)?.remove();
    chatBox.innerHTML += `<p style="color:#e74c3c;padding:8px 16px;">⚠️ Error: ${error.message}</p>`;
  }

  sendBtn.disabled    = false;
  sendBtn.textContent = "Send";
  chatBox.scrollTop   = chatBox.scrollHeight;
}

// Expose globally for onclick
window.sendMessage = sendMessage;

// Enter key support & Clear button
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  document.getElementById("clearChat")?.addEventListener("click", () => {
    chatHistory = [];
    document.getElementById("chatBox").innerHTML = `
      <div class="chat-welcome">
        <div style="font-size:2.5rem;">🤖</div>
        <p>Ask me anything! I can help with documents, summaries, explanations, and more.</p>
      </div>`;
  });
});

function getModelLabel(model) {
  const labels = {
    "openai/gpt-4o-mini"            : "ChatGPT",
    "anthropic/claude-3-haiku"      : "Claude",
    "google/gemini-pro"             : "Gemini",
    "qwen/qwen-2-7b-instruct"       : "Qwen",
    "meta-llama/llama-3-8b-instruct": "Llama 3"
  };
  return labels[model] || "AI";
}
