document.addEventListener("DOMContentLoaded", function() {

    // Toggle chat
    const header = document.getElementById("shopbot-header");
    const body = document.getElementById("shopbot-body");
    header.addEventListener("click", () => {
        body.style.display = body.style.display === "flex" ? "none" : "flex";
    });

    // Add messages
    function addMessage(msg, sender) {
        const container = document.getElementById("shopbot-messages");
        const div = document.createElement("div");
        div.className = sender === "user" ? "user-message" : "bot-message";
        div.innerText = msg;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }

    // Send message
    async function sendMessage() {
    const input = document.getElementById("shopbot-input");
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, "user");
    input.value = "";

    try {
        const res = await fetch(`/api/shopbot/?q=${encodeURIComponent(msg)}`);
        if (!res.ok) throw new Error("Network response not OK");

        const data = await res.json();

        // Clear any previous messages from bot for better readability
        // const container = document.getElementById("shopbot-messages");
        // container.innerHTML = '';

        if (data.products && data.products.length > 0) {
            let prodText = data.reply + "\n";
            data.products.forEach(p => {
                prodText += `- ${p.name} (${p.category})\n  Price: BDT ${p.price}\n  Stock: ${p.stock}\n  Description: ${p.description}\n\n`;
            });
            addMessage(prodText, "bot");
        } else {
            addMessage(data.reply, "bot");
        }
    } catch (err) {
        addMessage("⚠️ Something went wrong. Try again.", "bot");
        console.error(err);
    }

    }

    // Event listeners
    document.getElementById("shopbot-send-btn").addEventListener("click", sendMessage);
    document.getElementById("shopbot-input").addEventListener("keydown", e => {
        if (e.key === "Enter") sendMessage();
    });

});
