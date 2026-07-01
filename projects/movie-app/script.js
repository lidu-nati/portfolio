const movieInput = document.getElementById('movieInput');
const searchBtn = document.getElementById('searchBtn');
const movieResult = document.getElementById('movieResult');

const movieData = {
    'inception': { title: 'Inception', year: '2010', rating: '8.8', poster: '🎬', plot: 'Dream thief steals secrets.' },
    'matrix': { title: 'The Matrix', year: '1999', rating: '8.7', poster: '💊', plot: 'Reality is a simulation.' },
    'avatar': { title: 'Avatar', year: '2009', rating: '7.9', poster: '🌌', plot: 'Journey to Pandora.' },
    'titanic': { title: 'Titanic', year: '1997', rating: '7.9', poster: '🚢', plot: 'Love on a sinking ship.' }
};

function searchMovie() {
    const query = movieInput.value.trim().toLowerCase();
    
    if (!query) {
        movieResult.innerHTML = '<div class="error">⚠️ Enter a movie name!</div>';
        return;
    }
    
    const movie = movieData[query];
    
    if (movie) {
        movieResult.innerHTML = `
            <div class="movie-poster">${movie.poster}</div>
            <h2 class="movie-title">${movie.title}</h2>
            <div class="movie-year">📅 ${movie.year}</div>
            <div class="movie-rating">⭐ ${movie.rating}/10</div>
            <p>${movie.plot}</p>
        `;
    } else {
        movieResult.innerHTML = '<div class="error">❌ Movie not found! Try: Inception, Matrix, Avatar, Titanic</div>';
    }
}

searchBtn.addEventListener('click', searchMovie);
movieInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchMovie();
});
