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
        if (!message) return res.status(400).json({ response: "ভাই, কিছু তো লিখুন!" });

        const msgLower = message.toLowerCase();

        // ১. আনলিমিটেড ওয়েব সার্চ (DuckDuckGo)
        if (msgLower.startsWith("খুঁজো")) {
            const query = message.substring(6).trim();
            const searchRes = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`);
            const abstract = searchRes.data.AbstractText;
            if (abstract) {
                return res.json({ response: `ইন্টারনেট থেকে আপনার জন্য খুঁজেছি দেবদা ভাই:\n\n${abstract}\n\nসূত্র: ${searchRes.data.AbstractURL}` });
            }
        }

        // ২. মুসলিম এআই চ্যাট ও ম্যাথ সলভার
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট (DevBot), দেবদার একজন দ্বীনি মুসলিম বন্ধু। কথা বলার শুরুতে 'আসসালামু আলাইকুম' বলবে। কথাবার্তায় ইনশাআল্লাহ, আলহামদুলিল্লাহ ব্যবহার করবে। তুমি সব সময় সত্য কথা বলবে এবং দেবদাকে পড়াশোনায় উৎসাহিত করবে। ম্যাথ বা কোডিংয়ের ক্ষেত্রে LaTeX ব্যবহার করবে। দেবদাকে 'ভাই' বলে সম্বোধন করবে।" 
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
        res.status(500).json({ response: "আসসালামু আলাইকুম ভাই, সার্ভারে একটু সমস্যা হয়েছে। দয়া করে API Key চেক করুন।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot is live on ${PORT}`));
