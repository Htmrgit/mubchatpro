(function() {
    // 1. Configuration
    const API_URL = "https://script.google.com/macros/s/AKfycbyS5Ow_FZMgsluQUDKiYf2Nzz9odewnSj-U2zQfAmVT7c84HO2FpL1KQ2dZJBim6d6mSg/exec";
    const siteID = document.currentScript.dataset.site || "unknown";
    
    let userName = "";
    let userPhone = "";
    let chatStep = "ask_name"; // ask_name, ask_phone, active_chat

    // 2. Create UI Elements
    const chatContainer = document.createElement("div");
    chatContainer.id = "mub-chat-wrapper";
    chatContainer.innerHTML = `
        <div id="mub-chat-btn">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div id="mub-chat-window">
            <div id="mub-chat-header">
                <div class="mub-header-info">
                    <strong>MuBChatPro</strong>
                    <span>Powered by MarketingUB</span>
                </div>
                <button id="mub-close">&times;</button>
            </div>
            <div id="mub-chat-messages"></div>
            <div id="mub-typing" style="display:none">Bot is typing...</div>
            <div id="mub-popular-queries"></div>
            <div id="mub-chat-input-area">
                <input type="text" id="mub-user-input" placeholder="Type your message...">
                <button id="mub-send-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(chatContainer);

    // 3. UI Selectors
    const chatBtn = document.getElementById("mub-chat-btn");
    const chatWindow = document.getElementById("mub-chat-window");
    const closeBtn = document.getElementById("mub-close");
    const messagesArea = document.getElementById("mub-chat-messages");
    const userInput = document.getElementById("mub-user-input");
    const sendBtn = document.getElementById("mub-send-btn");
    const typingIndicator = document.getElementById("mub-typing");
    const popularArea = document.getElementById("mub-popular-queries");

    // 4. Functions
    function addMessage(text, type) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `mub-msg mub-msg-${type}`;
        msgDiv.innerText = text;
        messagesArea.appendChild(msgDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function showPopularQuestions(questions) {
        popularArea.innerHTML = "";
        questions.forEach(q => {
            const btn = document.createElement("button");
            btn.className = "mub-pop-btn";
            btn.innerText = q;
            btn.onclick = () => handleInput(q);
            popularArea.appendChild(btn);
        });
    }

    async function handleInput(text) {
        if (!text.trim()) return;
        addMessage(text, "user");
        userInput.value = "";
        popularArea.innerHTML = "";

        if (chatStep === "ask_name") {
            userName = text;
            chatStep = "ask_phone";
            addMessage(`Nice to meet you ${userName}! Please provide your phone number (or type 'SKIP').`, "bot");
            return;
        }

        if (chatStep === "ask_phone") {
            userPhone = text.toLowerCase() === "skip" ? "Not Provided" : text;
            chatStep = "active_chat";
            addMessage("Thank you! How can I help you today?", "bot");
            showPopularQuestions(["What is the price?", "How to install?", "Main features"]);
            return;
        }

        // Logic for FAQ and AI
        typingIndicator.style.display = "block";
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({
                    site: siteID,
                    name: userName,
                    phone: userPhone,
                    question: text
                })
            });
            const data = await response.json();
            typingIndicator.style.display = "none";
            addMessage(data.reply || "I'm not sure about that yet, but we will get back to you shortly.", "bot");
        } catch (err) {
            typingIndicator.style.display = "none";
            addMessage("There was an error connecting to the server.", "bot");
        }
    }

    // 5. Event Listeners
    chatBtn.onclick = () => {
        chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
        if (messagesArea.innerHTML === "") {
            addMessage("Welcome to MuBChatPro! What is your name?", "bot");
        }
    };

    closeBtn.onclick = () => chatWindow.style.display = "none";

    sendBtn.onclick = () => handleInput(userInput.value);
    userInput.onkeypress = (e) => { if (e.key === "Enter") handleInput(userInput.value); };

})();
