# Cinesearch

A responsive movie search app built with React and Vite. It runs immediately with a small sample catalog; add a TMDB API key to search the full movie database.

## Run locally

```sh
npm install
npm run dev
```

## Search the full catalog

Create a `.env` file in the project root and add your TMDB API key:

```sh
VITE_TMDB_API_KEY=your_tmdb_api_key
```

Restart the dev server after adding the key. Without a key, searches use the sample catalog bundled with the app. The key is used by the browser to call TMDB directly, so use a key intended for client-side applications and configure allowed domains in your TMDB account where available.

## Affiliate links

Cinesearch can add Amazon Associates links to each movie card. Apply to the Amazon Associates program and, after approval, add your tracking tag to `.env`:

```sh
VITE_AMAZON_ASSOCIATES_TAG=your-associates-tracking-tag
```

Restart the dev server or rebuild and redeploy after changing environment variables. Links and the affiliate disclosure appear only when the tag is configured. The tag is included in the public frontend, so it is not a secret. You must be accepted into the program and follow its current linking, disclosure, and operating requirements. Commissions are not guaranteed and depend on qualifying purchases, traffic, and program terms.

## Build

```sh
npm run build
npm run preview
```

The `public/_redirects` file configures SPA fallback for static hosts that support Netlify-style redirects.
