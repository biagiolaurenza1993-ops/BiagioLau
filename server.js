
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Should technically be built-in but helps with compatibility if older node

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes (restrict this in production to your domain)
app.use(cors());

// Parse JSON bodies with a higher limit for base64 images
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('GlowUp Pro API is running');
});

app.post('/api/generate', async (req, res) => {
    try {
        const { model, contents, safetySettings, generationConfig } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("API Key missing in environment variables");
            return res.status(500).json({ error: 'Server configuration error: API Key missing' });
        }

        if (!model) {
            return res.status(400).json({ error: 'Model name is required' });
        }

        // Allow only specific Gemini models for security
        // Or allow all if flexible, but validation is better.
        // For now, we trust the frontend logic but ensure it points to the right Google endpoint.

        console.log(`Forwarding request for model: ${model}`);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Forward usage of raw fetch to Google
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents,
                safetySettings,
                generationConfig
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Gemini API Error:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
