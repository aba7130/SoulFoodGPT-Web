export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { meal, mood, weight, goal } = req.body;

    let feedback = `📊 <strong>Analyse</strong><br>`;
    feedback += `- Mahlzeit: ${meal || 'Keine Eingabe'}<br>`;
    feedback += `- Stimmung: ${mood || 'Keine Angabe'}<br>`;
    feedback += `- Gewicht: ${weight || 'Keine Angabe'} kg<br>`;
    feedback += `- Ziel: ${goal || 'Keine Angabe'}<br><br>`;

    if (meal && meal.toLowerCase().includes("lachs")) {
        feedback += `✅ Gut: Omega-3-Fette wirken entzündungshemmend.<br>`;
    } else {
        feedback += `💡 Tipp: Mehr Omega-3-haltige Lebensmittel (z. B. Lachs, Walnüsse, Leinsamen).<br>`;
    }

    if (goal === "Muskelaufbau") {
        feedback += `⚠️ Verbesserung: Achte auf genug Proteinquellen wie Huhn, Quark oder Hülsenfrüchte.<br>`;
    }

    res.status(200).json({ feedback });
}