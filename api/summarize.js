const https = require('https');

module.exports = async (req, res) => {
// Inject headers to allow seamless data transfer between devices
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

if (req.method === 'OPTIONS') return res.status(204).end();
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

const { url } = req.body;
if (!url) return res.status(400).json({ error: 'Input text is required.' });

// CREDIT-SAVING SHORTCUT PASSWORDS
if (url.toLowerCase() === 'test') {
return res.status(200).json({
result: "⚡ [VERCEL SERVERLESS PIPELINE FULLY ACTIVE]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
});
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) return res.status(500).json({ error: 'OpenAI API key missing in Vercel environmental variable settings.' });

// SAFETY CHECK: If a user pastes a raw web link, let the system handle it securely
let finalPayloadText = url;
if (url.startsWith('http://') {https://')) {
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
{
