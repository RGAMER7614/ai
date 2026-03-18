const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// ১. এখানে তোমার নিজের API Key বসাও
const API_KEY = "AIzaSyDLKgYZ1mXp5zLsiETmR2Nqrv2qfqqFx74"; 
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // সরাসরি মডেলটির নাম ব্যবহার করা হচ্ছে যা 'v1beta' এর ঝামেলা মুক্ত
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(userMsg);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Critical Error:", error.message);
        // ইউজারকে সহজ ভাষায় এরর জানানো
        res.status(500).json({ response: "দুঃখিত দেবদা, গুগল এপিআই কানেকশনে সমস্যা হচ্ছে। দয়া করে আপনার API Key চেক করুন।" });
    }
});

// Railway এর জন্য পোর্ট কনফিগারেশন
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Brain is running on port ${PORT}`);
});
