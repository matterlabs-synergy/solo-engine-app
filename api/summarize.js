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

    // SECURE & FREE EXTRACTOR MIRROR ENGINE
    if (url.startsWith('http://') || url.startsWith('https://') || url.includes('youtube.com') || url.includes('youtu.be')) {
        try {
            let videoId = '';
            
            // Clean parsing strategy for all variations of YouTube links
            if (url.includes('youtube.com/watch')) {
                const urlParams = new URL(url).searchParams;
                videoId = urlParams.get('v');
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('://youtube.com')) {
                videoId = url.split('shorts/')[1]?.split('?')[0];
            }

            if (!videoId || videoId.length !== 11) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Could not resolve an 11-character YouTube video ID. Check link format.' }));
            }

            // Using a free open-source scraper mirror built to bypass Cloudflare and Google network walls
            const mirrorResponse = await fetch(`https://youtubetranscript.com{videoId}`);
            
            if (!mirrorResponse.ok) {
                res.writeHead(422, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'The YouTube transcript mirror is currently rate-limited. Please try again or use another video.' }));
            }

            const rawText = await mirrorResponse.text();
            
            // Extract text matching XML caption nodes securely without heavy library dependencies
            const segmentMatches = rawText.match(/text="([^"]+)"/g);
            if (!segmentMatches) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Captions are fully disabled or age-restricted on this specific video.' }));
            }

            // Combine individual text fragments into a single cohesive transcript string block
            finalPayloadText = segmentMatches
                .map(match => match.replace('text="', '').replace('"', ''))
                .join(' ')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'");

        } catch (scrapeError) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: `Transcript extraction pipeline failed: ${scrapeError.message}` }));
        }
    }

    // OPENAI COMPLETION CALL
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
            const aiOutput = data.choices[0].message.content; // Fixed standard OpenAI choices list accessor index mapping
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
