const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

// আপনার সঠিক Groq API Key এখানে বসান
const GROQ_API_KEY = "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"; 

app.post('/my-bot', async (req, res) => {
    try {
        const { message, history } = req.body;
        
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    { 
                        role: "system", 
                        content: "তুমি দেববট (DevBot), দেবদা ভাইয়ের বেস্ট ফ্রেন্ড এবং একজন মুসলিম বন্ধু। উত্তর সব সময় সালাম দিয়ে শুরু করবে। তুমি SSC গণিত এবং প্রোগ্রামিং বিশেষজ্ঞ।" 
                    },
                    ...history,
                    { role: "user", content: message }
                ]
            },
            { 
                headers: { 
                    "Authorization": `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json" 
                } 
            }
        );

        res.json({ response: response.data.choices[0].message.content });

    } catch (error) {
        console.error("Server Error Details:", error.message);
        res.status(500).json({ response: "আসসালামু আলাইকুম দেবদা ভাই, সার্ভারে একটু সমস্যা হয়েছে। দয়া করে রেলওয়ে ড্যাশবোর্ড চেক করুন।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`DevBot is running!`));
