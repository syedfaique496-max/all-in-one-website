// ===== AI Chat - ALL IN ONE =====

const OPENROUTER_API_KEY = "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";

async function sendMessage() {
  const input    = document.getElementById("userInput");
  const model    = document.getElementById("modelSelect").value;
  const chatBox  = document.getElementById("chatBox");
  const sendBtn  = document.getElementById("sendBtn");
  const message  = input.value.trim();

  if (!message) return;

  // Clear welcome screen
  chatBox.querySelector(".chat-welcome")?.remove();

  addMessage(message, "user");
  input.value = "";
  sendBtn.disabled    = true;
  sendBtn.textContent = "Thinking...";
  chatBox.scrollTop   = chatBox.scrollHeight;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "ALL IN ONE"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    const reply = data.choices?.[0]?.message?.content || "No response";
    addMessage(reply, "bot");

  } catch (error) {
    console.error(error);
    addMessage("Error: " + error.message, "bot");
  }

  sendBtn.disabled    = false;
  sendBtn.textContent = "Send";
  chatBox.scrollTop   = chatBox.scrollHeight;
}

function addMessage(text, sender) {
  const chatBox = document.getElementById("chatBox");
  const isUser  = sender === "user";
  chatBox.innerHTML += `
    <div class="chat-msg ${isUser ? "user" : "assistant"}">
      <span class="chat-avatar">${isUser ? "👤" : "🤖"}</span>
      <div class="chat-bubble-wrap">
        <div class="chat-label">${isUser ? "You" : "AI"}</div>
        <div class="chat-bubble">${text.replace(/\n/g, "<br>")}</div>
      </div>
    </div>`;
}

// Expose globally
window.sendMessage = sendMessage;

// Enter key & Clear button
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("userInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  document.getElementById("clearChat")?.addEventListener("click", () => {
    document.getElementById("chatBox").innerHTML = `
      <div class="chat-welcome">
        <div style="font-size:2.5rem;">🤖</div>
        <p>Ask me anything! I can help with documents, summaries, explanations, and more.</p>
      </div>`;
  });
});
