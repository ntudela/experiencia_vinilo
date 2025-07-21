import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

/**
 * ViniloCatalogApp
 * ------------------------------------------------------------
 * Interfaz minimal para explorar tu catálogo de vinilos.
 * Permite filtrar por texto + tags (Categoría, Década, Género) y
 * reproduce una preview con el embed de Spotify.
 *
 * PASOS PARA USARLO:
 * 1. Exporta la hoja de cálculo a JSON con las columnas:
 *    {
 *      "Nombre Disco", "Autor", "Categoria", "Década", "Género", "Año"
 *    }
 * 2. Publica el JSON (p. ej. en GitHub raw, Vercel o Google Drive public).
 * 3. Reemplaza URL_JSON_CATALOG abajo.
 * ------------------------------------------------------------
 */

const URL_JSON_CATALOG = "/catalogo.json"; // ⚠️ cambia por tu URL

export default function ViniloCatalogApp() {
  /* ---------- estado global ---------- */
  const [albums, setAlbums] = useState([]);
  const [query, setQuery]   = useState("");
  const [tags, setTags]     = useState({}); // {categoria:Set, decada:Set, genero:Set}
  const [active, setActive] = useState(null); // álbum activo para preview

  /* ---------- cargar catálogo JSON una vez ---------- */
  useEffect(() => {
    fetch(URL_JSON_CATALOG)
      .then(r => r.json())
      .then(data => setAlbums(data))
      .catch(console.error);
  }, []);

  /* ---------- construir opciones únicas ---------- */
  const allTags = useMemo(() => {
    const out = {categoria: new Set(), decada: new Set(), genero: new Set()};
    albums.forEach(a => {
      a.Categoria?.split(/,\s*/).forEach(t => out.categoria.add(t));
      out.decada.add(a["Década"]);
      a.Género?.split(/\s*\/\s*/).forEach(t => out.genero.add(t));
    });
    return out;
  }, [albums]);

  /* ---------- filtrado ---------- */
  const filtered = useMemo(() => {
    return albums.filter(a => {
      const txt = (a["Autor"] + " " + a["Nombre Disco"]).toLowerCase();
      if (query && !txt.includes(query.toLowerCase())) return false;
      // tags
      if (tags.categoria?.size) {
        const set = new Set(a.Categoria?.split(/,\s*/));
        if (![...tags.categoria].some(t => set.has(t))) return false;
      }
      if (tags.decada?.size && !tags.decada.has(a["Década"])) return false;
      if (tags.genero?.size) {
        const set = new Set(a.Género?.split(/\s*\/\s*/));
        if (![...tags.genero].some(t => set.has(t))) return false;
      }
      return true;
    });
  }, [albums, query, tags]);

  /* ---------- helpers ---------- */
  const toggleTag = (group, tag) => {
    setTags(prev => {
      const next = {...prev};
      next[group] = new Set(next[group] || []);
      next[group].has(tag) ? next[group].delete(tag) : next[group].add(tag);
      return {...next};
    });
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Catálogo Experiencia Vinilo</h1>

      {/* búsqueda de texto */}
      <Input
        placeholder="Buscar por artista o disco…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full md:w-1/2" />

      {/* filtros de tags */}
      <div className="space-y-3">
        {Object.entries({Categoria: "categoria", Década: "decada", Género: "genero"}).map(([label, key]) => (
          <div key={key} className="flex flex-wrap gap-2 items-center">
            <span className="font-semibold mr-2">{label}:</span>
            {[...allTags[key]].sort().map(t => (
              <Badge
                key={t}
                variant={tags[key]?.has(t) ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => toggleTag(key, t)}>
                {t}
              </Badge>
            ))}
          </div>
        ))}
      </div>

      {/* cards de álbumes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(a => (
          <motion.div key={a["Autor"]+a["Nombre Disco"]}
            layout
            initial={{opacity:0, y:10}}
            animate={{opacity:1, y:0}}
          >
            <Card onClick={() => setActive(a)} className="cursor-pointer hover:shadow-lg">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <Cover art={a} />
                <h3 className="mt-3 font-medium">{a["Nombre Disco"]}</h3>
                <p className="text-sm text-muted-foreground">{a["Autor"]}</p>
                <p className="text-xs mt-1">{a["Década"]} • {a["Género"]}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* panel de preview */}
      {active && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div initial={{scale:.8, opacity:0}} animate={{scale:1, opacity:1}} className="bg-background rounded-2xl p-6 w-[90vw] max-w-lg space-y-4 shadow-xl">
            <h2 className="text-xl font-semibold text-center">{active["Nombre Disco"]}</h2>
            <p className="text-center text-sm">{active["Autor"]} • {active["Género"]}</p>
            <Cover art={active} className="mx-auto" size={200} />
            <SpotifyEmbed album={active} />
            <Button className="w-full" onClick={() => setActive(null)}>Cerrar</Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------- */
/* COVER IMAGE (iTunes Search API)                    */
/* -------------------------------------------------- */
function Cover({art, size=120, className=""}) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    const term = encodeURIComponent(`${art["Nombre Disco"]} ${art["Autor"]}`);
    fetch(`https://itunes.apple.com/search?term=${term}&entity=album&limit=1`)
      .then(r => r.json())
      .then(json => {
        const u = json.results?.[0]?.artworkUrl100?.replace("100x100", `${size}x${size}`);
        setUrl(u);
      });
  }, [art, size]);
  return (
    <img src={url || "https://placehold.co/"+size} alt="cover" width={size} height={size} className={`rounded-lg shadow ${className}`} />
  );
}

/* -------------------------------------------------- */
/* SPOTIFY EMBED  (30‑s preview)                      */
/* -------------------------------------------------- */
function SpotifyEmbed({album}) {
  const [trackId, setTrackId] = useState(null);
  useEffect(() => {
    const q = encodeURIComponent(`${album["Nombre Disco"]} ${album["Autor"]}`);
    fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&limit=1`, {
      headers:{"User-Agent":"Mozilla"}
    })
      .then(r => r.json())
      .then(json => setTrackId(json.tracks?.items?.[0]?.id))
      .catch(()=>{});
  }, [album]);
  if (!trackId) return null;
  return (
    <iframe
      loading="lazy" className="rounded-xl w-full" height="80"
      src={`https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`} allow="encrypted-media">
    </iframe>
  );
}
