# Hosting options for davo.au

**Scope:** Public website hosting only. Domain registration and authoritative DNS stay at Porkbun. The mail plan is in `04-email.md`.

## Recommendation

For the current site (a small personal landing page, later a blog and social links), use static hosting with a managed provider. It is the least costly and lowest-maintenance fit: no server to patch, no runtime to keep alive, and HTTPS is generally included. Keep Porkbun as registrar and DNS host; configure records there to point to the selected host.

If learning Linux operations is part of the goal, use a small cloud VM. If the goal is specifically to experiment with a home server, Singtel fibre can be a workable learning environment after checking that the router has a publicly reachable address and supports port forwarding. These are valid options, but each adds availability and security work.

## Options

| Option | Typical cost | Advantages | Trade-offs |
|---|---:|---|---|
| Cloudflare Pages (static) | $0 for a small static site under current free-plan limits | No OS/server maintenance; custom domains; static assets served globally; easy Git-based deploys | Site build/deploy is coupled to Cloudflare; limited to static output unless adding Workers; custom apex domain requires moving authoritative DNS to Cloudflare, so this conflicts with keeping DNS at Porkbun |
| GitHub Pages (static) | $0 for a public repository on GitHub Free; custom domain and HTTPS included | Mature, simple hosting for HTML/Jekyll; custom domain works with Porkbun DNS; low maintenance | Static only; source repo is public on Free; provider limits/terms apply; GitHub is a deployment dependency |
| Netlify or Vercel (static) | Free tiers may fit personal use; verify current limits and commercial-use terms | Convenient Git deploys and custom-domain TLS; static blog generators work well | Free plan limits/terms can change; platform lock-in; app features can incur charges |
| Low-cost Singapore VPS | Hetzner Singapore entry CPX12: listed at USD $17.99/month excluding VAT after June 2026 change; other providers vary | Full control; Singapore region; can host static site and backend; good sysadmin learning | You patch OS and software, secure SSH, configure firewall, monitor, back up, and manage outages; VM is not automatically secure; public IPv4 may cost extra |
| Home machine on Singtel fibre | Usually no extra hosting fee beyond electricity/internet; optional hardware/UPS/domain dynamic DNS costs | Maximum hands-on learning; local control; can repurpose an always-on mini PC | Home power/router/ISP outages take site offline; port forwarding and public IP reachability need confirmation; changing IP needs DDNS; home network is exposed to scans/attacks; upload capacity and latency vary |
| Home machine via outbound tunnel | Often $0 for modest personal use | No inbound router ports required; can publish from behind NAT; easier than port forwarding | A third party becomes a required traffic intermediary; service and account dependency; not portable in the same way as direct DNS-to-origin |

### Price notes

Prices move. Hetzner's official Singapore price schedule lists CPX12 at **USD $17.99/month excluding VAT** from 15 June 2026, with IPv4 excluded from the table price; the same schedule lists Singapore CPX22 at USD $30.99/month. A personal static site is unlikely to need either size; compare regional entry plans before provisioning. A cheaper VM in another region may be available, but increases latency somewhat and could have different bandwidth/IPv4 pricing. Use provider calculators and include VAT, IPv4, snapshots/backups, and egress in the comparison.

Cloudflare Pages' current docs list free static asset requests as unlimited and 500 builds/month, with custom domain and file limits; functions have separate Workers quotas. Always recheck terms/limits before relying on a free tier.

### GitHub Pages detail

GitHub Pages is now the leading recommendation if keeping Porkbun DNS is important and a public source repository is acceptable. Its current Pages limits are generous for a personal site: the published site may be up to 1 GB, bandwidth has a soft limit of 100 GB/month, and built-in publishing has a soft limit of 10 builds/hour (the build-rate limit does not apply to custom GitHub Actions publishing). Deployments time out after 10 minutes. GitHub may contact the owner or stop serving a site that substantially exceeds limits. Pages is intended for static pages showcasing personal/organizational projects, and is not allowed as free hosting for an online business, e-commerce site, or SaaS primarily facilitating transactions.

GitHub Free requires the Pages source repository to be public. The site itself is public regardless of whether its source repo is public or private, so never place secrets, drafts, or private information in content that will be built and published. GitHub Free Pages works with public repositories; private repository Pages requires a paid GitHub plan. A static personal blog is an intended use.

Setup outline for `davo.au`:

1. Create a dedicated repository, preferably named `<github-username>.github.io` for a user site. Enable Pages in repository Settings. Use Jekyll for the simplest built-in Markdown blog path, or use a GitHub Actions workflow to build Eleventy or another static generator.
2. In GitHub account Settings > Pages, add and verify `davo.au` by publishing the GitHub-provided TXT challenge record in Porkbun DNS. Keep the TXT record. Verification prevents other GitHub accounts from attaching the domain to their Pages sites.
3. In the repository's Settings > Pages, enter the custom domain before creating its website DNS records.
4. In Porkbun DNS, add apex A records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Optionally add the documented AAAA records for IPv6. Add `www` as a CNAME to `<username>.github.io` (without a repository path). Remove conflicting/default apex A/AAAA/ALIAS/ANAME records. Do not add wildcard records.
5. Wait for DNS propagation and GitHub's certificate provisioning; then enable “Enforce HTTPS”. GitHub's current docs say this may take up to 24 hours to become available. Configure both apex and `www`; Pages automatically redirects between them based on the custom domain setting.
6. Keep Porkbun's mail-related MX and TXT records alongside the website A/AAAA/CNAME and GitHub verification TXT records. Website DNS and mail DNS coexist in the same zone.

GitHub's exact setup and provider-specific DNS/HTTPS guidance are linked below. Re-check the limits and feature eligibility before launch because service terms can change.

## Singtel home-hosting feasibility checks

Singtel support material documents router port-forwarding capability, but this does not establish the configuration of this particular line/router or guarantee inbound reachability. Before planning direct exposure:

1. Compare the router's WAN IPv4 address with the IPv4 reported by an external IP-check page. If they differ, investigate upstream NAT/CGNAT; ordinary port forwarding will not be sufficient through CGNAT.
2. Confirm that the router permits forwarding TCP 80 and 443 to a separate, patched server, and that Singtel does not block the required inbound traffic on this plan.
3. Check whether a stable public IPv6 address is available and how firewalling works; do not assume IPv6 removes the need for firewall rules.
4. Use a dedicated machine/container or isolated VLAN, not a daily-use workstation. Keep no sensitive personal files on the exposed host.
5. Add a DDNS updater if the public IP can change. Porkbun has an API/DDNS workflow; verify that updates are authenticated with a narrowly scoped secret.
6. Keep the router and host patched, expose only required ports, and have a recovery path if the machine or router is compromised.

Do not host email on this home connection. Residential IP reputation, reverse DNS, outbound SMTP restrictions, and delivery reliability make this a poor fit; see `04-email.md`.

## Porkbun DNS implications

Porkbun says DNS management is included with domain registration and provides DNSSEC and API features. Keep Porkbun DNS by using its nameservers and creating records in its DNS panel. Typical patterns:

- Static host on a subdomain (for example `www`): create the host-directed CNAME/TXT records required by the provider.
- Apex (`davo.au`): providers differ. Some require ALIAS/ANAME, an A/AAAA record, or use of their own DNS nameservers. Confirm apex support before choosing a host.
- VPS: create A (and optionally AAAA) records for the server; use a short TTL during migration, then raise it once stable.
- Home server: point A/AAAA records to the reachable public address and automate changes if dynamic.

Porkbun's free DNS is not the same thing as Porkbun website hosting. Some providers, notably Cloudflare Pages custom apex setup, require Cloudflare authoritative nameservers. If keeping Porkbun DNS is a firm requirement, select a host that supports custom apex domains with external DNS, or serve the site on `www.davo.au` and configure root-domain forwarding if supported. Verify behavior before switching nameservers.

## Practical recommendation by goal

- **Lowest cost, least upkeep:** GitHub Pages with a public repo, Jekyll or a GitHub Actions static build, and Porkbun DNS. This is a strong fit for a personal landing page/blog. Keep a local Git clone and optionally a second remote so the site can move if needs or platform terms change.
- **Learn server administration:** small Ubuntu LTS VPS in Singapore, configure a cloud firewall and host firewall, SSH keys only, automatic security updates, a non-root admin, and automated off-site backup. Use Caddy or Nginx as the web front end. Keep mail elsewhere.
- **Learn home networking:** use a dedicated low-power device; first test inbound IPv4/IPv6 and router forwarding. If unavailable, use a tunnel for the web service, understanding the provider dependency. Do not open SSH to the public internet; administer over a VPN or provider console.

## Sources checked (2026-10-25)

- Porkbun DNS management: https://porkbun.com/products/dns_management
- Porkbun DNS record instructions: https://kb.porkbun.com/article/231-how-to-add-dns-records-on-porkbun
- Singtel router manual (port forwarding/Dynamic DNS menus): https://www.singtel.com/content/dam/singtel/personal/support/broadband/broadband-troubleshooting/aztechdsl7009gr%28ac%29/FG7009GR%28AC%29-User-Manual-May2015.pdf
- Hetzner Singapore pricing: https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/
- Hetzner Singapore location: https://www.hetzner.com/cloud-singapore/
- Cloudflare Pages custom domains (apex requires Cloudflare zone/nameservers): https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare Tunnel (outbound tunnel; no inbound ports): https://developers.cloudflare.com/tunnel/concepts/
- GitHub Pages custom-domain setup: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- GitHub Pages HTTPS: https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- GitHub Pages limits: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- GitHub Pages terms / prohibited uses: https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features
- GitHub Pages domain verification: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages

### Community-reported GitHub Pages downsides

Reddit discussions about personal portfolios and blogs are broadly positive for simple static sites, while repeatedly calling out a few boundaries. These are user reports and opinions; use GitHub's official limits and terms above as the authoritative source:

- **Static-only:** no server-side runtime, database, login system, or built-in comments. A separate backend/service is needed if those features become necessary.
- **Public source on the free plan:** current GitHub documentation confirms a GitHub Free Pages repository must be public. The generated website is public either way, so source visibility is not a major issue for ordinary HTML, but drafts/secrets should not be committed.
- **Git-based workflow:** updates happen through commits/pushes; there is no ordinary FTP/drag-and-drop authoring workflow. This is convenient for a developer and less friendly for someone who wants a visual editor.
- **Custom domains require careful DNS setup:** users report confusion around missing repository Pages settings, stale DNS, and HTTPS delays. GitHub's docs explain the process; verify the domain first, then configure it, and keep DNS records accurate.
- **Provider limits and account dependency:** bandwidth/build limits are soft, and GitHub can restrict a site if usage or acceptable-use rules are exceeded. Keeping the source in Git makes migration feasible, but Pages availability still depends on the GitHub account/repo.
- **Occasional access/performance anecdotes:** some Reddit users report slow serving or access issues on corporate networks/VPNs. Reports are isolated and not a measured reliability comparison; for this low-traffic personal site they are not enough to outweigh the simplicity/cost advantage.

For this project, the meaningful downsides are public source and no dynamic backend. If the site stays a landing page and blog, neither requires a different host. If those boundaries become unacceptable, keep the generated static site and move the build output to another static host or VM; the domain and email setup can stay in Porkbun.

Reddit examples consulted:

- Personal site/blog suitability and static-only trade-off: https://www.reddit.com/r/github/comments/1kgyq0d/can_i_use_github_pages_for_my_personal_website/
- Portfolio hosting and lack of backend: https://www.reddit.com/r/webdev/comments/18cljfl/hosting_portfolio_on_github_pages/
- Personal site future growth; static site can keep a separate backend: https://www.reddit.com/r/github/comments/1tp2qqn/github_pages_doubt/
- Custom domain setup and takeover protection discussion: https://www.reddit.com/r/github/comments/1ivi369/security_when_linking_a_domain_to_github_pages/
