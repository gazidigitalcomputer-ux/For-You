// Gemini API Key
const API_KEY = "AQ.Ab8RN6JZoUD53QTKKRX4e5gS9STRtvt2Rb12j37NJd2ZkIAReA"; 

// আপনার মেমোরি ও তথ্য (ভবিষ্যতে এখানে তথ্য পরিবর্তন করতে পারবেন)
const MY_BIODATA = `
আমার নাম: সাইফ (Saif)।
আমার নিজ জেলা/বাসস্থান: পটুয়াখালী (Patuakhali)।
আমার শখ/হবি (Hobbies): ফুটবল খেলা, ক্রিকেট খেলা, ফ্রি ফায়ার (Free Fire) গেম খেলা এবং বই পড়া।

আমার ব্যবসা/প্রতিষ্ঠান: কম্পিউটার দোকান ও অনলাইন সার্ভিস সেন্টার।
আমার সার্ভিসসমূহ:
- ফটো এডিটিং (পাসপোর্ট সাইজ ছবি তৈরি, ব্যাকগ্রাউন্ড চেঞ্জ, স্পট রিমুভ, রেজোলিউশন এনহ্যান্স)।
- অনলাইন সার্ভিস (ভর্তি আবেদন, চাকরির আবেদন, ডকুমেন্ট প্রসেসিং)।
- গেম স্ট্রিম ও ইউটিউব/ফেসবুক লাইভ সেটআপ (OBS Studio কাস্টমাইজেশন)।
- কম্পিউটার সফটওয়্যার ও সার্ভিসিং।
যোগাযোগ: আমার দোকানে সরাসরি আসতে পারেন অথবা অনলাইনে মেসেজ দিতে পারেন।
`;

async function sendMessage() {
    const inputField = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    const userText = inputField.value.trim();

    if (!userText) return;

    appendMessage(userText, "user");
    inputField.value = "";

    const loadingMessage = appendMessage("সাইফ চিন্তা করছে...", "bot");

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `
SYSTEM INSTRUCTIONS:
তোমার নাম "Saif"। তুমি আমার (মালিকের) পার্সোনাল এআই অ্যাসিস্ট্যান্ট।

বিশেষ নিয়ম (Greetings):
১. কেউ যদি "hi", "hello", "assalamualaikum", "সালাম", বা "আসসালামু আলাইকুম" বলে শুভেচ্ছা জানায়, তবে তুমি সরাসরি হুবহু এই উত্তরটি দেবে: 
"Hi, ami saif, bolo kivabe help korte pari?"

সাধারণ নিয়মাবলী:
২. অন্য সকল প্রশ্নের ক্ষেত্রে কাস্টমারদের সাথে সবসময় ১ম পুরুষে (First Person - যেমন: "আমার নাম সাইফ", "আমার বাসা পটুয়াখালী", "আমি এই সার্ভিস দেই") কথা বলবে।
৩. কাস্টমারের প্রশ্নের উত্তর দিতে প্রথমে নিচের "আমার বায়োডাটা ও তথ্য" ব্যবহার করবে।
৪. উত্তর সবসময় সহজ, সাবলীল ও সংক্ষিপ্ত রাখার চেষ্টা করবে।

আমার বায়োডাটা ও তথ্য:
${MY_BIODATA}

কাস্টমারের প্রশ্ন: ${userText}
                        `
                    }]
                }]
            })
        });

        const data = await response.json();
        const botReply = data.candidates[0].content.parts[0].text;
        
        loadingMessage.textContent = botReply;
    } catch (error) {
        loadingMessage.textContent = "দুঃখিত, কোনো একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।";
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