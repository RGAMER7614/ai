const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// তোমার Groq API Key এখানে বসাও
const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ response: "মেসেজ পাওয়া যায়নি দেবদা!" });

        const msgLower = message.toLowerCase();

        // ১. ওয়েব সার্চ (DuckDuckGo - আনলিমিটেড)
        if (msgLower.startsWith("খুঁজো")) {
            const query = message.substring(6).trim();
            const searchRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            const abstract = searchRes.data.AbstractText;
            if (abstract) {
                return res.json({ response: `ইন্টারনেট থেকে আপনার জন্য খুঁজেছি দেবদা:\n\n${abstract}\n\nসূত্র: ${searchRes.data.AbstractURL}` });
            }
        }

        // ২. সাধারণ চ্যাট ও ম্যাথ সলভার (Groq)
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "তুমি দেববট (DevBot), দেবদার বেস্ট ফ্রেন্ড। বাংলায় কথা বলো। ম্যাথ বা কোডিংয়ের ক্ষেত্রে LaTeX এবং Markdown ব্যবহার করে সুন্দর করে সাজিয়ে দাও।" },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        console.error("Error details:", error.message);
        res.status(500).json({ response: "সার্ভার এরর! দেবদা, দয়া করে Groq API Key চেক করুন।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot is running on port ${PORT}`));
