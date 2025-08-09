import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { meal, mood, weight, goal } = req.body;

  try {
    const prompt = `
Du bist SoulFoodGPT, ein Gesundheits- und Fitness-Coach für Menschen mit MS.
Analysiere die folgende Eingabe und gib kurzes, strukturiertes Feedback.

Mahlzeit: ${meal || "keine Angabe"}
Stimmung: ${mood || "keine Angabe"}
Gewicht: ${weight || "keine Angabe"} kg
Ziel: ${goal || "keine Angabe"}

Format:
✅ Positives Feedback
⚠️ Verbesserungsvorschläge
💡 Tipp des Tages
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Du bist ein einfühlsamer Ernährungs- und Fitnesscoach, spezialisiert auf MS und entzündungshemmende Ernährung." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    const feedback = completion.choices[0].message.content;
    res.status(200).json({ feedback });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Fehler bei der Analyse' });
  }
}