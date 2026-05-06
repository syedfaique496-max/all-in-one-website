// ===== AI Chat - ALL IN ONE =====

async function sendMessage() {
  const input    = document.getElementById("userInput").value;
  const model    = document.getElementById("modelSelect").value;
  const chatBox  = document.getElementById("chatBox");
  const sendBtn  = document.getElementById("sendBtn");

  if (!input) return;

  // Clear welcome screen
  chatBox.querySelector(".chat-welcome")?.remove();

  chatBox.innerHTML += `
    <div class="chat-msg user">
      <span class="chat-avatar">👤</span>
      <div class="chat-bubble-wrap">
        <div class="chat-label">You</div>
        <div class="chat-bubble">${input}</div>
      </div>
    </div>`;

  document.getElementById("userInput").value = "";
  sendBtn.disabled    = true;
  sendBtn.textContent = "Thinking...";
  chatBox.scrollTop   = chatBox.scrollHeight;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.href,
        "X-Title": "ALL IN ONE"
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: input }]
      })
    });

    const data = await res.json();
    console.log("API RESPONSE:", data);

    if (!data.choices || !data.choices.length) {
      throw new Error(data.error?.message || "Something went wrong");
    }

    const reply = data.choices[0].message.content;

    chatBox.innerHTML += `
      <div class="chat-msg assistant">
        <span class="chat-avatar">🤖</span>
        <div class="chat-bubble-wrap">
          <div class="chat-label">AI</div>
          <div class="chat-bubble">${reply.replace(/\n/g, "<br>")}</div>
        </div>
      </div>`;

  } catch (error) {
    chatBox.innerHTML += `<p style="color:red; padding:8px 16px;">Error: ${error.message}</p>`;
  }

  sendBtn.disabled    = false;
  sendBtn.textContent = "Send";
  chatBox.scrollTop   = chatBox.scrollHeight;
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
