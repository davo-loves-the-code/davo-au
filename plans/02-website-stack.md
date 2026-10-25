# Small, durable website for davo.au

## Goal

Launch a fast, low-risk personal site that initially says “Hello, this is Davo” and can later grow into a blog and a links page for SoundCloud, GitHub, and other profiles. The site does not initially need accounts, comments, a database, a CMS, or a server-side application.

## Recommended stack

- **Content format:** Markdown for blog posts and simple HTML for the landing page.
- **Static site generator:** Jekyll is the recommended default if GitHub Pages is selected. GitHub supports it directly and it handles Markdown pages and blog posts without a custom build pipeline. It uses Ruby and Liquid templates. If the owner prefers Eleventy (11ty), use a GitHub Actions workflow to build and deploy it; the resulting site is still static HTML/CSS.
- **Runtime/build:** For Jekyll, use the version supported by GitHub's Pages Actions and pin the local Ruby/Bundler dependencies in a Gemfile and lockfile if building locally. For Eleventy, pin Node.js LTS in `.nvmrc` or `.node-version`, commit `package-lock.json`, and use `npm ci` in Actions.
- **Template language:** Liquid for Jekyll or Nunjucks for Eleventy. Keep templates small and escape untrusted content by default.
- **CSS:** plain CSS with a small design-token section; no CSS framework needed for this scale. Use system fonts initially.
- **Source control/deploy:** Git repository, with a host's Git-based build/deploy integration or a documented local build-and-upload path. Hosting choice is in `01-hosting-options.md`.
- **No JavaScript framework initially:** it adds a bundle, dependencies, browser-side attack surface, and maintenance without helping a plain intro/blog site.

Jekyll is the most direct fit with GitHub Pages because Pages has built-in support and GitHub recommends it. Eleventy remains a good modern option if its templating/build workflow is preferred, with the small extra step of setting up GitHub Actions. Other sound choices are Hugo (Go-based, very fast, few runtime dependencies) or hand-written HTML.

## Initial content and structure

```text
src/
  _data/site.json
  _includes/layouts/base.html
  assets/site.css
  index.njk
  about.md
  links.njk
  blog/blog.11tydata.js
  blog/first-post.md
_config.yml
Gemfile
Gemfile.lock
README.md
```

For the Jekyll path, use `_layouts/default.html`, `_includes/`, `_posts/YYYY-MM-DD-title.md`, `index.md`, and `about.md`; the tree above is illustrative rather than a required layout. Do not add both Jekyll and Eleventy toolchains unless there is a reason.

The `index.njk` page can render a concise greeting, one or two sentences about Davo, and links to `about` and `links`. Store public profile URLs in one data file to make edits easy. Blog posts should have title, date, summary, and tags in front matter. Add a feed later if useful; RSS is a small static feature and requires no runtime.

## Security and quality defaults

1. **Keep it static.** No login form, comments, database, contact form, or runtime API until a concrete need appears. Link to external profiles rather than embedding third-party widgets.
2. **Minimize dependencies.** Use only Eleventy plus a template package if it is not bundled; commit the lockfile. Avoid unmaintained plugins and dependencies used only for convenience.
3. **Build reproducibly.** Pin Node LTS, use `npm ci`, and have the host run a clean build from the lockfile. Do not commit generated credentials or provider tokens.
4. **Keep secrets out of Git.** If deployment needs a token, store it in the host's secret settings, give it minimum scope, and rotate it if exposed.
5. **Escape content.** Use template autoescaping. Do not mark Markdown or user-provided strings as safe HTML without sanitizing them.
6. **Avoid client-side code where possible.** If analytics is later added, prefer privacy-respecting, minimal collection and disclose it as appropriate. Avoid ad/tracking scripts by default.
7. **Accessible HTML:** semantic headings, descriptive link text, keyboard-visible focus, adequate contrast, responsive viewport, alt text for meaningful images, and reduced-motion support if animation is introduced.
8. **Safe response headers:** configure HTTPS and headers at the host/reverse proxy. Start with `X-Content-Type-Options: nosniff`, a restrictive `Referrer-Policy`, and a CSP tailored to actual assets; do not blindly copy a CSP that blocks the site or add HSTS until HTTPS and redirects are confirmed.
9. **Updates:** review Node/Eleventy updates periodically and rebuild/deploy. Enable dependency update notices if the Git host offers them. A static site still depends on its build chain and hosting account.
10. **Backups:** Git is the source backup, but use a second remote or periodic local clone/export for important writing. Keep host configuration and DNS values documented separately from secrets.

## Suggested implementation sequence

1. Install Git. If using Jekyll, install Ruby/Bundler and follow GitHub's supported Jekyll setup; if using Eleventy, install supported Node.js LTS.
2. Create a dedicated public repository on GitHub Free. GitHub Pages is intended for public sites; keep private material and secrets out of the repository and generated output.
3. Choose one build path: Jekyll with Pages' supported workflow, or Eleventy with a GitHub Actions Pages deployment workflow. Commit dependency lockfiles.
4. Add a minimal base layout with charset, viewport, page title, description, semantic `main`, and footer.
5. Add homepage greeting, an About page, and a Links page. Make outbound links explicit and easy to maintain.
6. Add CSS for readable line length, responsive spacing, visible focus, and dark/light preference if desired.
7. Add one Markdown blog post as a template for later writing.
8. Build locally and inspect the generated output; check links and ensure no secrets or accidental private files are published.
9. Connect Pages and GitHub Actions if needed. Configure custom domain and TLS using `01-hosting-options.md` and `03-https-tls.md`.
10. Keep the repository README current with local build, deploy, content, and recovery steps.

## Growth path

- **Blog:** add Markdown files and a collection; generate archive and tag pages.
- **RSS:** generate `feed.xml` from the same collection.
- **Contact:** publish `daddy@davo.au` as a `mailto:` link once the mailbox is working. Avoid an unauthenticated form endpoint unless spam handling and privacy needs are understood.
- **Search:** defer until content justifies it; a client-side index can be generated statically.
- **CMS:** only add if editing Markdown in Git becomes a real problem. A CMS introduces accounts, authentication, plugins, and a new attack surface.
- **Dynamic features:** put a needed API on a separate managed service/subdomain rather than converting the whole site into a server app.

## Alternatives

- **Hand-written HTML/CSS:** safest in terms of dependencies and sufficient for only one page, but blogging becomes manual.
- **Hugo:** good if the owner is comfortable installing a Go binary and wants very fast builds with few runtime dependencies.
- **Astro:** strong modern content-site framework, but has more concepts and dependencies than needed initially. Consider if the site later needs rich interactive components.
- **WordPress:** provides a mature editing UI, but requires routine core/plugin/theme updates, database backups, and stronger hardening. It is not the default choice for a mostly-static personal homepage.

## Source references

- GitHub Pages Jekyll support: https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll
- GitHub Pages custom workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Jekyll documentation: https://jekyllrb.com/docs/
- Eleventy documentation: https://www.11ty.dev/docs/
- Node.js release schedule: https://github.com/nodejs/release
- OWASP Cheat Sheet Series (Content Security Policy, XSS prevention, HTTP headers): https://cheatsheetseries.owasp.org/
