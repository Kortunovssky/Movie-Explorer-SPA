// pages.js
async function HomePage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${Navbar('home')}
        <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-transition">
            <div class="text-center mb-12">
                <h2 class="text-5xl font-bold mb-4">Популярные фильмы</h2>
                <p class="text-xl text-gray-200">Откройте для себя лучшие фильмы всех времен</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                ${LoadingSkeleton()}
            </div>
        </div>
        ${state.selectedMovie ? await MovieModal(state.selectedMovie) : ''}
    `;

    const movies = state.searchQuery ? await api.searchMovies(state.searchQuery) : await api.fetchMovies('movie/popular');
    const grid = app.querySelector('.grid');
    grid.innerHTML = movies.length
        ? movies.map(movie => MovieCard(movie)).join('')
        : '<div class="col-span-full text-center text-2xl text-gray-300 py-20">Фильмы не найдены</div>';
}

async function TrendingPage() {
    const app = document.getElementById('app');
    app.innerHTML = `
        ${Navbar('trending')}
        <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-transition">
            <div class="text-center mb-12">
                <h2 class="text-5xl font-bold mb-4">В тренде сейчас</h2>
                <p class="text-xl text-gray-200">Самые обсуждаемые фильмы этого месяца</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                ${LoadingSkeleton()}
            </div>
        </div>
        ${state.selectedMovie ? await MovieModal(state.selectedMovie) : ''}
    `;

    const movies = state.searchQuery ? await api.searchMovies(state.searchQuery) : await api.fetchMovies('trending/movie/week');
    const grid = app.querySelector('.grid');
    grid.innerHTML = movies.length
        ? movies.map(movie => MovieCard(movie)).join('')
        : '<div class="col-span-full text-center text-2xl text-gray-300 py-20">Фильмы не найдены</div>';
}

async function LibraryPage() {
    const app = document.getElementById('app');
    const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Crime']; // Expand with real genres from API if needed
    app.innerHTML = `
        ${Navbar('library')}
        <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-transition">
            <div class="text-center mb-12">
                <h2 class="text-5xl font-bold mb-4">Библиотека фильмов</h2>
                <p class="text-xl text-gray-200">Исследуйте все доступные фильмы</p>
            </div>
            <div class="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 sm:space-x-4">
                <select
                    class="glass px-4 py-2 rounded-full text-white bg-transparent border border-white/20 focus:ring-2 focus:ring-white/50 transition"
                    onchange="handleSortChange(event)"
                >
                    <option value="title-asc" ${state.sortOption === 'title-asc' ? 'selected' : ''}>Название (А-Я)</option>
                    <option value="title-desc" ${state.sortOption === 'title-desc' ? 'selected' : ''}>Название (Я-А)</option>
                    <option value="rating-desc" ${state.sortOption === 'rating-desc' ? 'selected' : ''}>Рейтинг (убывание)</option>
                    <option value="year-desc" ${state.sortOption === 'year-desc' ? 'selected' : ''}>Год (новые)</option>
                    <option value="year-asc" ${state.sortOption === 'year-asc' ? 'selected' : ''}>Год (старые)</option>
                </select>
                <select
                    class="glass px-4 py-2 rounded-full text-white bg-transparent border border-white/20 focus:ring-2 focus:ring-white/50 transition"
                    onchange="handleGenreChange(event)"
                >
                    ${genres.map(genre => `
                        <option value="${genre.toLowerCase()}" ${state.filterGenre === genre.toLowerCase() ? 'selected' : ''}>
                            ${genre === 'All' ? 'Все жанры' : genre}
                        </option>
                    `).join('')}
                </select>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                ${LoadingSkeleton()}
            </div>
        </div>
        ${state.selectedMovie ? await MovieModal(state.selectedMovie) : ''}
    `;

    let movies = state.searchQuery ? await api.searchMovies(state.searchQuery) : await api.getAllMovies();
    if (state.filterGenre && state.filterGenre !== 'all') {
        movies = movies.filter(m => m.genre.toLowerCase().includes(state.filterGenre));
    }
    if (state.sortOption) {
        movies.sort((a, b) => {
            if (state.sortOption === 'title-asc') return a.title.localeCompare(b.title);
            if (state.sortOption === 'title-desc') return b.title.localeCompare(a.title);
            if (state.sortOption === 'rating-desc') return b.rating - a.rating;
            if (state.sortOption === 'year-desc') return b.year - a.year;
            if (state.sortOption === 'year-asc') return a.year - b.year;
            return 0;
        });
    }
    const grid = app.querySelector('.grid');
    grid.innerHTML = movies.length
        ? movies.map(movie => MovieCard(movie)).join('')
        : '<div class="col-span-full text-center text-2xl text-gray-300 py-20">Фильмы не найдены</div>';
}

function FavoritesPage() {
    const app = document.getElementById('app');
    const filtered = state.searchQuery
        ? state.favorites.filter(m => m.title.toLowerCase().includes(state.searchQuery.toLowerCase()))
        : state.favorites;

    app.innerHTML = `
        ${Navbar('favorites')}
        <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto page-transition">
            <div class="text-center mb-12">
                <h2 class="text-5xl font-bold mb-4">Избранные фильмы</h2>
                <p class="text-xl text-gray-200">Ваша персональная коллекция (${state.favorites.length})</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                ${filtered.length
                    ? filtered.map(movie => MovieCard(movie)).join('')
                    : '<div class="col-span-full text-center text-2xl text-gray-300 py-20">У вас пока нет избранных фильмов<br><span class="text-lg">Добавьте фильмы в избранное, чтобы сохранить их здесь</span></div>'
                }
            </div>
        </div>
        ${state.selectedMovie ? await MovieModal(state.selectedMovie) : ''}
    `;
}