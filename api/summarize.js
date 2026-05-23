import https from 'https';
import { spawn } from 'child_process';
import path from 'path';

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
            result: "⚡ [AUTOMATED VIDEO PIPELINE COMPILING]\n\n🎯 Hook 1: 'Stop scrolling if you want to double your creator views...'\n\n🎬 Video Status: MoviePy automated renderer successfully initialized."
        }));
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'OpenAI API key missing.' }));
    }

    const apiData = JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are an expert short-form video retention strategist. Extract the most viral hooks and compile structured point-by-point highlights from the video transcript." },
            { role: "user", content: `Process this transcript text:\n\n${url}` }
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
                        const aiOutput = parsedData.choices.message.content;
                        
                        // NEW AUTOMATED VIDEO CHOPPING SPAWN BLOCK
                        // Spawns our custom moviepy engine script as an isolated subsystem task loop
                        const pythonProcess = spawn('python3', [path.join(process.cwd(), 'api', 'video_engine.py')]);
                        
                        const videoPayload = JSON.stringify({
                            video_url: "https://w3schools.com", // Swap to your variable
                            output_name: "/tmp/final_short.mp4",
                            start: 0.0,
                            end: 15.0
                        });

                        pythonProcess.stdin.write(videoPayload);
                        pythonProcess.stdin.end();

                        pythonProcess.on('close', (code) => {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ 
                                result: aiOutput,
                                video_compilation: code === 0 ? "Success: Video parsed to 9:16 vertical vector space asset." : "Failed to slice video binaries via local MoviePy pipeline context."
                            }));
                            resolve();
                        });

                    } else {
                        res.writeHead(apiRes.statusCode, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: parsedData.error?.message || 'OpenAI API Error' }));
                        resolve();
                    }
                } catch (e) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to process AI text stream response.' }));
                    resolve();
                }
            });
        });

        apiReq.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: `Network error: ${err.message}` }));
            resolve();
        });

        apiReq.write(apiData);
        apiReq.end();
    });
}
