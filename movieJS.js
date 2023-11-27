const key = "e2a1304167235ad51b87b8e27b51a0a7";
const posterSize = "w400";
const base = "https://image.tmdb.org/t/p/";

//accessing elements
const dropdwn = document.getElementById("genres");
const movieInfo = document.getElementById("movieInfo");
const searchBtn = document.getElementById("playBtn");
const posterEl = document.getElementById("moviePoster");
const textEl = document.getElementById("movieText");
const nextBtn = document.getElementById("likeOrDislikeBtns");
const searchDiv = document.getElementById("searchdiv");

const req = new XMLHttpRequest();
req.open("get", `https://api.themoviedb.org/3/genre/movie/list?api_key=${key}`);
req.send();

req.onload = function () {
  const genreData = JSON.parse(req.responseText);
  loadGenres(genreData.genres);
};

function loadGenres(genres) {
  for (let item of genres) {
    const option = document.createElement("option");
    option.id = item.id;
    option.textContent = item.name;
    dropdwn.appendChild(option);
  }
}

function movieRequest(genre) {
  const movieReq = new XMLHttpRequest();
  movieReq.open(
    "GET",
    `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres=${genre}`
  );
  movieReq.send();

  movieReq.onload = function () {
    const data = JSON.parse(movieReq.responseText);
    const arrData = data.results;
    let currmovie = 0;
    searchBtn.addEventListener("click", function () {
      searchDiv.classList.remove("searchdiv");
      searchDiv.classList.add("removeSearchDiv");
      clearScreen();
      let item = arrData[currmovie];
      let fullURL = `${base}${posterSize}${item.poster_path}`;
      showMovie(item.original_title, item.overview, fullURL);
    });

    nextBtn.addEventListener("click", () => {
      currmovie++;
      nextMovie(arrData, currmovie);
    });
  };
}

function showMovie(title, text, poster) {
  const image = document.createElement("img");
  image.src = poster;
  posterEl.appendChild(image);

  const moveititle = document.createElement("h1");
  moveititle.textContent = title;
  moveititle.id = "movieTitle";
  textEl.insertAdjacentElement("beforeend", moveititle);

  const movieOverview = document.createElement("p");
  movieOverview.id = "movieOverview";
  movieOverview.textContent = text;
  textEl.appendChild(movieOverview);
  nextBtn.hidden = false;
}

function nextMovie(arrData, currmovie) {
  clearScreen();
  const item = arrData[currmovie];
  fullURL = `${base}${posterSize}${item.poster_path}`;
  showMovie(item.original_title, item.overview, fullURL);
}

document.addEventListener("DOMContentLoaded", () => {
  searchDiv.classList.add("searchdiv");
  dropdwn.addEventListener("input", function () {
    searchDiv.classList.add("searchdiv");
    searchDiv.classList.remove("removeSearchDiv");
    clearScreen();
    const selectedOption = dropdwn.options[dropdwn.selectedIndex];
    movieRequest(selectedOption.id);
  });
});

function clearScreen() {
  nextBtn.hidden = true;
  posterEl.innerHTML = "";
  textEl.innerHTML = "";
}
