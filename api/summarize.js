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

    let finalPayloadText = url;

    // AUTOMATED TRANSCRIPT SCRAPER PIPELINE
    if (url.startsWith('http://') || url.startsWith('https://') || url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
            // Extract the 11-character video ID from the link structure
            let videoId = '';
            if (url.includes('v=')) {
                videoId = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('shorts/')) {
                videoId = url.split('shorts/')[1]?.split('?')[0];
            }

            if (!videoId) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Could not extract a valid YouTube Video ID from the link.' }));
            }

            // Fetch clean video transcript data strings via a dedicated web scraping engine
            const scraperResponse = await fetch(`https://supadata.ai{videoId}`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            const scraperData = await scraperResponse.json();

            if (!scraperResponse.ok || !scraperData.content) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Failsafe: Video does not have any captions or transcripts enabled.' }));
            }

            finalPayloadText = scraperData.content;
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
                    { role: "system", content: "You are an AI that extracts viral hooks and key highlights from video transcripts. Return clean, formatted text structure." },
                    { role: "user", content: `Analyze this transcript text and output the top hook and main highlights:\n\n${finalPayloadText}` }
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
