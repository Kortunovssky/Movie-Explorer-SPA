// api.js
class MovieAPI {
    constructor() {
        this.baseURL = 'https://api.themoviedb.org/3';
        this.apiKey = '1d4b1e8c5e8b9d8f7f6e5d4c3b2a1234'; // Replace with your real API key for production
        this.imageBaseURL = 'https://image.tmdb.org/t/p';
    }

    async fetchMovies(endpoint = 'movie/popular', page = 1) {
        try {
            const response = await fetch(`${this.baseURL}/${endpoint}?api_key=${this.apiKey}&language=ru-RU&page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                rating: movie.vote_average.toFixed(1),
                genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'N/A', // Would need to map to names
                description: movie.overview,
                poster: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'
            }));
        } catch (error) {
            console.error('API Error:', error);
            return this.getMockMovies(endpoint); // Fallback to mock if real API fails
        }
    }

    async getMovieVideos(movieId) {
        try {
            const response = await fetch(`${this.baseURL}/movie/${movieId}/videos?api_key=${this.apiKey}&language=ru-RU`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const trailer = data.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
            return trailer ? trailer.key : null;
        } catch (error) {
            console.error('Video API Error:', error);
            return null;
        }
    }

    getMockMovies(type) {
        // Expanded mock data
        const movies = {
            'movie/popular': [
                { id: 1, title: 'Inception', year: 2010, rating: 8.8, genre: 'Sci-Fi', description: 'Вор, крадущий корпоративные секреты через технологию общих снов, получает обратную задачу - внедрить идею в сознание.', poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop' },
                { id: 2, title: 'The Matrix', year: 1999, rating: 8.7, genre: 'Sci-Fi', description: 'Хакер обнаруживает, что реальность - симуляция, и присоединяется к восстанию против машин.', poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=500&h=750&fit=crop' },
                { id: 3, title: 'Interstellar', year: 2014, rating: 8.6, genre: 'Sci-Fi', description: 'Команда исследователей путешествует через червоточину в поисках нового дома для человечества.', poster: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=500&h=750&fit=crop' },
                { id: 4, title: 'The Dark Knight', year: 2008, rating: 9.0, genre: 'Action', description: 'Бэтмен противостоит Джокеру, который погружает Готэм в анархию и заставляет героя пересечь грань.', poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=500&h=750&fit=crop' },
                { id: 5, title: 'Pulp Fiction', year: 1994, rating: 8.9, genre: 'Crime', description: 'Жизни двух наемных убийц, боксера и жены гангстера переплетаются в четырех историях насилия.', poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=750&fit=crop' },
                { id: 6, title: 'Forrest Gump', year: 1994, rating: 8.8, genre: 'Drama', description: 'История жизни простодушного парня с IQ 75, который случайно влияет на важные события американской истории.', poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=750&fit=crop' },
                { id: 10, title: 'Fight Club', year: 1999, rating: 8.8, genre: 'Drama', description: 'Сотрудник офиса и харизматичный продавец мыла создают подпольный бойцовский клуб, который перерастает в нечто большее.', poster: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500&h=750&fit=crop' },
                { id: 11, title: 'The Shawshank Redemption', year: 1994, rating: 9.3, genre: 'Drama', description: 'Двое заключенных создают прочную дружбу в тюрьме, находя утешение и искупление через доброту.', poster: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&h=750&fit=crop' },
                { id: 14, title: 'Gladiator', year: 2000, rating: 8.5, genre: 'Action', description: 'Римский генерал становится гладиатором, чтобы отомстить за предательство и убийство его семьи.', poster: 'https://images.unsplash.com/photo-1593642532973-d31b97d0e6b8?w=500&h=750&fit=crop' },
                { id: 15, title: 'The Godfather', year: 1972, rating: 9.2, genre: 'Crime', description: 'История стареющего патриарха мафиозной династии, передающего власть своему сыну.', poster: 'https://images.unsplash.com/photo-1580130775562-0c3a1fb9b3b7?w=500&h=750&fit=crop' },
                { id: 16, title: 'Schindler\'s List', year: 1993, rating: 8.9, genre: 'Drama', description: 'Бизнесмен Оскар Шиндлер спасает более тысячи евреев во время Холокоста.', poster: 'https://images.unsplash.com/photo-1579463148228-138296ac3b98?w=500&h=750&fit=crop' },
                { id: 17, title: 'Blade Runner 2049', year: 2017, rating: 8.0, genre: 'Sci-Fi', description: 'Офицер K раскрывает секрет, который может разрушить остатки общества.', poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af5924?w=500&h=750&fit=crop' },
                { id: 18, title: 'Parasite', year: 2019, rating: 8.6, genre: 'Drama', description: 'Бедная семья хитро проникает в жизнь богатой семьи, что приводит к неожиданным последствиям.', poster: 'https://images.unsplash.com/photo-1580130775562-0c3a1fb9b3b7?w=500&h=750&fit=crop' },
                // Add more mock movies as needed
            ],
            'trending/movie/week': [
                { id: 7, title: 'Dune', year: 2021, rating: 8.0, genre: 'Sci-Fi', description: 'Сын благородной семьи становится мессией племени на пустынной планете, богатой ценным ресурсом.', poster: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=750&fit=crop' },
                { id: 8, title: 'Spider-Man', year: 2021, rating: 8.7, genre: 'Action', description: 'Питер Паркер сталкивается с последствиями раскрытия своей тайной личности как Человека-паука.', poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&h=750&fit=crop' },
                { id: 9, title: 'The Batman', year: 2022, rating: 7.9, genre: 'Action', description: 'Бэтмен на втором году борьбы с преступностью раскрывает коррупцию в Готэме, связанную с его семьей.', poster: 'https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?w=500&h=750&fit=crop' },
                { id: 12, title: 'No Time to Die', year: 2021, rating: 7.3, genre: 'Action', description: 'Джеймс Бонд выходит из отставки для последней миссии, чтобы спасти похищенного ученого.', poster: 'https://images.unsplash.com/photo-1574375924355-3d4424b5e225?w=500&h=750&fit=crop' },
                { id: 13, title: 'Shang-Chi', year: 2021, rating: 7.4, genre: 'Action', description: 'Шан-Чи сталкивается с прошлым, которое он оставил позади, втягиваясь в дела таинственной организации.', poster: 'https://images.unsplash.com/photo-1623705294042-765b7e9a7b4e?w=500&h=750&fit=crop' },
                // Add more
            ]
        };
        return movies[type] || [];
    }

    async searchMovies(query, page = 1) {
        try {
            const response = await fetch(`${this.baseURL}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&language=ru-RU&page=${page}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
                rating: movie.vote_average.toFixed(1),
                genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'N/A',
                description: movie.overview,
                poster: movie.poster_path ? `${this.imageBaseURL}/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'
            }));
        } catch (error) {
            console.error('Search Error:', error);
            return [];
        }
    }

    getAllMovies() {
        // For library page, combine or fetch from discover or something
        return this.fetchMovies('discover/movie');
    }
}