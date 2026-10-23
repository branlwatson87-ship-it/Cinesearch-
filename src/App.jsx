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

const FEATURED_SHOPPING_GUIDES = [
  {
    id: "cozy-night",
    title: "Cozy movie night setup",
    description:
      "Blankets, snacks, and the little extras that make a film night feel like an event.",
    query: "movie night blanket snacks home theater",
  },
  {
    id: "streaming-setup",
    title: "Home theater upgrades",
    description:
      "Level up the room with lighting, speakers, and accessories made for immersive viewing.",
    query: "home theater speaker lamp streaming setup",
  },
  {
    id: "mini-collection",
    title: "Curated collector finds",
    description:
      "Bonus picks for fans who like to keep the movies close long after the credits roll.",
    query: "movie poster collector edition memorabilia",
  },
];

const DEALS = [
  {
    id: "projector",
    category: "Home theater",
    title: "Portable projector",
    price: "$189",
    description: "Big-screen energy for apartment living rooms, backyard screenings, and weekend marathons.",
    query: "portable projector for bedroom movie nights",
  },
  {
    id: "soundbar",
    category: "Audio",
    title: "Compact soundbar",
    price: "$149",
    description: "A simple upgrade that makes dialogue clearer and action scenes feel bigger.",
    query: "compact soundbar home theater",
  },
  {
    id: "blanket",
    category: "Cozy picks",
    title: "Oversized throw blanket",
    price: "$39",
    description: "Comfort-first accessories that make a movie night feel indulgent from the first frame.",
    query: "oversized plush throw blanket movie night",
  },
];

const CONTENT_HUBS = [
  {
    id: "date-night",
    label: "Date-night picks",
    query: "date night movie",
    description: "Thoughtful, romantic, and crowd-pleasing titles for a slower evening in.",
  },
  {
    id: "rainy-day",
    label: "Rainy day watches",
    query: "rainy day movies",
    description: "Comfort movies and moody picks for a dark, quiet night indoors.",
  },
  {
    id: "cinema-gear",
    label: "Home theater gear",
    query: "home theater setup",
    description: "The accessories that turn a room into a proper movie-night experience.",
  },
  {
    id: "indie-finds",
    label: "Underrated gems",
    query: "indie movies",
    description: "Hidden favorites for people who want something a little less obvious.",
  },
];

const EDITORIAL_GUIDES = [
  {
    id: "setup-guide",
    title: "How to build a cozy movie night setup",
    summary: "The best low-cost upgrades for lighting, sound, and comfort.",
    query: "cozy movie night setup",
  },
  {
    id: "best-watches",
    title: "Best movies to watch when you want to feel something",
    summary: "Thoughtful picks for emotional, reflective nights when the mood matters.",
    query: "movies to feel something",
  },
  {
    id: "gear-guide",
    title: "Best home theater gadgets for apartment living",
    summary: "Compact upgrades that deliver a theater feel without taking over the room.",
    query: "apartment home theater",
  },
];

const buildAmazonSearchUrl = (query, affiliateTag) => {
  if (!query || !affiliateTag) return null;

  return `https://www.amazon.com/s?${new URLSearchParams({
    k: query,
    tag: affiliateTag,
  })}`;
};

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [movies, setMovies] = useState(SAMPLE_MOVIES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");

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

  const handleNewsletterSubmit = (event) => {
    event.preventDefault();

    const trimmedEmail = newsletterEmail.trim();
    if (!trimmedEmail) {
      setNewsletterStatus("Enter an email to get the latest movie-night deals.");
      return;
    }

    setNewsletterStatus(
      `Thanks! ${trimmedEmail} is now on the list for weekly movie-night finds.`,
    );
    setNewsletterEmail("");
  };

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

      <section className="shop-promo" aria-labelledby="shop-promo-title">
        <div>
          <p className="eyebrow">MONETIZE THE MOOD</p>
          <h2 id="shop-promo-title">Turn every movie moment into a revenue opportunity.</h2>
        </div>
        {AMAZON_ASSOCIATES_TAG ? (
          <p className="shop-promo-note">
            Earn commissions on the gear, snacks, and extras that make a movie night feel complete.
          </p>
        ) : (
          <p className="shop-promo-note">
            Add your Amazon Associates tag in the project environment to enable commission earning links.
          </p>
        )}
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

      <section className="shop-grid-section" aria-labelledby="shop-grid-title">
        <div className="shop-grid-header">
          <p className="eyebrow">SHOP THE VIBE</p>
          <h2 id="shop-grid-title">Movie-night extras your visitors can actually buy.</h2>
        </div>
        <div className="shop-grid">
          {FEATURED_SHOPPING_GUIDES.map((guide) => {
            const shopUrl = buildAmazonSearchUrl(guide.query, AMAZON_ASSOCIATES_TAG);

            return (
              <article key={guide.id} className="shop-card">
                <span className="shop-badge">Affiliate pick</span>
                <h3>{guide.title}</h3>
                <p>{guide.description}</p>
                {shopUrl ? (
                  <a
                    className="shop-link"
                    href={shopUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                  >
                    Shop this setup <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="shop-link muted">Add your affiliate tag to unlock shopping links</span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="deal-board" aria-labelledby="deal-board-title">
        <div className="deal-header">
          <div>
            <p className="eyebrow">HOT DEALS</p>
            <h2 id="deal-board-title">Curated finds that pair with a great film.</h2>
          </div>
          <a href="https://www.amazon.com/" target="_blank" rel="sponsored nofollow noopener noreferrer" className="deal-link">
            Browse Amazon picks <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="deal-grid">
          {DEALS.map((deal) => {
            const shopUrl = buildAmazonSearchUrl(deal.query, AMAZON_ASSOCIATES_TAG);

            return (
              <article key={deal.id} className="deal-card">
                <div className="deal-card-head">
                  <span className="deal-category">{deal.category}</span>
                  <span className="deal-price">{deal.price}</span>
                </div>
                <h3>{deal.title}</h3>
                <p>{deal.description}</p>
                {shopUrl ? (
                  <a
                    className="shop-link"
                    href={shopUrl}
                    target="_blank"
                    rel="sponsored nofollow noopener noreferrer"
                  >
                    See the deal <span aria-hidden="true">↗</span>
                  </a>
                ) : (
                  <span className="shop-link muted">Add your tag to enable affiliate links</span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-hub" aria-labelledby="content-hub-title">
        <div className="content-hub-header">
          <p className="eyebrow">DISCOVER BY INTENT</p>
          <h2 id="content-hub-title">Guides people actually search for before they pick a movie.</h2>
        </div>
        <div className="hub-grid">
          {CONTENT_HUBS.map((hub) => (
            <button
              key={hub.id}
              type="button"
              className="hub-card"
              onClick={() => {
                setQuery(hub.query);
                setSelectedCollection(null);
              }}
            >
              <span className="hub-label">{hub.label}</span>
              <p>{hub.description}</p>
              <span className="hub-action">Explore picks <span aria-hidden="true">↗</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="editorial-grid-section" aria-labelledby="editorial-grid-title">
        <div className="editorial-grid-header">
          <p className="eyebrow">EDITORIAL GUIDES</p>
          <h2 id="editorial-grid-title">The content that brings in repeat traffic.</h2>
        </div>
        <div className="editorial-grid">
          {EDITORIAL_GUIDES.map((guide) => (
            <article key={guide.id} className="editorial-card">
              <span className="editorial-tag">Guide</span>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <button
                type="button"
                className="editorial-button"
                onClick={() => {
                  setQuery(guide.query);
                  setSelectedCollection(null);
                }}
              >
                Explore this topic <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter" aria-labelledby="newsletter-title">
        <div>
          <p className="eyebrow">THE WEEKLY RECOMMENDATION</p>
          <h2 id="newsletter-title">Get the best movie-night finds sent straight to your inbox.</h2>
        </div>

        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <label className="newsletter-field">
            <span className="visually-hidden">Email address</span>
            <input
              type="email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="Email address"
              aria-label="Email address"
            />
          </label>
          <button type="submit">Get deals</button>
        </form>

        {newsletterStatus && <p className="newsletter-status">{newsletterStatus}</p>}
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
