export default async function handler(req, res) {
if (req.method !== 'POST') {
return res.status(405).json({ error: 'Method not allowed' });
}

const { url } = req.body;
if (!url) {
return res.status(400).json({ error: 'URL input is required.' });
}

// CREDIT-SAVING SHORTCUT PASSWORDS
if (url.toLowerCase() === 'test') {
return res.status(200).json({
result: "⚡ [CLEAN RESET SUCCESSFUL - GITHUB CLOUD COMPILATION ACTIVE]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
});
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
return res.status(500).json({ error: 'OpenAI API key missing in Netlify dashboard environment configurations.' });
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
