export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

// Handles text strings sent directly from the frontend fetch call
let urlInput = "";
if (typeof req.body === 'string') {
try {
const parsed = JSON.parse(req.body);
urlInput = parsed.url || "";
} catch(e) {
urlInput = req.body;
}
} else if (req.body && req.body.url) {
urlInput = req.body.url;
}

if (!urlInput) {
return res.status(400).json({ error: 'URL input is required.' });
}

// CREDIT-SAVING TEST MODE SHORTCUT
if (urlInput.toLowerCase() === 'test') {
return res.status(200).json({
result: "⚡ [CLEAN RESET SUCCESSFUL - GITHUB CLOUD COMPILATION ACTIVE]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
});
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'OpenAI API key missing in Netlify environmental variables.' });
}

try {
const aiResponse = await fetch('https://openai.com', {
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
