export default async function handler(req, res) {
// Basic CORS header injection to allow network calls from your frontend
const headers = {
'Access-Control-Allow-Origin': '*',
'Access-Control-Allow-Headers': 'Content-Type',
'Access-Control-Allow-Methods': 'POST, OPTIONS',
'Content-Type': 'application/json'
};

if (req.method === 'OPTIONS') {
return new Response(null, { status: 204, headers });
}

if (req.method !== 'POST') {
return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
}

try {
// Reads incoming text fields regardless of how the browser packages the text
const bodyText = await req.text();
let urlInput = "";
try {
const parsed = JSON.parse(bodyText);
urlInput = parsed.url || "";
} catch (e) {
urlInput = bodyText;
}

if (!urlInput) {
return new Response(JSON.stringify({ error: 'URL input is required.' }), { status: 400, headers });
}

// CREDIT-SAVING TEST MODE SHORTCUT
if (urlInput.toLowerCase() === 'test') {
return new Response(JSON.stringify({
result: "⚡ [RESET SUCCESSFUL - GITHUB CLOUD PIPELINE OPERATIONAL]\n\n🎯 Top Hook: 'Stop scrolling if you want to double your creator views using this one simple hack...'\n\n• Highlights:\n- Consistently post high-quality shorts\n- Target a highly specific audience niche\n- Focus heavily on visual hooks"
}), { status: 200, headers });
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
return new Response(JSON.stringify({ error: 'OpenAI API key missing in Netlify environmental variables.' }), { status: 500, headers });
}

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
{
{
{
