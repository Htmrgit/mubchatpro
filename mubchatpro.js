(function() {
    // 1. Configuration
    const API_URL = "https://script.google.com/macros/s/AKfycbyS5Ow_FZMgsluQUDKiYf2Nzz9odewnSj-U2zQfAmVT7c84HO2FpL1KQ2dZJBim6d6mSg/exec";
    const siteID = document.currentScript.dataset.site || "Business";
    const displaySiteName = siteID.charAt(0).toUpperCase() + siteID.slice(1);
    
    let userName = "";
    let userPhone = "";
    let chatStep = "ask_name"; 

    // 2. Create UI Wrapper
    const wrapper = document.createElement("div");
    wrapper.id = "mub-chat-wrapper";
    wrapper.innerHTML = `
        <div id="mub-chat-btn">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <div id="mub-chat-window">
            <div id="mub-chat-header">
                <div class="mub-info">
                    <strong>${displaySiteName} Support</strong>
                    <span id="mub-status">Online</span>
                </div>
                <button id="mub-close-btn">&times;</button>
            </div>
            <div id="mub-messages-container"></div>
            <div id="mub-typing-indicator" style="display:none">Bot is thinking...</div>
            <div id="mub-queries-suggestions"></div>
            <div id="mub-input-footer">
                <input type="text" id="mub-input-field" placeholder="Ask a question...">
                <button id="mub-send-trigger">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
            <div id="mub-branding-footer">
                MuBChatPro <span>Powered by MarketingUB</span>
            </div>
        </div>
    `;
    document.body.appendChild(wrapper);

    // Selectors
    const chatBtn = document.getElementById("mub-chat-btn");
    const chatWindow = document.getElementById("mub-chat-window");
    const messagesArea = document.getElementById("mub-messages-container");
    const inputField = document.getElementById("mub-input-field");
    const sendBtn = document.getElementById("mub-send-trigger");
    const suggestionsArea = document.getElementById("mub-queries-suggestions");

    function pushMsg(text, type) {
        const div = document.createElement("div");
        div.className = `mub-chat-bubble mub-type-${type}`;
        div.innerText = text;
        messagesArea.appendChild(div);
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function pushSuggestions(list) {
        suggestionsArea.innerHTML = "";
        list.forEach(q => {
            const b = document.createElement("button");
            b.innerText = q;
            b.onclick = () => processInput(q);
            suggestionsArea.appendChild(b);
        });
    }

    async function processInput(val) {
        if (!val.trim()) return;
        pushMsg(val, "user");
        inputField.value = "";
        suggestionsArea.innerHTML = "";

        if (chatStep === "ask_name") {
            userName = val;
            chatStep = "ask_phone";
            pushMsg(`Nice to meet you ${userName}! Please share your phone number so we can reach out, or type 'SKIP'.`, "bot");
            return;
        }

        if (chatStep === "ask_phone") {
            userPhone = val.toLowerCase() === 'skip' ? 'Not Shared' : val;
            chatStep = "active";
            pushMsg(`Thanks! How can I help you today?`, "bot");
            pushSuggestions(["Pricing", "Features", "Installation"]);
            return;
        }

        document.getElementById("mub-typing-indicator").style.display = "block";
        try {
            const res = await fetch(API_URL, {
                method: "POST",
                body: JSON.stringify({ site: siteID, name: userName, phone: userPhone, question: val })
            });
            const data = await res.json();
            document.getElementById("mub-typing-indicator").style.display = "none";
            pushMsg(data.reply || "I'm looking into that. One of our experts will get back to you!", "bot");
        } catch (e) {
            document.getElementById("mub-typing-indicator").style.display = "none";
            pushMsg("Connection error. Please try again later.", "error");
        }
    }

    chatBtn.onclick = () => {
        chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
        if (messagesArea.innerHTML === "") pushMsg(`Hello! Welcome to ${displaySiteName}. What is your name?`, "bot");
    };
    document.getElementById("mub-close-btn").onclick = () => chatWindow.style.display = "none";
    sendBtn.onclick = () => processInput(inputField.value);
    inputField.onkeypress = (e) => { if (e.key === "Enter") processInput(inputField.value); };

})();
