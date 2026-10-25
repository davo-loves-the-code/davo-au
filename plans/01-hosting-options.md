# Hosting options for davo.au

**Scope:** Public website hosting only. Domain registration and authoritative DNS stay at Porkbun. The mail plan is in `04-email.md`.

## Recommendation

For the current site (a small personal landing page, later a blog and social links), use static hosting with a managed provider. It is the least costly and lowest-maintenance fit: no server to patch, no runtime to keep alive, and HTTPS is generally included. Keep Porkbun as registrar and DNS host; configure records there to point to the selected host.

If learning Linux operations is part of the goal, use a small cloud VM. If the goal is specifically to experiment with a home server, Singtel fibre can be a workable learning environment after checking that the router has a publicly reachable address and supports port forwarding. These are valid options, but each adds availability and security work.

## Options

| Option | Typical cost | Advantages | Trade-offs |
|---|---:|---|---|
| Cloudflare Pages (static) | $0 for a small static site under current free-plan limits | No OS/server maintenance; custom domains; static assets served globally; easy Git-based deploys | Site build/deploy is coupled to Cloudflare; limited to static output unless adding Workers; custom apex domain requires moving authoritative DNS to Cloudflare, so this conflicts with keeping DNS at Porkbun |
| GitHub Pages (static) | $0 for eligible public repositories; private repo support depends on plan | Mature, simple hosting for HTML/Jekyll; custom domain; low maintenance | Static only; provider limits and terms apply; careful DNS/TLS setup; deploying source from GitHub becomes a dependency |
| Netlify or Vercel (static) | Free tiers may fit personal use; verify current limits and commercial-use terms | Convenient Git deploys and custom-domain TLS; static blog generators work well | Free plan limits/terms can change; platform lock-in; app features can incur charges |
| Low-cost Singapore VPS | Hetzner Singapore entry CPX12: listed at USD $17.99/month excluding VAT after June 2026 change; other providers vary | Full control; Singapore region; can host static site and backend; good sysadmin learning | You patch OS and software, secure SSH, configure firewall, monitor, back up, and manage outages; VM is not automatically secure; public IPv4 may cost extra |
| Home machine on Singtel fibre | Usually no extra hosting fee beyond electricity/internet; optional hardware/UPS/domain dynamic DNS costs | Maximum hands-on learning; local control; can repurpose an always-on mini PC | Home power/router/ISP outages take site offline; port forwarding and public IP reachability need confirmation; changing IP needs DDNS; home network is exposed to scans/attacks; upload capacity and latency vary |
| Home machine via outbound tunnel | Often $0 for modest personal use | No inbound router ports required; can publish from behind NAT; easier than port forwarding | A third party becomes a required traffic intermediary; service and account dependency; not portable in the same way as direct DNS-to-origin |

### Price notes

Prices move. Hetzner's official Singapore price schedule lists CPX12 at **USD $17.99/month excluding VAT** from 15 June 2026, with IPv4 excluded from the table price; the same schedule lists Singapore CPX22 at USD $30.99/month. A personal static site is unlikely to need either size; compare regional entry plans before provisioning. A cheaper VM in another region may be available, but increases latency somewhat and could have different bandwidth/IPv4 pricing. Use provider calculators and include VAT, IPv4, snapshots/backups, and egress in the comparison.

Cloudflare Pages' current docs list free static asset requests as unlimited and 500 builds/month, with custom domain and file limits; functions have separate Workers quotas. Always recheck terms/limits before relying on a free tier.

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

- **Lowest cost, least upkeep:** choose a static host with free custom-domain support that accepts Porkbun DNS. A static site generator can produce the same HTML that any web server would serve.
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
