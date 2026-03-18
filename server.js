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
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(userMsg);
        const response = await result.response;
        res.json({ response: response.text() });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ response: "সার্ভার এরর: " + error.message });
    }
});

// ২. Railway এর জন্য এই পোর্ট সেটআপ জরুরি
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Brain is LIVE on port ${PORT}`);
});
