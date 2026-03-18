const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// ১. এখানে তোমার আসল API Key বসাও
const API_KEY = "AIzaSyDLKgYZ1mXp5zLsiETmR2Nqrv2qfqqFx74"; 
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // মডেল সেটআপ
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // কন্টেন্ট জেনারেট করা
        const result = await model.generateContent(userMsg);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Error Detail:", error.message);
        // যদি এপিআই কী ভুল থাকে বা অন্য সমস্যা হয়
        res.json({ response: "গুগল এপিআই এরর: " + error.message });
    }
});

// রেলওয়ে পোর্টের জন্য
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
