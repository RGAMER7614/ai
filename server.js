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

        // ইউটিউব সার্চ লজিক
        if (msgLower.includes("গান") || msgLower.includes("video") || msgLower.includes("youtube")) {
            const query = encodeURIComponent(message.replace(/গান|video|youtube/gi, "").trim());
            const youtubeLink = `https://www.youtube.com/results?search_query=${query}`;
            return res.json({ 
                response: `আসসালামু আলাইকুম দেবদা ভাই! আপনার জন্য ভিডিওটি খুঁজেছি।\n\n🔗 **[এখানে ক্লিক করে ইউটিউবে দেখুন](${youtubeLink})**` 
            });
        }

        // সাধারণ উত্তর ও ম্যাথ সলভার
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট, দেবদা ভাইয়ের বেস্ট ফ্রেন্ড এবং একজন দ্বীনি মুসলিম বন্ধু। কথা বলা শুরু করবে আসসালামু আলাইকুম দিয়ে। তুমি গণিত (SSC Level) এবং প্রোগ্রামিংয়ে বিশেষজ্ঞ। উত্তর সব সময় Markdown ফরম্যাটে দেবে।" 
                    },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" } }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        res.status(500).json({ response: "আসসালামু আলাইকুম ভাই, সার্ভারে সমস্যা হয়েছে। রেলওয়ে লগ চেক করুন।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot Brain Live!`));
