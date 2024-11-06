const part1 = '5780';
const part2 = 'ecf8';
const apiKey = part1 + part2; 
let baseUrl = 'https://www.omdbapi.com/';
if (window.location.hostname !== 'luizamenezesg.github.io') {
    console.warn("Esta chave de API é somente para uso neste site.");
}

let resultsContainer = document.getElementById('results'); // variável para o resultado da pesquisa
let favoritesContainer = document.getElementById('favorites-list'); // variável para a lista de favoritos

// Função para buscar filmes por título (GET)
function searchMovies(query) {
    return fetch(`${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => (data.Response === 'True' ? data.Search : Promise.reject(data.Error)))
        .catch(error => {
            console.error('Erro ao buscar filmes:', error);
            return [];
        }
    )
}

function getMovieDetails(id) {
    return fetch(`${baseUrl}?id=${id}`)
        .then(response => response.json())
        .then(data => (data.Response === 'True' ? data : Promise.reject('Detalhes não encontrados')))
        .catch(error => {
            console.error('Erro ao buscar detalhes do filme:', error);
            return null;
        });
}

// Função para buscar detalhes de um filme (GET)
function getMovieDetails(id) {
    return fetch(`${baseUrl}?apikey=${apiKey}&i=${id}`)
        .then(response => response.json())
        .then(data => (data.Response === 'True' ? data : Promise.reject('Detalhes não encontrados')))
        .catch(error => {
            console.error('Erro ao buscar detalhes do filme:', error);
            return null;
        }
    )
}

// Função para exibir os resultados de forma funcional
function displayMovies(movies) {
    resultsContainer.innerHTML = ''; // Limpa o conteúdo anterior
    movies.forEach(movie => {
        resultsContainer.innerHTML += `
            <div class="movie-item">
                <h3>${movie.Title} (${movie.Year})</h3>
                <button onclick="showMovieDetails('${movie.imdbID}')">Ver Detalhes</button>
                <button onclick="addFavorite('${movie.imdbID}', '${movie.Title}', '${movie.Year}')">Adicionar aos Favoritos</button>
            </div> `;
        }
    )
}

// Evento de busca com função funcional
document.getElementById('search-button').addEventListener('click', function () { 
    let query = document.getElementById('search-input').value;
    if (query) {
        searchMovies(query).then(data => displayMovies(data)).catch(error => {
            resultsContainer.innerHTML = `<p>${error}</p>`;
                }
            )
        }
    }
) 

// Função para exibir detalhes do filme
function showMovieDetails(id) {
    getMovieDetails(id).then(data => {
        if (data) {
            alert(`Título: ${data.Title}\nAno: ${data.Year}\nDiretor: ${data.Director}\nSinopse: ${data.Plot}`);
            }
        }
    )
}

// Função para obter favoritos
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
}

// Função para salvar favoritos
function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Função para adicionar um filme aos favoritos
function addFavorite(id, title, year) {
    let favorites = getFavorites();
    if (!favorites.some(movie => movie.id === id)) {
        favorites = [...favorites, { id, title, year }];
        saveFavorites(favorites);
        displayFavorites();
    } else {
        alert('Filme já está nos favoritos.');
    }
}

// Função para remover um filme dos favoritos
function removeFavorite(id) {
    let favorites = getFavorites().filter(movie => movie.id !== id);
    saveFavorites(favorites);
    displayFavorites();
}

// Função para exibir favoritos
function displayFavorites() {
    let favorites = getFavorites();
    favoritesContainer.innerHTML = ''; // Limpa o conteúdo anterior
    
    favorites.forEach(movie => {
        favoritesContainer.innerHTML += `
            <li>
                <span>${movie.title} (${movie.year})</span>
                <button onclick="removeFavorite('${movie.id}')">Remover</button>
            </li> `
        }
    )
}

// Carregar favoritos ao iniciar a página
document.addEventListener('DOMContentLoaded', displayFavorites);

// Editar filmes favoritos

function displayFavorites() {
    let favorites = getFavorites();
    favoritesContainer.innerHTML = ''; // Limpa o conteúdo anterior
    
    favorites.forEach(movie => {
        favoritesContainer.innerHTML += `
            <li>
                <span>${movie.title} (${movie.year})</span>
                <button onclick="editFavorite('${movie.id}')">Editar</button>
                <button onclick="removeFavorite('${movie.id}')">Remover</button>
            </li>
        `;
    });
}

function editFavorite(id) {
    let favorites = getFavorites();
    let movie = favorites.find(movie => movie.id === id);

    if (movie) {
        let newTitle = prompt("Insira o novo título do filme:", movie.title);
        let newYear = prompt("Insira o novo ano do filme:", movie.year);

        if (newTitle) movie.title = newTitle;
        if (newYear) movie.year = newYear;

        saveFavorites(favorites);
        displayFavorites();
    } else {
        alert("Filme não encontrado.");
    }
}
