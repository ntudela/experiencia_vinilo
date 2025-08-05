document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    try {
        const res = await fetch('/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        if (!res.ok) {
            throw new Error(`Error API search: ${res.status}`);
        }

        const data = await res.json();
        await renderResults(data.results);
    } catch (err) {
        console.error("Error en búsqueda:", err);
    }
});

// Obtener token de Spotify
async function getSpotifyToken() {
    const res = await fetch('/api/spotify-token');
    if (!res.ok) {
        console.error("Error obteniendo token Spotify");
        return null;
    }
    const data = await res.json();
    return data.access_token || null;
}

// Buscar carátula y preview en Spotify
async function fetchSpotifyData(album, artist, token) {
    try {
        const query = encodeURIComponent(`${album} ${artist}`);
        const res = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return { coverUrl: null, previewUrl: null };

        const data = await res.json();
        if (data.albums.items.length > 0) {
            const coverUrl = data.albums.items[0].images[0]?.url || null;
            const albumId = data.albums.items[0].id;

            // Obtener preview de la primera pista del álbum
            const tracksRes = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=1`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            let previewUrl = null;
            if (tracksRes.ok) {
                const tracksData = await tracksRes.json();
                if (tracksData.items.length > 0) {
                    previewUrl = tracksData.items[0].preview_url || null;
                }
            }

            return { coverUrl, previewUrl };
        }
    } catch (err) {
        console.error("Error buscando datos Spotify:", err);
    }
    return { coverUrl: null, previewUrl: null };
}

// Renderizar resultados
async function renderResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';

    const token = await getSpotifyToken();

    for (const album of results) {
        let coverUrl = null;
        let previewUrl = null;

        if (token) {
            const spotifyData = await fetchSpotifyData(album.album, album.artist, token);
            coverUrl = spotifyData.coverUrl;
            previewUrl = spotifyData.previewUrl;
        }

        const card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = `
            <img src="${coverUrl || 'assets/cover-placeholder.jpg'}" alt="Cover">
            <div>
                <h3>${album.album} - ${album.artist}</h3>
                <p><strong>Año:</strong> ${album.year} | <strong>Década:</strong> ${album.decade}</p>
                <p><strong>Géneros:</strong> ${album.genres}</p>
                <ul>${album.songs.map(s => `<li>${s}</li>`).join('')}</ul>
                ${previewUrl ? `<button class="play-button" data-preview="${previewUrl}">▶️ Escuchar Preview</button>` : ''}
            </div>
        `;
        container.appendChild(card);
    }

    // Eventos para los botones de preview
    document.querySelectorAll('.play-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const url = btn.getAttribute('data-preview');
            const audio = new Audio(url);
            audio.play();
        });
    });
}
