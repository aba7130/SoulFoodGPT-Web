export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    res.status(200).json({ feedback: "✅ API funktioniert! Jetzt kann GPT angebunden werden." });
}