const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// আপনার Groq API Key এখানে দিন
const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    try {
        const { message, history } = req.body;
        const msgLower = message.toLowerCase();

        // ইউটিউব ভিডিও বা মিউজিক খোঁজার লজিক
        if (msgLower.includes("গান") || msgLower.includes("video") || msgLower.includes("youtube")) {
            const query = encodeURIComponent(message.replace(/গান|video|youtube/gi, "").trim());
            const youtubeLink = `https://www.youtube.com/results?search_query=${query}`;
            return res.json({ 
                response: `আসসালামু আলাইকুম ভাই! আপনার ভিডিওটি খুঁজেছি। [এখানে ক্লিক করে ইউটিউবে দেখুন](${youtubeLink})` 
            });
        }

        // Groq Brain
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট (DevBot), দেবদা ভাইয়ের বেস্ট ফ্রেন্ড এবং একজন মুসলিম বন্ধু। তুমি SSC লেভেলের গণিত এবং প্রোগ্রামিংয়ে বিশেষজ্ঞ। উত্তর সব সময় সালাম দিয়ে শুরু করবে এবং Markdown ও LaTeX ফরম্যাটে সুন্দর করে সাজিয়ে দেবে।" 
                    },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ response: "সার্ভার এরর! রেলওয়ে লগ চেক করুন দেবদা।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot Brain Live!`));
