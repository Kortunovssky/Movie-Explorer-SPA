// components.js
function Navbar(activePage) {
    return `
        <nav class="glass fixed top-0 left-0 right-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-8">
                        <h1 class="text-2xl font-bold cursor-pointer" onclick="router.navigate('/')">
                            🎬 Movie Explorer
                        </h1>
                        <div class="hidden md:flex space-x-6">
                            <a href="/" onclick="event.preventDefault(); router.navigate('/')"
                               class="nav-link ${activePage === 'home' ? 'active' : ''} hover:text-gray-200">
                                Популярное
                            </a>
                            <a href="/trending" onclick="event.preventDefault(); router.navigate('/trending')"
                               class="nav-link ${activePage === 'trending' ? 'active' : ''} hover:text-gray-200">
                                В тренде
                            </a>
                            <a href="/library" onclick="event.preventDefault(); router.navigate('/library')"
                               class="nav-link ${activePage === 'library' ? 'active' : ''} hover:text-gray-200">
                                Библиотека
                            </a>
                            <a href="/favorites" onclick="event.preventDefault(); router.navigate('/favorites')"
                               class="nav-link ${activePage === 'favorites' ? 'active' : ''} hover:text-gray-200">
                                Избранное (${state.favorites.length})
                            </a>
                        </div>
                    </div>
                    <div class="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Поиск фильмов..."
                            class="glass px-4 py-2 rounded-full text-white placeholder-gray-300 focus:ring-2 focus:ring-white/50 transition"
                            onkeyup="handleSearch(event)"
                            value="${state.searchQuery}"
                        />
                        <button class="glass p-2 rounded-full hover:bg-white/20 transition">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    `;
}

function MovieCard(movie) {
    const isFav = state.isFavorite(movie.id);
    return `
        <div class="movie-card glass rounded-2xl overflow-hidden" onclick="showMovieDetails(${movie.id})">
            <div class="relative">
                <img src="${movie.poster}" alt="${movie.title}" class="w-full h-96 object-cover" loading="lazy"/>
                <div class="absolute top-4 right-4 rating text-white px-3 py-1 rounded-full font-bold text-sm">
                    ⭐ ${movie.rating}
                </div>
                <button
                    class="absolute top-4 left-4 glass p-2 rounded-full hover:bg-white/30 transition"
                    onclick="event.stopPropagation(); toggleFavorite(${movie.id})"
                >
                    <svg class="w-6 h-6 ${isFav ? 'fill-red-500' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                </button>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold mb-2">${movie.title}</h3>
                <div class="flex items-center justify-between text-sm text-gray-300">
                    <span class="badge px-3 py-1 rounded-full">${movie.genre}</span>
                    <span>${movie.year}</span>
                </div>
            </div>
        </div>
    `;
}

function LoadingSkeleton() {
    return `
        <div class="glass rounded-2xl overflow-hidden">
            <div class="skeleton h-96 w-full"></div>
            <div class="p-6 space-y-3">
                <div class="skeleton h-6 w-3/4 rounded"></div>
                <div class="skeleton h-4 w-1/2 rounded"></div>
            </div>
        </div>
    `.repeat(6);
}

async function MovieModal(movie) {
    if (!movie) return '';
    const isFav = state.isFavorite(movie.id);
    const trailerKey = await api.getMovieVideos(movie.id);
    const trailerHTML = trailerKey ? `
        <div class="trailer-container">
            <iframe src="https://www.youtube.com/embed/${trailerKey}" frameborder="0" allowfullscreen></iframe>
        </div>
    ` : '<p class="text-gray-300">Трейлер не найден</p>';

    return `
        <div class="modal-backdrop fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onclick="closeModal(event)">
            <div class="modal-content glass rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <div class="relative">
                    <img src="${movie.poster}" alt="${movie.title}" class="w-full h-96 object-cover rounded-t-3xl"/>
                    <button
                        class="absolute top-4 right-4 glass p-3 rounded-full hover:bg-white/20 transition"
                        onclick="state.setSelectedMovie(null); render()"
                    >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                    <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                        <div class="rating text-white px-4 py-2 rounded-full font-bold text-lg">
                            ⭐ ${movie.rating}
                        </div>
                        <button
                            class="btn-primary text-white px-6 py-2 rounded-full font-semibold flex items-center space-x-2"
                            onclick="toggleFavorite(${movie.id})"
                        >
                            <svg class="w-5 h-5 ${isFav ? 'fill-current' : ''}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                            <span>${isFav ? 'Удалить из избранного' : 'Добавить в избранное'}</span>
                        </button>
                    </div>
                </div>
                <div class="p-8">
                    <h2 class="text-4xl font-bold mb-4">${movie.title}</h2>
                    <div class="flex items-center space-x-4 mb-6">
                        <span class="badge px-4 py-2 rounded-full">${movie.genre}</span>
                        <span class="text-gray-300">${movie.year}</span>
                    </div>
                    <p class="text-lg text-gray-200 leading-relaxed mb-6">${movie.description}</p>
                    <h3 class="text-2xl font-bold mb-4">Трейлер</h3>
                    ${trailerHTML}
                </div>
            </div>
        </div>
    `;
}