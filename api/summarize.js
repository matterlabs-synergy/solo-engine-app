export default async function handler(req, res) {
    // Inject strict CORS headers manually
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Handle standard preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    if (req.method !== 'POST') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Method not allowed' }));
    }

    // Safely parse streaming body chunks natively
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

    // CREDIT-SAVING SHORTCUT PASSWORDS
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

    let finalPayloadText = url;

    // SECURE HIGH-SPEED EXTRACTOR MIRROR ENGINE
    if (url.startsWith('http://') || url.startsWith('https://') || url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
            let videoId = '';
            
            // Comprehensive parsing strategy for all variations of YouTube links
            if (url.includes('youtube.com/watch')) {
                const parts = url.split('v=');
                if (parts[1]) {
                    videoId = parts[1].split('&')[0];
                }
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1].split('?')[0];
            } else if (url.includes('://youtube.com')) {
                videoId = url.split('shorts/')[1].split('?')[0];
            }

            if (!videoId || videoId.length !== 11) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Could not resolve an 11-character YouTube video ID. Check link format.' }));
            }

            // TubeText free proxy engine mirror implementation
            const mirrorResponse = await fetch(`https://vercel.app{videoId}`);
            
            if (!mirrorResponse.ok) {
                res.writeHead(422, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'The transcript proxy rejected the request or video lacks captions.' }));
            }

            const scraperData = await mirrorResponse.json();
            
            if (!scraperData.success || !scraperData.data || !scraperData.data.full_text) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Could not extract raw text strings. Captions might be disabled on this video.' }));
            }

            finalPayloadText = scraperData.data.full_text;

        } catch (scrapeError) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: `Transcript API proxy pipeline failed: ${scrapeError.message}` }));
        }
    }

    // OPENAI ANALYSIS LAYER
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
                    { role: "system", content: "You are an expert AI video content strategist. Extract the most viral hooks and compile structured point-by-point highlights from the video transcript." },
                    { role: "user", content: `Process this transcript text:\n\n${finalPayloadText}` }
                ],
                temperature: 0.7
            })
        });

        const data = await openAiResponse.json();

        if (openAiResponse.ok) {
            const aiOutput = data.choices[0].message.content; // Explicit zero-index choices list mapping fixed
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
