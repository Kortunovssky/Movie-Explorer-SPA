// state.js
class AppState {
    constructor() {
        this.favorites = [];
        this.currentView = 'home';
        this.searchQuery = '';
        this.selectedMovie = null;
        this.sortOption = 'title-asc';
        this.filterGenre = '';
        this.listeners = [];
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(listener => listener(this));
    }

    addFavorite(movie) {
        if (!this.favorites.find(m => m.id === movie.id)) {
            this.favorites.push(movie);
            this.notify();
        }
    }

    removeFavorite(movieId) {
        this.favorites = this.favorites.filter(m => m.id !== movieId);
        this.notify();
    }

    isFavorite(movieId) {
        return this.favorites.some(m => m.id === movieId);
    }

    setSearchQuery(query) {
        this.searchQuery = query;
        this.notify();
    }

    setSelectedMovie(movie) {
        this.selectedMovie = movie;
        this.notify();
    }

    setSortOption(option) {
        this.sortOption = option;
        this.notify();
    }

    setFilterGenre(genre) {
        this.filterGenre = genre;
        this.notify();
    }
}