# Downloadable files

Drop attachable files here (source zips, packaged `.jar` builds, PDFs, a
marketing portfolio, whatever) and point to them from `js/data.js`.

- `files/projects/` — for the four Tech Projects
- `files/experience/` — for Work, Volunteer, or Extracurricular entries

Each project or experience entry in `data.js` has a `downloads` array:

```js
downloads: [
  { label: "Source Code (.zip)", path: "files/projects/erm-source.zip" },
  { label: "Marketing Portfolio (.pdf)", path: "files/experience/reswipe-marketing-portfolio.pdf" }
]
```

An empty array (`downloads: []`) renders nothing, so it's safe to leave
entries empty until you have a file to attach. Once you add one, it shows
up as a download link in that project/entry's modal automatically, no
other code changes needed.
