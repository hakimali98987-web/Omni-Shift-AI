// Vercel serverless function – proxy to Railway
export default async function handler(req, res) {
  const targetUrl = 'https://omni-shift-ai-api-production.up.railway.app/api/categories';
  try {
    const response = await fetch(targetUrl);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy failed' });
  }
}
