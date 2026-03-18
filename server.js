const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { exec } = require('child_process');
const app = express();

app.use(cors());
app.use(express.json());

// তোমার Groq API Key এখানে বসাও
const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    const { message, history } = req.body;
    const msgLower = message.toLowerCase();

    // ১. পিসি কমান্ড (PC Command)
    if (msgLower.includes("ওপেন ক্যালকুলেটর")) {
        exec('calc', (err) => {
            if (err) return res.json({ response: "ক্যালকুলেটর ওপেন করা গেল না দেবদা।" });
        });
        return res.json({ response: "জি দেবদা, ক্যালকুলেটর ওপেন করছি!" });
    }

    // ২. আনলিমিটেড ফ্রি ওয়েব সার্চ (DuckDuckGo)
    if (msgLower.startsWith("খুঁজো")) {
        const query = message.substring(6).trim();
        try {
            const searchRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            const abstract = searchRes.data.AbstractText;
            const url = searchRes.data.AbstractURL;

            if (abstract) {
                return res.json({ response: `ইন্টারনেট থেকে আপনার জন্য খুঁজেছি দেবদা:\n\n${abstract}\n\nআরও দেখুন: ${url}` });
            } else {
                return res.json({ response: "দুঃখিত দেবদা, এই বিষয়ে সরাসরি কোনো তথ্য পেলাম না। অন্য কিছু লিখে চেষ্টা করুন।" });
            }
        } catch (error) {
            return res.json({ response: "সার্চ করার সময় একটু সমস্যা হয়েছে ব্রো।" });
        }
    }

    // ৩. সাধারণ চ্যাট (Groq AI)
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "তুমি দেববট (DevBot), দেবদার বেস্ট ফ্রেন্ড। তুমি সব সময় বাংলায় কথা বলো।" },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        res.json({ response: "সার্ভার এরর! রেলওয়ে লগ চেক করুন দেবদা।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot Live on ${PORT}`));
