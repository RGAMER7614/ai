const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

// তোমার আসল API Key এখানে বসাও
const API_KEY = "AIzaSyDLKgYZ1mXp5zLsiETmR2Nqrv2qfqqFx74"; 
const genAI = new GoogleGenerativeAI(API_KEY);

app.post('/my-bot', async (req, res) => {
    const userMsg = req.body.message;
    
    try {
        // মডেল ডিক্লেয়ার করার সময় সরাসরি 'gemini-1.5-flash' ব্যবহার করো
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash" 
        });

        // কন্টেন্ট জেনারেট করার জন্য এই মেথডটি এখন স্ট্যাবল
        const result = await model.generateContent(userMsg);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error("Error Detail:", error.message);
        res.json({ response: "গুগল এপিআই এরর: " + error.message });
    }
});

// Railway এর জন্য পোর্ট এবং হোস্ট সেটআপ
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
