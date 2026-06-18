# Cian E. Joseph — Photography Portfolio

A fast, single-page photography portfolio. No build step, no frameworks —
just HTML, CSS, and a little JavaScript. Deploys anywhere static.

## Live site
Hosted on GitHub Pages. URL is shown in the repo's **Settings → Pages**.

---

## Adding your photos (the only thing you need to do)

1. Drop your image files into the **`photos/`** folder.
   (JPG or WebP recommended; aim for the long edge ~2000px for fast loading.)
2. Open **`assets/js/photos.js`** and add one entry per photo:

   ```js
   { src: "photos/frame-25.jpg", title: "An optional caption" },
   ```

3. Save, commit, and push — the site updates automatically.

- `title` is optional; it shows on hover and in the lightbox.
- Order in the list = order on the page (one continuous gallery).

## Personalizing
- **Email / socials:** edit the Contact section in `index.html`
  (search for `ellampally2@gmail.com` and the `data-social` links).
- **Bio:** edit the About section text in `index.html`.
- **Portrait photo:** replace the `.about__portrait` placeholder block in
  `index.html` with an `<img>`.
- **Colors:** tweak the CSS variables at the top of `assets/css/style.css`.

## Pointing your own domain at it (once you buy one)
1. Add a file named `CNAME` at the repo root containing just your domain,
   e.g. `cianjoseph.com`.
2. At your domain registrar, add DNS records:
   - Apex (`@`): four `A` records → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `www`: a `CNAME` → `<your-github-username>.github.io`
3. In GitHub **Settings → Pages**, set the custom domain and enable
   "Enforce HTTPS".

## Run locally
```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
