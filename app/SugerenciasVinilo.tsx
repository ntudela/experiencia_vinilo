import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const catalogo = [
  {
    artista: "Queen",
    disco: "Greatest Hits",
    genero: "Rock Clásico",
    decada: "1970 - 1980",
    canciones: ["Bohemian Rhapsody", "Another One Bites the Dust", "Don't Stop Me Now"]
  },
  {
    artista: "Daft Punk",
    disco: "Discovery",
    genero: "Electrónica",
    decada: "1990 - 2000",
    canciones: ["One More Time", "Harder, Better, Faster, Stronger", "Digital Love"]
  },
  {
    artista: "Amy Winehouse",
    disco: "Back to Black",
    genero: "Soul / R&B",
    decada: "2000 - 2010",
    canciones: ["Rehab", "You Know I'm No Good", "Back to Black"]
  }
];

export default function SugerenciasVinilo() {
  const [requerimiento, setRequerimiento] = useState('');
  const [sugerencias, setSugerencias] = useState([]);

  const sugerir = () => {
    const match = catalogo.filter(item => requerimiento.toLowerCase().includes(item.genero.toLowerCase()) || requerimiento.includes(item.decada.split(" - ")[0]));
    setSugerencias(match.length ? match : catalogo.slice(0, 1));
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">¿Qué música estás buscando?</h1>
      <Input 
        placeholder="Ej: Música alegre de los 2000s o algo tipo soul" 
        value={requerimiento} 
        onChange={e => setRequerimiento(e.target.value)}
      />
      <Button onClick={sugerir}>Sugerir discos</Button>

      {sugerencias.length > 0 && (
        <div className="space-y-4">
          {sugerencias.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold">{item.artista} - {item.disco}</h2>
                <p><strong>Género:</strong> {item.genero}</p>
                <p><strong>Década:</strong> {item.decada}</p>
                <p><strong>Canciones:</strong> {item.canciones.join(", ")}</p>
                <a 
                  href="https://instagram.com/experiencia_vinilo" 
                  target="_blank"
                  className="text-purple-700 underline"
                >
                  Cotizar por Instagram
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
