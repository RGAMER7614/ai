const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// আপনার Groq API Key এখানে বসান
const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    try {
        const { message, history } = req.body;
        const msgLower = message.toLowerCase();

        // ১. ইউটিউব ভিডিও বা মিউজিক খোঁজার লিঙ্ক জেনারেটর
        if (msgLower.includes("গান") || msgLower.includes("video") || msgLower.includes("youtube")) {
            const query = encodeURIComponent(message);
            return res.json({ response: `ইনশাআল্লাহ ভাই, আপনার জন্য ভিডিওটি খুঁজেছি। [এখানে ক্লিক করে দেখুন](https://www.youtube.com/results?search_query=${query})` });
        }

        // ২. DuckDuckGo আনলিমিটেড সার্চ
        if (msgLower.startsWith("খুঁজো")) {
            const query = message.substring(6).trim();
            const searchRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            if (searchRes.data.AbstractText) {
                return res.json({ response: `আলহামদুলিল্লাহ ভাই, তথ্যটি পেলাম:\n\n${searchRes.data.AbstractText}\n\nসূত্র: ${searchRes.data.AbstractURL}` });
            }
        }

        // ৩. অ্যাডভান্সড চ্যাট (Groq)
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট, দেবদা ভাইয়ের একজন অত্যন্ত বুদ্ধিমান মুসলিম বন্ধু। কথা বলা শুরু করবে আসসালামু আলাইকুম দিয়ে। তুমি গণিত, প্রোগ্রামিং (HTML, CSS, JS, Flutter), এবং বিজ্ঞানে দক্ষ। সব সময় সাজিয়ে গুছিয়ে উত্তর দেবে এবং ইনশাআল্লাহ, মাশাআল্লাহ ব্যবহার করবে।" 
                    },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ response: "আসসালামু আলাইকুম ভাই, কানেকশনে সমস্যা হচ্ছে। ইনশাআল্লাহ আমি ঠিক হয়ে যাবো।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot Pro Live on ${PORT}`));
