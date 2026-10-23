import { useEffect, useMemo, useState } from "react";
import MovieCard from "./components/MovieCard.jsx";
import SearchBar from "./components/SearchBar.jsx";

const SAMPLE_MOVIES = [
  {
    id: 1,
    title: "The Grand Budapest Hotel",
    year: "2014",
    overview:
      "A meticulous concierge and his young protégé become tangled in an adventure at a celebrated European hotel.",
  },
  {
    id: 2,
    title: "Arrival",
    year: "2016",
    overview:
      "A linguist works to communicate with mysterious visitors and uncover why they have come to Earth.",
  },
  {
    id: 3,
    title: "Spirited Away",
    year: "2001",
    overview:
      "A girl enters a strange spirit world and must find her courage to return home.",
  },
  {
    id: 4,
    title: "The Matrix",
    year: "1999",
    overview:
      "A hacker discovers that the world around him is not what it seems.",
  },
  {
    id: 5,
    title: "Moonlight",
    year: "2016",
    overview:
      "Three defining chapters trace a young man's journey toward identity and connection.",
  },
  {
    id: 6,
    title: "Parasite",
    year: "2019",
    overview:
      "A struggling family finds its way into the lives of a wealthy household, with unexpected consequences.",
  },
  {
    id: 7,
    title: "Mad Max: Fury Road",
    year: "2015",
    overview:
      "A lone traveler joins a daring escape across a stark desert wasteland.",
  },
  {
    id: 8,
    title: "Everything Everywhere All at Once",
    year: "2022",
    overview:
      "An overwhelmed laundromat owner discovers that her choices connect countless parallel lives.",
  },
  {
    id: 9,
    title: "The Social Network",
    year: "2010",
    overview:
      "The rise of a new social platform strains the friendships and ambitions behind its creation.",
  },
  {
    id: 10,
    title: "Get Out",
    year: "2017",
    overview:
      "A weekend visit with his girlfriend's family takes a troubling turn.",
  },
  {
    id: 11,
    title: "In the Mood for Love",
    year: "2000",
    overview:
      "Two neighbors form a quiet bond after discovering a shared secret.",
  },
  {
    id: 12,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: "2001",
    overview:
      "A young hobbit begins a perilous journey to protect a powerful ring from a rising darkness.",
  },
];

const COLLECTIONS = [
  {
    id: "thoughtful",
    title: "A little something to think about",
    description:
      "Big ideas, layered stories, and films that are fun to talk about after the credits.",
    guide:
      "For a thoughtful movie night, pick the kind of story you’re in the mood to unpack: Arrival explores communication, The Social Network looks at ambition and friendship, and Parasite shifts tone in surprising ways. Choose one, keep the evening unhurried, and save the discussion for after the film.",
    movieIds: [2, 6, 9, 11],
  },
  {
    id: "adventure",
    title: "Somewhere else for a while",
    description:
      "Immersive worlds, memorable journeys, and a good reason to stay up for one more scene.",
    guide:
      "If you want to get completely swept up, try a journey through Middle-earth, a desert chase with Mad Max: Fury Road, or the many-worlds adventure of Everything Everywhere All at Once. Settle in, put the phones away, and let the world on screen take over.",
    movieIds: [7, 8, 12, 3],
  },
  {
    id: "feel-good",
    title: "A softer landing",
    description:
      "Distinctive, human stories for a night that could use a little warmth and wonder.",
    guide:
      "For a gentler pick, The Grand Budapest Hotel brings playful visual detail, while Spirited Away offers a richly imagined world and a heartfelt coming-of-age story. Moonlight is more intimate and reflective. Pick the pace that suits your evening.",
    movieIds: [1, 3, 5],
  },
  {
    id: "edge-of-seat",
    title: "Keep the lights low",
    description:
      "Tension, strange turns, and suspenseful stories best enjoyed without spoilers.",
    guide:
      "For suspense, Get Out builds unease through sharp social observation, while The Matrix turns a question about reality into a propulsive action story. Go in knowing as little as you can, and let the surprises do their work.",
    movieIds: [4, 10, 6],
  },
];

const API_KEY = import.meta.env.VITE_TMDB_API_KEY?.trim();
const AMAZON_ASSOCIATES_TAG = import.meta.env.VITE_AMAZON_ASSOCIATES_TAG?.trim();

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [movies, setMovies] = useState(SAMPLE_MOVIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const localResults = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery || API_KEY) return SAMPLE_MOVIES;

    return SAMPLE_MOVIES.filter((movie) =>
      `${movie.title} ${movie.overview}`
        .toLocaleLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  const activeCollection = COLLECTIONS.find(
    (collection) => collection.id === selectedCollection,
  );
  const visibleMovies = activeCollection
    ? movies.filter((movie) => activeCollection.movieIds.includes(movie.id))
    : movies;

  useEffect(() => {
    if (!API_KEY || !query.trim()) {
      setMovies(localResults);
      setLoading(false);
      setError("");
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          api_key: API_KEY,
          query: query.trim(),
          include_adult: "false",
        });
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?${params}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Movie search failed (${response.status}).`);
        }

        const data = await response.json();
        if (!Array.isArray(data.results)) {
          throw new Error("Movie search returned an unexpected response.");
        }
        setMovies(data.results);
      } catch (searchError) {
        if (searchError.name !== "AbortError") {
          setError(searchError.message || "Unable to search movies right now.");
          setMovies([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, localResults]);

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="Cinesearch home">
          <span className="brand-mark" aria-hidden="true">
            C
          </span>
          <span>cine<span className="brand-light">search</span></span>
        </a>
        <span className="header-note">A good film is a feeling.</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">YOUR NEXT FAVORITE FILM</p>
        <h1 id="page-title">
          Find a movie
          <br />
          <span>worth staying in for.</span>
        </h1>
        <p className="hero-copy">
          Search the collection and find something you’ll love watching.
        </p>
        <SearchBar
          value={query}
          onChange={(value) => {
            setQuery(value);
            setSelectedCollection(null);
          }}
        />
        <p className="search-hint">
          {API_KEY
            ? "Searching the TMDB movie catalog"
            : "Try a title from our sample collection"}
        </p>
      </section>

      <section className="collections" aria-labelledby="collections-title">
        <div className="collections-heading">
          <p className="eyebrow">PICK A MOOD</p>
          <h2 id="collections-title">A guide to your next movie night</h2>
          <p className="collections-intro">
            Browse a hand-picked starting point, then choose the film that fits
            the evening.
          </p>
        </div>
        <div className="collection-grid">
          {COLLECTIONS.map((collection) => (
            <button
              className={`collection-card${selectedCollection === collection.id ? " selected" : ""}`}
              key={collection.id}
              type="button"
              aria-pressed={selectedCollection === collection.id}
              onClick={() => {
                setQuery("");
                setSelectedCollection(
                  selectedCollection === collection.id ? null : collection.id,
                );
              }}
            >
              <span className="collection-card-title">{collection.title}</span>
              <span className="collection-card-description">
                {collection.description}
              </span>
              <span className="collection-card-action">
                {selectedCollection === collection.id
                  ? "Showing this collection"
                  : "Explore collection"}
                <span aria-hidden="true"> ↗</span>
              </span>
            </button>
          ))}
        </div>
        {activeCollection && (
          <article className="movie-guide" aria-live="polite">
            <p className="eyebrow">MOVIE NIGHT GUIDE</p>
            <h3>{activeCollection.title}</h3>
            <p>{activeCollection.guide}</p>
          </article>
        )}
      </section>

      <section className="results" aria-labelledby="results-title">
        <div className="results-heading">
          <div>
            <p className="eyebrow">
              {query.trim()
                ? "SEARCH RESULTS"
                : activeCollection
                  ? "CURATED COLLECTION"
                  : "A FEW TO GET YOU STARTED"}
            </p>
            <h2 id="results-title">
              {query.trim()
                ? `Movies matching “${query.trim()}”`
                : activeCollection
                  ? activeCollection.title
                  : "Popular picks"}
            </h2>
          </div>
          {!loading && !error && (
            <span className="result-count">
              {visibleMovies.length} {visibleMovies.length === 1 ? "movie" : "movies"}
            </span>
          )}
        </div>

        {loading && <p className="status-message">Searching movies…</p>}
        {error && <p className="status-message error-message">{error}</p>}
        {!loading && !error && visibleMovies.length === 0 && (
          <p className="status-message">
            {activeCollection
              ? "There are no movies in this collection yet."
              : `No movies found. Try another title${API_KEY ? "" : " from the sample collection"}.`}
          </p>
        )}
        {!loading && !error && visibleMovies.length > 0 && (
          <div className="movie-grid">
            {visibleMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                affiliateTag={AMAZON_ASSOCIATES_TAG}
              />
            ))}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <span>Made for movie nights.</span>
        {API_KEY && (
          <span>
            Movie data from{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
              TMDB
            </a>
          </span>
        )}
        {AMAZON_ASSOCIATES_TAG && (
          <span className="affiliate-disclosure">
            As an Amazon Associate I earn from qualifying purchases.
          </span>
        )}
      </footer>
    </main>
  );
}
