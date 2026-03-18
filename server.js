const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// তোমার Groq API Key এখানে বসাও
const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেবদার (Devda) পার্সোনাল এআই অ্যাসিস্ট্যান্ট। তোমার নাম দেববট (DevBot)। তুমি সব সময় বন্ধুর মতো করে সুন্দর বাংলায় কথা বলবে।" 
                    },
                    { role: "user", content: userMsg }
                ]
            },
            {
                headers: {
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const aiText = response.data.choices[0].message.content;
        res.json({ response: aiText });

    } catch (error) {
        console.error("Error Detail:", error.response ? error.response.data : error.message);
        res.json({ response: "সার্ভার এখন ব্যস্ত, আবার চেষ্টা করুন।" });
    }
});

// সার্ভার রানিং চেক করার জন্য
app.get('/', (req, res) => res.send("DevBot Server is Running!"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is LIVE on port ${PORT}`);
});
