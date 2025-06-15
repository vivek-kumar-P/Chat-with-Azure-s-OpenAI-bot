import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('.'));

const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/gpt-35-turbo`, // Adjusted for Azure deployment
    defaultQuery: { 'api-version': '2023-05-15' } // Using a stable version
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;
    if (!userMessage) {
        return res.json({ error: 'No message provided' });
    }
    try {
        const completion = await openai.chat.completions.create({
            model: 'gpt-35-turbo', // Confirmed deployment name
            messages: [{ role: 'user', content: userMessage }],
        });
        const botMessage = completion.choices[0].message.content;
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error:', error);
        res.json({ error: 'Failed to get response from OpenAI' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});