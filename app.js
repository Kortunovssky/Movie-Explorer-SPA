// app.js
class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentRoute = null;
        window.addEventListener('popstate', () => this.loadRoute());
        this.loadRoute();
    }

    navigate(path) {
        window.history.pushState({}, '', path);
        this.loadRoute();
    }

    loadRoute() {
        const path = window.location.pathname;
        const route = this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
        this.currentRoute = route;
        route.component();
    }
}

const state = new AppState();
const api = new MovieAPI();

function handleSearch(event) {
    state.setSearchQuery(event.target.value);
    router.loadRoute();
}

function handleSortChange(event) {
    state.setSortOption(event.target.value);
    router.loadRoute();
}

function handleGenreChange(event) {
    state.setFilterGenre(event.target.value);
    router.loadRoute();
}

async function toggleFavorite(movieId) {
    // Note: Since real API, need to fetch movie details if not full
    let movie = state.favorites.find(m => m.id === movieId);
    if (!movie) {
        // Fetch movie if not in favorites
        const response = await fetch(`${api.baseURL}/movie/${movieId}?api_key=${api.apiKey}&language=ru-RU`);
        const data = await response.json();
        movie = {
            id: data.id,
            title: data.title,
            year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
            rating: data.vote_average.toFixed(1),
            genre: data.genres ? data.genres.map(g => g.name).join(', ') : 'N/A',
            description: data.overview,
            poster: data.poster_path ? `${api.imageBaseURL}/w500${data.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'
        };
    }

    if (state.isFavorite(movieId)) {
        state.removeFavorite(movieId);
    } else {
        state.addFavorite(movie);
    }
    router.loadRoute();
}

async function showMovieDetails(movieId) {
    // Fetch full movie details
    const response = await fetch(`${api.baseURL}/movie/${movieId}?api_key=${api.apiKey}&language=ru-RU`);
    const data = await response.json();
    const movie = {
        id: data.id,
        title: data.title,
        year: data.release_date ? data.release_date.split('-')[0] : 'N/A',
        rating: data.vote_average.toFixed(1),
        genre: data.genres ? data.genres.map(g => g.name).join(', ') : 'N/A',
        description: data.overview,
        poster: data.poster_path ? `${api.imageBaseURL}/w500${data.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'
    };
    state.setSelectedMovie(movie);
    render();
}

function closeModal(event) {
    if (event.target.classList.contains('modal-backdrop')) {
        state.setSelectedMovie(null);
        render();
    }
}

async function render() {
    router.loadRoute();
}

const routes = [
    { path: '/', component: HomePage },
    { path: '/trending', component: TrendingPage },
    { path: '/library', component: LibraryPage },
    { path: '/favorites', component: FavoritesPage }
];

const router = new Router(routes);

state.subscribe(async () => {
    if (state.selectedMovie) {
        const existingModal = document.querySelector('.modal-backdrop');
        if (existingModal) {
            existingModal.remove();
        }
        document.getElementById('app').insertAdjacentHTML('beforeend', await MovieModal(state.selectedMovie));
    }
});

// Global functions
window.router = router;
window.handleSearch = handleSearch;
window.handleSortChange = handleSortChange;
window.handleGenreChange = handleGenreChange;
window.toggleFavorite = toggleFavorite;
window.showMovieDetails = showMovieDetails;
window.closeModal = closeModal;
window.state = state;
window.render = render;