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
        if (!message) return res.status(400).json({ response: "ভাই, কিছু তো লিখুন!" });

        const msgLower = message.toLowerCase();

        // ১. স্মার্ট ইউটিউব সার্চ লজিক
        if (msgLower.includes("গান") || msgLower.includes("video") || msgLower.includes("youtube")) {
            const query = encodeURIComponent(message.replace(/গান|video|youtube/gi, "").trim());
            const youtubeLink = `https://www.youtube.com/results?search_query=${query}`;
            return res.json({ 
                response: `আসসালামু আলাইকুম দেবদা ভাই! আপনার জন্য ভিডিওটি খুঁজেছি। নিচের লিঙ্কে ক্লিক করে সরাসরি ইউটিউবে দেখে নিন:\n\n🔗 **[ভিডিওটি দেখতে এখানে ক্লিক করুন](${youtubeLink})**` 
            });
        }

        // ২. অ্যাডভান্সড ব্রেইন (মুসলিম ফ্রেন্ড পারসোনা)
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট (DevBot), দেবদা ভাইয়ের বেস্ট ফ্রেন্ড এবং একজন দ্বীনি মুসলিম বন্ধু। কথা বলা শুরু করবে আসসালামু আলাইকুম দিয়ে। তুমি গণিত (SSC Level), প্রোগ্রামিং (HTML, JS, Flutter) এবং সায়েন্সে বিশেষজ্ঞ। উত্তর সব সময় Markdown এবং LaTeX ফরম্যাটে সাজিয়ে দেবে যাতে সুন্দর দেখায়। দেবদাকে সব সময় পড়াশোনায় উৎসাহ দেবে।" 
                    },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ response: "আসসালামু আলাইকুম ভাই, সার্ভারে একটু জ্যাম লেগেছে। ইনশাআল্লাহ আমি ঠিক হয়ে আসছি!" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot Advance Brain Live!`));
