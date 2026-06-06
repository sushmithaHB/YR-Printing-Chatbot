
let order = {
    service: "",
    size: "",
    quantity: "",
    delivery: ""
};

let step = 0;

/* =========================
   START CHAT
========================= */
function startChat(service) {

    order.service = service;
    step = 1;

    addMessage("You selected: " + service, "user");

    setTimeout(() => {
        addMessage("📏 Enter size (example: 6x4 ft)", "bot");
    }, 300);
}

/* =========================
   SEND MESSAGE
========================= */
function sendMessage() {

    let input = document.getElementById("userInput");
    let msg = input.value.trim();

    if (!msg) return;

    handleReply(msg);

    input.value = "";
}

/* =========================
   CHAT FLOW HANDLER
========================= */
function handleReply(msg) {

    addMessage(msg, "user");

    if (step === 1) {

        order.size = msg;
        step = 2;

        setTimeout(() => {
            addMessage("🔢 Enter quantity", "bot");
        }, 300);
    }

    else if (step === 2) {

        order.quantity = msg;
        step = 3;

        setTimeout(() => {
            addMessage("📅 Enter delivery time", "bot");
        }, 300);
    }

    else if (step === 3) {

        order.delivery = msg;
        step = 4;

        setTimeout(() => {
            addMessage("📎 Upload file if needed, then opening WhatsApp...", "bot");
            openWhatsApp();
        }, 500);
    }
}

/* =========================
   WHATSAPP + FILE UPLOAD
========================= */
async function openWhatsApp() {

    let phone = "916361004454";

    let fileInput = document.getElementById("fileInput");

    let fileUrl = "";
    let fileName = "";

    // UPLOAD FILE TO BACKEND
    if (fileInput && fileInput.files.length > 0) {

        fileName = fileInput.files[0].name;

        let formData = new FormData();
        formData.append("file", fileInput.files[0]);

        try {

            let res = await fetch("http://127.0.0.1:5000/upload", {
                method: "POST",
                body: formData
            });

            let data = await res.json();

            fileUrl = data.fileUrl || "";

        } catch (err) {
            fileUrl = "";
        }
    }

    // WHATSAPP MESSAGE
    let message = `
🖨️ New Printing Order

📌 Service: ${order.service}
📏 Size: ${order.size}
🔢 Quantity: ${order.quantity}
📅 Delivery: ${order.delivery}

📎 File Name: ${fileName || "No file"}
🔗 File Link: ${fileUrl || "No file uploaded"}

👉 Please confirm price and time.
`;

    let url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}

/* =========================
   CHAT UI
========================= */
function addMessage(text, type) {

    let chat = document.getElementById("chat-box");

    let div = document.createElement("div");

    div.className = type === "user" ? "user" : "bot";

    div.innerText = text;

    chat.appendChild(div);

    chat.scrollTop = chat.scrollHeight;
}