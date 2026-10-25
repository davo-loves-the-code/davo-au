# Small, durable website for davo.au

## Goal

Launch a fast, low-risk personal site that initially says “Hello, this is Davo” and can later grow into a blog and a links page for SoundCloud, GitHub, and other profiles. The site does not initially need accounts, comments, a database, a CMS, or a server-side application.

## Recommended stack

- **Content format:** Markdown for blog posts and simple HTML for the landing page.
- **Static site generator:** Eleventy (11ty), using its stable release and built-in layouts/collections. It outputs ordinary HTML/CSS, so the deployed site has no client-side JavaScript requirement.
- **Runtime/build:** Node.js LTS, pinned in `.nvmrc` or `.node-version`; commit `package-lock.json`; use `npm ci` in automated builds.
- **Template language:** Nunjucks or Liquid, selected once and used consistently. Keep templates small and escape untrusted content by default.
- **CSS:** plain CSS with a small design-token section; no CSS framework needed for this scale. Use system fonts initially.
- **Source control/deploy:** Git repository, with a host's Git-based build/deploy integration or a documented local build-and-upload path. Hosting choice is in `01-hosting-options.md`.
- **No JavaScript framework initially:** it adds a bundle, dependencies, browser-side attack surface, and maintenance without helping a plain intro/blog site.

Eleventy is a mature, open-source static site generator. Other sound choices are Hugo (Go-based, very fast, fewer Node dependencies) or a hand-written HTML site. For this beginner-friendly plan, 11ty gives approachable Markdown content and flexible templates without turning a simple page into an app.

## Initial content and structure

```text
src/
  _data/site.json
  _includes/layouts/base.njk
  assets/site.css
  index.njk
  about.md
  links.njk
  blog/blog.11tydata.js
  blog/first-post.md
.eleventy.js
package.json
package-lock.json
README.md
```

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

1. Install a supported Node.js LTS and Git.
2. Create a new Eleventy starter with a pinned version; commit the generated lockfile.
3. Add a minimal base layout with a charset, viewport, page title, description, semantic `main`, and footer.
4. Add homepage greeting, an About page, and a Links page. Make outbound links explicit and easy to maintain.
5. Add CSS for readable line length, responsive spacing, visible focus, and dark/light preference if desired.
6. Add one Markdown blog post as a template for later writing.
7. Build locally and inspect generated `_site/` output; check all links and ensure no accidental source or configuration files are published.
8. Connect the repository to the chosen host; use the host's supported custom-domain and HTTPS workflow. DNS details remain in Porkbun as described in `01-hosting-options.md` and TLS is covered in `03-https-tls.md`.
9. Configure redirects so one canonical hostname is used (`davo.au` or `www.davo.au`) and the other redirects to it.
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

- Eleventy documentation: https://www.11ty.dev/docs/
- Node.js release schedule: https://github.com/nodejs/release
- OWASP Cheat Sheet Series (Content Security Policy, XSS prevention, HTTP headers): https://cheatsheetseries.owasp.org/
