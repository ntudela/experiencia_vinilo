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

Dispones de la siguiente base de datos de discos en formato CSV, con columnas:
album, artist, year, decade, genres, country.
    
LISTA DE DISCOS DISPONIBLES:
${csvData}

El usuario escribirá una consulta describiendo el tipo de música que quiere para su evento: "${query}"

REGLAS ESTRICTAS:
1. SOLO puedes devolver discos que estén EXACTAMENTE en la lista de discos proporcionada.
2. NO inventes ni cambies nombres de discos, artistas o canciones.
3. Si no encuentras suficientes coincidencias, selecciona los más cercanos de la lista pero siempre desde el CSV.
4. Para cada disco elegido, selecciona entre 1 y 3 canciones relevantes **que estén listadas en el CSV para ese disco**.
5. Devuelve EXACTAMENTE 5 discos.
6. Devuelve la respuesta **únicamente** en JSON válido, con esta estructura:

{
  "results": [
    {
      "album": "Nombre exacto del álbum en la lista",
      "artist": "Nombre exacto del artista en la lista",
      "year": 2000,
      "decade": "2000s",
      "genres": "Lista de géneros exacta del CSV",
      "songs": ["Canción 1", "Canción 2", "Canción 3"]
    }
  ]
}

IMPORTANTE: Si el usuario pide algo que no esté en la lista, responde con los discos de la lista que más se acerquen a su descripción.
`;
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
    });

    const content = completion.choices[0].message.content;
    res.status(200).json(JSON.parse(content));
}
