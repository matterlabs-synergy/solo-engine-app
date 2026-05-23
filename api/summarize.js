// Using the built-in https module prevents runtime crash errors on the cloud server
const https = require('https');

module.exports = async (req, res) => {
// Inject headers to allow seamless data transfer between files
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

if (req.method === 'OPTIONS') {
return res.status(204).end();
}

if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

const { url } = req.body;
if (!url) {
return res.status(400).json({ error: 'URL input is required.' });
}

// CREDIT-SAVING TEST MODE SHORTCUT
if (url.toLowerCase() === 'test') {
return res.status(200).json({
result: "⚡ [VERCEL SERVERLESS PIPELINE ACTIVE - ZERO COMPILATION BLOCKS]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
});
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'OpenAI API key missing in Vercel settings.' });
}

// Prepare the exact payload formatting for the OpenAI network matrix
const postData = JSON.stringify({
model: 'gpt-4o-mini',
messages: [
{ role: 'system', content: 'You are an elite content engineer. Provide the single best attention-grabbing hook and a clean 3-bullet point breakdown.' },
{ role: 'user', content: `Analyze this material: ${url}` }
],
temperature: 0.7
});

const options = {
hostname: '://openai.com',
port: 443,
path: '/v1/chat/completions',
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${apiKey}`,
'Content-Length': Buffer.byteLength(postData)
}
};

// Execute the direct secure connection request channel
const request = https.request(options, (response) => {
let dataStr = '';
response.on('data', (chunk) => { dataStr += chunk; });
response.on('end', () => {
try {
const parsedData = JSON.parse(dataStr);
if (parsedData.error) {
return res.status(500).json({ error: parsedData.error.message });
}
return res.status(200).json({ result: parsedData.choices[0].message.content });
} catch (error) {
return res.status(500).json({ error: 'Failed to process data from the AI matrix.' });
}
});
});

request.on('error', (error) => {
return res.status(500).json({ error: 'Network transmission failure to OpenAI.' });
});

request.write(postData);
request.end();
};
