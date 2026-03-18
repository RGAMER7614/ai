const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// তোমার আসল API Key এখানে বসাও
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; 
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // এখানে সরাসরি 'gemini-1.5-flash' মডেল ব্যবহার করছি
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash"
        });

        // কন্টেন্ট জেনারেট করার নতুন এবং স্টেবল মেথড
        const result = await model.generateContent(userMsg);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });

    } catch (error) {
        console.error("ERROR DETECTED:", error.message);
        // ইউজারকে পরিষ্কার এরর মেসেজ পাঠানো
        res.json({ response: "গুগল এপিআই এরর: " + error.message });
    }
});

// Railway এর জন্য পোর্ট সেটআপ
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
