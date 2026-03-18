const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// ১. এখানে তোমার আসল API Key-টি বসাও (নিজে হাতে বসাও ব্রো)
const API_KEY = "AIzaSyDLKgYZ1mXp5zLsiETmR2Nqrv2qfqqFx74"; 

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // এই এন্ডপয়েন্টটি সবথেকে স্ট্যাবল
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const response = await axios.post(url, {
            contents: [{
                parts: [{ text: userMsg }]
            }]
        });

        // গুগল থেকে আসা উত্তরটি ফিল্টার করা
        if (response.data && response.data.candidates) {
            const aiText = response.data.candidates[0].content.parts[0].text;
            res.json({ response: aiText });
        } else {
            res.json({ response: "দুঃখিত, গুগল কোনো উত্তর পাঠায়নি।" });
        }

    } catch (error) {
        console.error("Detailed Error:", error.response ? error.response.data : error.message);
        res.json({ response: "কানেকশন এরর! সম্ভবত আপনার API Key-তে সমস্যা আছে।" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
