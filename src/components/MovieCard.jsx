export default function MovieCard({ movie, affiliateTag }) {
  const year = movie.release_date?.slice(0, 4) || movie.year || "Year unknown";
  const rating =
    typeof movie.vote_average === "number" && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : null;
  const poster = movie.poster_path
    ? movie.poster_path.startsWith("http")
      ? movie.poster_path
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const amazonUrl = affiliateTag
    ? `https://www.amazon.com/s?${new URLSearchParams({
        k: `${movie.title} ${year}`,
        tag: affiliateTag,
      })}`
    : null;

  return (
    <article className="movie-card">
      <div className="poster">
        {poster ? (
          <img src={poster} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="poster-placeholder" aria-label="No poster available">
            <span aria-hidden="true">✦</span>
            <span>{movie.title}</span>
          </div>
        )}
        {rating && <span className="rating">★ {rating}</span>}
      </div>
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p className="movie-year">{year}</p>
        {movie.overview && <p className="movie-overview">{movie.overview}</p>}
        {amazonUrl && (
          <a
            className="affiliate-link"
            href={amazonUrl}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
          >
            Find on Amazon <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}
