document.addEventListener("DOMContentLoaded", () => {
  // Hero slider data
  const heroImages = [
    { title: "Avengers: Endgame", src: "images/avengers endgame.jpeg" },
    { title: "Infinity War", src: "images/avengers infinity war.jpg" },
    { title: "Captain Marvel", src: "images/captain marvel.webp" },
    { title: "Guardians of the Galaxy Vol 2", src: "images/Guardians-of-the-Galaxy-2.avif" },
    { title: "Thor: Ragnarok", src: "images/thor ragnarok.webp" }
  ];

  let heroIndex = 0;

  const heroImageElement = document.querySelector(".hero img");
  const heroTitleElement = document.querySelector(".hero h2");
  const heroArrowLeft = document.querySelector(".hero .arrow-left");
  const heroArrowRight = document.querySelector(".hero .arrow-right");

  function updateHero() {
    heroImageElement.src = heroImages[heroIndex].src;
    heroTitleElement.textContent = heroImages[heroIndex].title;
  }

  heroArrowRight.addEventListener("click", () => {
    heroIndex = (heroIndex + 1) % heroImages.length;
    updateHero();
  });

  heroArrowLeft.addEventListener("click", () => {
    heroIndex = (heroIndex - 1 + heroImages.length) % heroImages.length;
    updateHero();
  });

  updateHero();

  // Movie list slider function
  function slideMovies(direction) {
    const movieList = document.querySelector(".movie-list");
    const scrollAmount = 220; // width of one movie item + gap

    movieList.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });
  }

  // Make slideMovies available globally for inline onclick handlers
  window.slideMovies = slideMovies;

  // API keys and tokens
  const giphyKey = "9j9AjOtu6DoeXiSlqAQCURlVBsBIPU1e";
  const youtubeKey = "AIzaSyDTuk1D-s4d5omUV70MWNOF6jlvFcdWHCs";
  const tmdbKey = "c3c9005a3a43504842fbd92e257e0554";
  const spotifyToken = "YOUR_SPOTIFY_AUTH_TOKEN"; // <-- Replace with your actual token

  async function fetchGiphy(query) {
    try {
      const res = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${query}&limit=1`);
      const data = await res.json();
      const gifContainer = document.getElementById("gif-container");
      gifContainer.innerHTML = '';
      if (data.data[0]?.images?.downsized?.url) {
        const img = document.createElement('img');
        img.src = data.data[0].images.downsized.url;
        img.alt = query + " GIF";
        gifContainer.appendChild(img);
      }
    } catch (error) {
      console.error("Error fetching Giphy:", error);
    }
  }

  async function fetchYouTube(query) {
    try {
      const res = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${youtubeKey}&q=${query}&type=video&part=snippet&maxResults=1`);
      const data = await res.json();
      const videoId = data.items[0]?.id?.videoId;
      const ytPlayer = document.getElementById("yt-player");
      ytPlayer.innerHTML = '';
      if (videoId) {
        const iframe = document.createElement('iframe');
        iframe.width = "560";
        iframe.height = "315";
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
        iframe.frameBorder = "0";
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        iframe.allowFullscreen = true;
        ytPlayer.appendChild(iframe);
      }
    } catch (error) {
      console.error("Error fetching YouTube:", error);
    }
  }

  async function fetchTMDB(query) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${query}`);
      const data = await res.json();
      const movie = data.results[0];
      const titleEl = document.getElementById("movie-title");
      const descEl = document.getElementById("movie-description");
      const poster = document.getElementById("movie-poster");

      titleEl.textContent = movie?.title || "Not found";
      descEl.textContent = movie?.overview || "No description available.";

      if (movie?.poster_path) {
        poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        poster.style.display = "block";
      } else {
        poster.style.display = "none";
      }
    } catch (error) {
      console.error("Error fetching TMDB:", error);
    }
  }

  async function fetchSpotifyTrack(query) {
    try {
      const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=1`, {
        headers: {
          Authorization: `Bearer ${spotifyToken}`
        }
      });
      const data = await res.json();
      const trackId = data.tracks?.items[0]?.id;
      const spotifyPlayer = document.getElementById("spotify-player");
      spotifyPlayer.innerHTML = '';
      if (trackId) {
        const iframe = document.createElement('iframe');
        iframe.src = `https://open.spotify.com/embed/track/${trackId}`;
        iframe.width = "300";
        iframe.height = "80";
        iframe.frameBorder = "0";
        iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
        spotifyPlayer.appendChild(iframe);
      }
    } catch (error) {
      console.error("Error fetching Spotify:", error);
    }
  }

  // Load all APIs based on selected movie
  async function loadMovieAPIs(query) {
    await fetchGiphy(query);
    await fetchYouTube(query);
    await fetchTMDB(query);
    await fetchSpotifyTrack(query);
  }

  // Expose to global for onclick handlers in HTML
  window.loadMovieAPIs = loadMovieAPIs;

  // Initial load example
  const exampleQuery = "Avengers Endgame";
  loadMovieAPIs(exampleQuery);
});
