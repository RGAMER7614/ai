const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ১. এখানে তোমার আসল API Key বসাও
const API_KEY = "AIzaSyDLKgYZ1mXp5zLsiETmR2Nqrv2qfqqFx74"; 

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // সরাসরি গুগল এপিআই এন্ডপয়েন্টে রিকোয়েস্ট পাঠানো হচ্ছে
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
            {
                contents: [{
                    parts: [{ text: userMsg }]
                }]
            }
        );

        // উত্তরটি ফিল্টার করে বের করা
        const aiText = response.data.candidates[0].content.parts[0].text;
        res.json({ response: aiText });

    } catch (error) {
        console.error("Error Detail:", error.response ? error.response.data : error.message);
        res.json({ response: "সরাসরি এপিআই কানেকশনে সমস্যা: " + (error.response ? error.response.data.error.message : error.message) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
