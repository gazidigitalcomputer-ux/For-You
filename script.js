// API Keys
const OPENROUTER_API_KEY = "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";
const TAVILY_API_KEY = "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";

// বায়োডাটা ও মূল তথ্য
const MY_BIODATA = `
আমার নাম: সাইফ (Saif)।
আমার বাসা: পটুয়াখালী (Patuakhali)।
আমার শখ: ফুটবল ও ক্রিকেট খেলা, ফ্রি ফায়ার (Free Fire) গেম এবং বই পড়া।

আমার ব্যবসা: কম্পিউটার দোকান ও অনলাইন সার্ভিস সেন্টার।
আমার সার্ভিসসমূহ:
- ছবি পাসপোর্ট সাইজ করা, ব্যাকগ্রাউন্ড চেঞ্জ, স্পট রিমুভ ও রেজোলিউশন এনহ্যান্স।
- অনলাইন আবেদন (ভর্তি, চাকরি ও অফিসিয়াল ডকুমেন্টেশন)।
- ইউটিউব ও ফেসবুক লাইভ গেম স্ট্রিম সেটআপ (OBS Studio)।
- কম্পিউটার সফটওয়্যার সমাধান ও সার্ভিসিং।
`;

// Tavily মাধ্যমে ওয়েব সার্চ করার ফাংশন
async function searchWeb(query) {
    try {
        const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                api_key: TAVILY_API_KEY,
                query: query,
                search_depth: "basic",
                include_answer: true
            })
        });
        const data = await response.json();
        return data.answer || "ওয়েবে কোনো সঠিক তথ্য পাওয়া যায়নি।";
    } catch (e) {
        console.error("Search Error:", e);
        return "";
    }
}

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const userText = inputField.value.trim();

    if (!userText) return;

    appendMessage(userText, "user");
    inputField.value = "";

    const loadingMessage = appendMessage("সাইফ তথ্য খুঁজছে...", "bot");

    try {
        // সাম্প্রতিক খবর বা লাইভ ডাটার প্রশ্ন হলে Tavily সার্চ করবে
        let searchContext = "";
        const lowerText = userText.toLowerCase();
        if (lowerText.includes("আজকের") || lowerText.includes("খবর") || lowerText.includes("news") || lowerText.includes("স্কোর") || lowerText.includes("দাম")) {
            searchContext = await searchWeb(userText);
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": window.location.origin,
                "X-Title": "Saif AI Assistant"
            },
            body: JSON.stringify({
                "model": "meta-llama/llama-3.3-70b-instruct:free",
                "messages": [
                    {
                        "role": "system",
                        "content": `তুমি "Saif"। তুমি একটি পার্সোনাল এআই অ্যাসিস্ট্যান্ট।
নিয়মাবলী:
১. কেউ যদি "hi", "hello", "assalamualaikum" বলে, উত্তর দেবে: "Hi, ami saif, bolo kivabe help korte pari?"
২. সবসময় ১ম পুরুষে (যেমন: "আমার বাসা পটুয়াখালী") কথা বলবে।
৩. উত্তর সবসময় সংক্ষিপ্ত ও স্পষ্ট রাখার চেষ্টা করবে।

বায়োডাটা:
${MY_BIODATA}

ওয়েব সার্চের সাম্প্রতিক তথ্য (প্রয়োজন হলে এখান থেকে উত্তর দাও):
${searchContext}`
                    },
                    {
                        "role": "user",
                        "content": userText
                    }
                ]
            })
        });

        const data = await response.json();

        if (data.error) {
            loadingMessage.textContent = "Error: " + data.error.message;
            return;
        }

        if (data.choices && data.choices[0] && data.choices[0].message) {
            loadingMessage.textContent = data.choices[0].message.content;
        } else {
            loadingMessage.textContent = "দুঃখিত, কোনো উত্তর পাওয়া যায়নি।";
        }

    } catch (error) {
        loadingMessage.textContent = "নেটওয়ার্ক বা কানেকশনে সমস্যা হয়েছে। আবার চেষ্টা করুন।";
        console.error(error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(text, sender) {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgDiv;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}
