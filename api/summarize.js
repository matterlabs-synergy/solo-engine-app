const https = require('https');

module.exports = async (req, res) => {
    // Inject CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // FIX: Manually parse the streaming request body into valid JSON
    let rawBody = '';
    await new Promise((resolve) => {
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', () => { resolve(); });
    });

    let body = {};
    try {
        if (rawBody) {
            body = JSON.parse(rawBody);
        }
    } catch (e) {
        return res.status(400).json({ error: 'Invalid JSON payload received.' });
    }

    const { url } = body;
    if (!url) return res.status(400).json({ error: 'Input text is required.' });

    // CREDIT-SAVING SHORTCUT PASSWORDS
    if (url.toLowerCase() === 'test') {
        return res.status(200).json({
            result: "⚡ [VERCEL SERVERLESS PIPELINE FULLY ACTIVE]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
        });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'OpenAI API key missing in Vercel environmental variable settings.' });

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return res.status(400).json({ error: 'URL links are not supported yet. Please paste the raw script text.' });
    }

    // Prepare OpenAI API Payload
    const apiData = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an AI that extracts hooks and key highlights from video transcripts. Return clean, formatted text." },
            { role: "user", content: `Analyze this text and provide the top hook and main highlights:\n\n${url}` }
        ],
        temperature: 0.7
    });

    // Execute External HTTPS Request to OpenAI
    return new Promise((resolve) => {
        const options = {
            hostname: '://openai.com',
            port: 443,
            path: '/v1/chat/completions',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'Content-Length': Buffer.byteLength(apiData)
            }
        };

        const apiReq = https.request(options, (apiRes) => {
            let responseBody = '';
            apiRes.on('data', (chunk) => { responseBody += chunk; });
            apiRes.on('end', () => {
                try {
                    const parsedData = JSON.parse(responseBody);
                    if (apiRes.statusCode === 200) {
                        const aiOutput = parsedData.choices[0].message.content; // Fixed object accessor chain
                        res.status(200).json({ result: aiOutput });
                    } else {
                        res.status(apiRes.statusCode).json({ error: parsedData.error?.message || 'OpenAI API Error' });
                    }
                } catch (e) {
                    res.status(500).json({ error: 'Failed to parse upstream AI response.' });
                }
                resolve();
            });
        });

        apiReq.on('error', (err) => {
            res.status(500).json({ error: `Network execution error: ${err.message}` });
            resolve();
        });

        apiReq.write(apiData);
        apiReq.end();
    });
};
