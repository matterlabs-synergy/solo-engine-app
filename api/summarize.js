export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    let rawBody = '';
    await new Promise((resolve) => {
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', () => { resolve(); });
    });

    let body = {};
    try {
        if (rawBody) body = JSON.parse(rawBody);
    } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid JSON payload received.' }));
    }

    const { url } = body;
    if (!url) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Input text is required.' }));
    }

    if (url.toLowerCase() === 'test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            result: "⚡ [VERCEL SERVERLESS PIPELINE FULLY ACTIVE]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
        }));
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'OpenAI API key missing in Vercel environmental variable settings.' }));
    }

    try {
        const openAiResponse = await fetch('https://openai.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: "You are an AI that extracts viral hooks and key highlights from structural scripts. Return clean, professional markdown formatting." },
                    { role: "user", content: `Analyze this text transcript and provide the top hook and main highlights:\n\n${url}` }
                ],
                temperature: 0.7
            })
        });

        const data = await openAiResponse.json();

        if (openAiResponse.ok) {
            const aiOutput = data.choices.message.content;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ result: aiOutput }));
        } else {
            res.writeHead(openAiResponse.status, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: data.error?.message || 'OpenAI API Error' }));
        }

    } catch (networkError) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: `Network execution error: ${networkError.message}` }));
    }
}
