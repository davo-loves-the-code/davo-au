# HTTPS and TLS for davo.au

## What TLS does and why the site needs it

HTTPS is HTTP carried inside TLS. It encrypts browser-to-site traffic, detects tampering in transit, and authenticates that the browser has reached a server authorized for the requested hostname. Use HTTPS for every public page, even a static “hello” page: visitors expect it, browsers increasingly restrict features on plain HTTP, and future links/forms should not require a later migration. HTTPS does not prove that the site owner is trustworthy or secure a compromised server.

A certificate is the public credential a browser validates. Its private key must remain on the host/proxy or managed provider. For a public website, use a publicly trusted certificate, generally issued and renewed automatically through the ACME protocol (Let's Encrypt is a common free CA), or the host's managed certificate service.

## Preferred path: managed static host

A static host such as GitHub Pages, Netlify, or Vercel can provision and renew the certificate after the custom domain is configured and validated. Follow that provider's custom-domain sequence, then add exactly the records it provides to Porkbun DNS. Wait for DNS and certificate issuance, test both apex and `www` hostnames, and configure one canonical hostname with a permanent redirect.

There is a provider compatibility issue: Cloudflare Pages custom apex domains require the domain to be a Cloudflare zone using Cloudflare nameservers. That would move authoritative DNS away from Porkbun. If Porkbun DNS must remain authoritative, either select a host that supports external DNS for the apex, or host `www.davo.au` on the provider and set up root forwarding at a compatible service. Do not assume CNAME at the DNS apex is supported by all DNS providers.

## Self-hosted path: Caddy or Nginx + ACME

For a small VM, **Caddy** is the easiest default: it obtains and renews certificates automatically for configured hostnames, handles HTTP-to-HTTPS redirects, and serves as a reverse proxy or static file server. **Nginx** is also proven and widely documented, but certificate issuance/renewal normally needs Certbot or another ACME client plus explicit renewal and redirect configuration.

A typical public VM deployment:

1. Set Porkbun A/AAAA records for the chosen hostname to the VM's public IP. Publish AAAA only if IPv6 is actually routed and firewalled correctly.
2. Permit inbound TCP 80 and 443 in both the cloud security group/firewall and host firewall. Port 80 is commonly used for HTTP-01 ACME validation and to redirect visitors to HTTPS. Alternatively use DNS-01 validation with a carefully scoped DNS API token; this avoids opening port 80 but creates a powerful DNS credential to protect.
3. Configure Caddy with `davo.au` and `www.davo.au`, or Nginx with equivalent `server_name` blocks and a maintained ACME client.
4. Ensure the application listens only on localhost or a private interface behind the reverse proxy; do not expose its development server directly.
5. Keep automatic certificate renewal enabled and monitor it. ACME certificates are intentionally short-lived; the renewal automation is part of the design.
6. Test HTTP redirect, certificate chain/hostname, expiry, TLS versions, and both hostnames with browser tools or SSL Labs. Check logs after renewal.

Never copy a certificate private key into the source repo or a public backup. Restrict its file permissions and access to the web-server account. If using a Cloudflare proxy/tunnel, understand the visitor-to-edge and edge-to-origin TLS modes: use authenticated TLS to the origin where supported, not a setting that silently leaves edge-to-origin traffic unencrypted.

## Home server path

The TLS setup is mostly the same, but internet reachability must work first. A direct setup needs a reachable public IPv4/IPv6 address, router forwarding for TCP 80/443 (or DNS-01), host firewalling, and DDNS if the address changes. Dynamic IP changes can cause downtime before DNS updates. For a tunnel, the tunnel provider terminates visitor TLS and forwards traffic over its tunnel; use HTTPS between tunnel agent and local origin too if that hop crosses a network you do not trust.

## Recommended TLS settings and headers

- Allow TLS 1.2 and TLS 1.3; disable obsolete SSL/TLS protocols and weak cipher suites (managed hosts handle this).
- Redirect HTTP to HTTPS and choose one canonical hostname.
- Add HSTS only after HTTPS works consistently on the apex and all included subdomains. Start with a modest `max-age`; avoid `includeSubDomains` and preload until every subdomain is HTTPS-ready, because HSTS can make mistakes persistent for visitors.
- Add a Content Security Policy based on actual assets, `X-Content-Type-Options: nosniff`, and an appropriate `Referrer-Policy`. Headers supplement TLS and do not replace it.
- Do not use a self-signed certificate for a public website; browsers will show warnings and visitors cannot validate it through the public trust system.

## Practical recommendation

For this small static site, select a managed host that provisions HTTPS and accepts custom domains with Porkbun DNS. This provides automatically operated TLS without running an ACME client. If choosing a VPS for learning, use Caddy first; select Nginx if you specifically want to learn its configuration or need compatibility with an existing stack.

## Sources checked (2026-10-25)

- Let's Encrypt getting started / ACME: https://letsencrypt.org/getting-started/
- Let's Encrypt challenge types: https://letsencrypt.org/docs/challenge-types/
- Caddy automatic HTTPS: https://caddyserver.com/docs/automatic-https
- Certbot instructions: https://certbot.eff.org/instructions
- Cloudflare Pages custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Cloudflare proxy modes: https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/
- OWASP HTTP Strict Transport Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
