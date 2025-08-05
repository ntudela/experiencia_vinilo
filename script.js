document.getElementById('searchBtn').addEventListener('click', async () => {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });
    const data = await res.json();
    renderResults(data.results);
});

function renderResults(results) {
    const container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    results.forEach(album => {
        const card = document.createElement('div');
        card.className = 'album-card';
        card.innerHTML = `
            <img src="${album.cover || 'assets/cover-placeholder.jpg'}" alt="Cover">
            <div>
                <h3>${album.album} - ${album.artist}</h3>
                <p><strong>Año:</strong> ${album.year} | <strong>Década:</strong> ${album.decade}</p>
                <p><strong>Géneros:</strong> ${album.genres}</p>
                <ul>${album.songs.map(s => `<li>${s}</li>`).join('')}</ul>
            </div>
        `;
        container.appendChild(card);
    });
}
