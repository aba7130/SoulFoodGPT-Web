import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { meal, mood, weight, goal, imageBase64 } = req.body;

  try {
    const prompt = `
Du bist SoulFoodGPT, ein spezialisierter Ernährungs- und Fitnesscoach für Menschen mit MS.
Analysiere die hochgeladene Mahlzeit (Foto + optionaler Beschreibung).
Liefere:
1. Liste aller erkannten Lebensmittel mit geschätzten Mengen (in g).
2. Geschätzte Nährwerte (Kalorien, Protein, Fett, Kohlenhydrate).
3. Aufteilung der Kohlenhydrate in "gute" vs. "leere" Carbs.
4. Verhältnis Omega-3 zu Omega-6 Fettsäuren.
5. Kurzes Feedback mit Verbesserungsvorschlägen.
6. Kurzer Tipp für den Tag.
    `;

    const messages = [
      { role: "system", content: "Du bist ein präziser Ernährungscoach mit Fokus auf entzündungshemmende Ernährung." },
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...(imageBase64 ? [{ type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }] : []),
          ...(meal ? [{ type: "text", text: `Beschreibung des Nutzers: ${meal}` }] : [])
        ]
      }
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini", // Vision-fähiges Modell
      messages
    });

    res.status(200).json({ feedback: completion.choices[0].message.content });

  } catch (error) {
    console.error("API-Fehler:", error);
    res.status(500).json({ error: 'Fehler bei der GPT-Bildanalyse' });
  }
}