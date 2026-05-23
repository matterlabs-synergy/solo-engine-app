import https from 'https';

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
            result: "⚡ [VERCEL PIPELINE ONLINE]\n\n🎯 Hook 1: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n🎯 Hook 2: 'This 1 rule completely changes how you edit videos...'\n\n• Key Video Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
        }));
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'OpenAI API key missing in Vercel environmental variable settings.' }));
    }

    const apiData = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
            { 
                role: "system", 
                content: "You are an expert short-form video retention strategist (TikTok, IG Reels, YouTube Shorts). Analyze the following transcript text and extract: 1) Three viral high-conversion hook variations optimized for the first 3 seconds of a short video. 2) A punchy, bulleted breakdown of the key educational insights formatted to write text-on-screen captions. Keep vocabulary simple and highly engaging." 
            },
            { role: "user", content: `Process this text:\n\n${url}` }
        ],
        temperature: 0.7
    });

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
                        const aiOutput = parsedData.choices[0].message.content;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ result: aiOutput }));
                    } else {
                        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: parsedData.error?.message || 'OpenAI API Error' }));
                    }
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to process upstream AI text stream response.' }));
                }
                resolve();
            });
        });

        apiReq.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Network execution error: ${err.message}` }));
            resolve();
        });

        apiReq.write(apiData);
        apiReq.end();
    });
}
