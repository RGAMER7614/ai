const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// তোমার আসল API Key এখানে বসাও
const API_KEY = "AIzaSyDLKgYZ1mXp5zLsiETmR2Nqrv2qfqqFx74"; 

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // gemini-pro মডেলটি সবথেকে স্ট্যাবল এবং v1 এন্ডপয়েন্টে ভালো কাজ করে
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                contents: [{
                    parts: [{ text: userMsg }]
                }]
            }
        );

        if (response.data && response.data.candidates) {
            const aiText = response.data.candidates[0].content.parts[0].text;
            res.json({ response: aiText });
        } else {
            res.json({ response: "বট কোনো উত্তর দিতে পারেনি।" });
        }

    } catch (error) {
        console.error("Error Detail:", error.response ? error.response.data : error.message);
        res.json({ response: "এপিআই কানেকশনে সমস্যা। আপনার এপিআই কী-টি সচল আছে কি না চেক করুন।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
