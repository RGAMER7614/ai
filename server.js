const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    try {
        const { message, history } = req.body;
        const msgLower = message.toLowerCase();

        // ইউটিউব সার্চ লজিক: লিঙ্ক সরাসরি টেক্সট হিসেবে পাঠানো হচ্ছে
        if (msgLower.includes("গান") || msgLower.includes("video") || msgLower.includes("youtube")) {
            const query = encodeURIComponent(message.replace(/গান|video|youtube/gi, "").trim());
            const youtubeLink = `https://www.youtube.com/results?search_query=${query}`;
            return res.json({ 
                response: `আসসালামু আলাইকুম ভাই! আপনার পছন্দের ভিডিওটি আমি ইউটিউবে খুঁজেছি। নিচে ক্লিক করে দেখে নিন:\n\n🔗 **[ইউটিউবে ভিডিওটি দেখুন](${youtubeLink})**` 
            });
        }

        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট, দেবদা ভাইয়ের একজন অত্যন্ত বুদ্ধিমান মুসলিম বন্ধু। কথা বলা শুরু করবে আসসালামু আলাইকুম দিয়ে। তুমি গণিত এবং প্রোগ্রামিংয়ে দক্ষ। উত্তর সব সময় সুন্দর করে সাজিয়ে এবং ক্লিকেবল লিঙ্ক ফরম্যাটে দেবে।" 
                    },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ response: "আসসালামু আলাইকুম ভাই, সার্ভারে একটু সমস্যা হয়েছে। ইনশাআল্লাহ ঠিক হয়ে যাবে।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server Live on ${PORT}`));
