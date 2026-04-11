/* ===========================
SESSION MANAGEMENT
=========================== */
function getSessionId() {
  let id = localStorage.getItem("chat_session");
  if (!id) {
    id = "user_" + Math.random().toString(36).substring(2, 10);
    localStorage.setItem("chat_session", id);
  }
  return id;
}

const SESSION_ID = getSessionId();

/* ===========================
CONFIG - CONNECTED TO LIVE RENDER SERVER
=========================== */
// We swapped localhost for your live Render domain. 
// %20 represents the spaces in "Mainul's Ai Assistant"
const webhookUrl = "https://my-ai-automation-hub.onrender.com/webhook/website-ai-assistant";
const chatContainer = document.getElementById("chat-widget-container");
const chatBtn = document.getElementById("modern-chat-btn"); 
const chatWindow = document.getElementById("chat");
const messages = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("sendBtn");

/* ===========================
WIDGET TOGGLE
=========================== */
function toggleChat() {
    if (chatContainer.style.display === "none" || chatContainer.style.display === "") {
        chatContainer.style.display = "block";
        chatBtn.style.display = "none";  // Hides the icon
    } else {
        chatContainer.style.display = "none";
        chatBtn.style.display = "flex";  // Shows the icon
    }
}

/* ===========================
THEME TOGGLE
=========================== */
function toggleTheme() {
  if (chatWindow.classList.contains("dark")) {
    chatWindow.classList.remove("dark");
    chatWindow.classList.add("light");
  } else {
    chatWindow.classList.remove("light");
    chatWindow.classList.add("dark");
  }
}

/* ===========================
ADD MESSAGE
=========================== */
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerText = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

/* ===========================
TYPING INDICATOR
=========================== */
function showTyping() {
  const div = document.createElement("div");
  div.className = "msg bot typing";
  div.id = "typing";
  div.innerText = "Assistant is typing...";
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

/* ===========================
SEND MESSAGE
=========================== */
async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";
  showTyping();

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        session_id: SESSION_ID,
        user_message: message
      })
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    removeTyping();

    const reply = data.reply || "Sorry, I couldn't understand that.";
    addMessage(reply, "bot");

  } catch (error) {
    removeTyping();
    addMessage("⚠️ Server connection failed. Please try again.", "bot");
    console.error("Chatbot Error:", error);
  }
}

/* ===========================
EVENT LISTENERS
=========================== */
if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

if (input) {
  input.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });
}

// Close chat when clicking anywhere outside of it
document.addEventListener("mousedown", function(event) {
  if (chatContainer.style.display === "block") {
    if (!chatWindow.contains(event.target) && !chatBtn.contains(event.target)) {
      chatContainer.style.display = "none";
      chatBtn.style.display = "flex";
    }
  }
});