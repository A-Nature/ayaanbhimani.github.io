# Images / Video

Drop media files into these folders, then point to them from `js/data.js`:

- `images/projects/` — screenshots or clips for each project (`media.src` on each project entry)
- `images/experience/` — photos/logos for work, volunteer, or extracurricular entries (`media.src` on each experience entry)
- `images/misc/` — anything else (favicon, OG image, etc.)

Each entry in `data.js` has a `media` object like:

```js
media: {
  type: "image", // or "video"
  src: null,      // set to e.g. "images/projects/erm-01.jpg"
  alt: "ERM gameplay screenshot"
}
```

Until `src` is set, that modal's media slot doesn't render at all (no placeholder box). Once you fill in the path, it appears automatically, no HTML or CSS changes needed.

See also `files/README.md` for attaching downloadable files (source code, packaged builds, PDFs) instead of or alongside media.
