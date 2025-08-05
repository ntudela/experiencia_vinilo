import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const { query } = req.body;
    const csvPath = path.join(process.cwd(), 'albums-sample.csv');
    const csvData = fs.readFileSync(csvPath, 'utf-8');

    const prompt = `
Eres un recomendador experto en música para eventos. 
Tienes la siguiente lista de discos en formato CSV:
${csvData}

El usuario escribe: "${query}"

Debes devolver EXACTAMENTE un JSON con un array llamado "results" que contenga 5 objetos, 
cada uno con: album, artist, year, decade, genres, songs (array con 1 a 3 canciones relevantes). 
Selecciona los discos que mejor coincidan con la descripción del usuario, considerando década, género, estilo y ambiente.
`;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    res.status(200).json(JSON.parse(content));
}
