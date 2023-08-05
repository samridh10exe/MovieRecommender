const API_KEY = 'YOUR_API_KEY'; 
// Replace 'YOUR_API_KEY' with your actual API key from www.themoviedb.org


// Function to get genre names from genre IDs
async function getGenreNames(genreIds) {
  const apiUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch genre data.');
    }

    const data = await response.json();
    const genreData = data.genres;

    // Map genre IDs to genre names
    const genreNames = genreIds.map(id => {
      const genre = genreData.find(item => item.id === id);
      return genre ? genre.name : 'Unknown';
    });

    return genreNames;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function getRecommendations() {
  const genreId = document.getElementById('genre').value;
  const minRating = parseFloat(document.getElementById('rating').value);

  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&vote_average.gte=${minRating}&with_genres=${genreId}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch movie recommendations.');
    }

    const data = await response.json();
    const recommendations = data.results;

    const recommendationsDiv = document.getElementById('recommendations');
    recommendationsDiv.innerHTML = '';
    if (recommendations.length === 0) {
      recommendationsDiv.innerHTML = "<p>No movies found based on the selected criteria.</p>";
    } else {
      const moviesList = document.createElement('ul');
      recommendations.forEach(async movie => {
        const genreNames = await getGenreNames(movie.genre_ids);
        const movieItem = document.createElement('li');
        movieItem.classList.add('movie-item');

        const posterUrl = `https://image.tmdb.org/t/p/w300${movie.poster_path}`; // Fetch the poster URL
        const moviePoster = document.createElement('img');
        moviePoster.setAttribute('src', posterUrl);
        movieItem.appendChild(moviePoster);

        movieItem.innerHTML += `
          <span class="movie-title">${movie.title}</span>
          <span class="movie-details">Rating: ${movie.vote_average} | Genre: ${genreNames.join(', ')}</span>
        `;
        moviesList.appendChild(movieItem);
      });
      recommendationsDiv.appendChild(moviesList);
    }
  } catch (error) {
    console.error(error.message);
  }
}
