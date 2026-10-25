# Email for daddy@davo.au

## Clarify what “email server” means

For the requested address, the practical target should be a **hosted mailbox on the custom domain**, not necessarily software you operate yourself. A mailbox lets you receive and send as `daddy@davo.au` through webmail or an email client. Forwarding only redirects inbound mail to another inbox and generally does not itself provide a reliable way to send as that address.

Running your own mail-transfer and mailbox stack is a separate, ongoing operations project. The hard parts are spam filtering, secure authentication, reputation, reverse DNS, backups, abuse handling, and deliverability; the SMTP daemon is only one part.

## Recommended option

Use Porkbun hosted email for the simplest single address, or another hosted mail provider if it better fits the desired security/client features. Porkbun currently lists its mailbox at **USD $36/year** after a 15-day trial with a new domain, 10 GB storage, webmail, POP3 and IMAP; confirm current pricing at purchase. It also includes up to 20 forwards. An external provider may offer a different security model and price.

Do not put the website VM and the mailbox on the same server. A website can be restored from Git; a lost mail store and a sender reputation failure are harder to recover from. Hosted mail keeps mail availability, filtering, TLS endpoints, and outbound reputation with a provider that specializes in email.

## Setup sequence with Porkbun hosted mail

1. Confirm `davo.au` registration succeeds and that the registrant is eligible for `.au` under auDA rules. Eligibility is a prerequisite, independent of hosting.
2. Add the hosted mailbox in Porkbun and choose `daddy` as the mailbox name.
3. In Porkbun DNS, publish the MX records and any verification/autoconfiguration records the current Porkbun email setup page specifies. Do not guess mail hostnames or priorities; use the provider's exact current values.
4. Publish one SPF record authorizing the provider's outbound senders. Only one SPF TXT record should exist at a hostname; merge authorized senders rather than creating multiple SPF records.
5. Enable DKIM in the mail provider and publish the exact selector TXT/CNAME records it supplies.
6. Start DMARC in monitoring mode, for example a policy equivalent to `p=none` with a mailbox or reporting service to receive aggregate reports. Review reports and ensure all legitimate senders pass and align.
7. After observing reports and confirming every legitimate sender is covered, move gradually to `quarantine`, then optionally `reject`. Avoid enforcing a strict policy before all services that send as `@davo.au` (newsletter, website, scanners, etc.) are included.
8. Test inbound from at least two external providers and outbound to Gmail/Outlook. Inspect message headers for SPF, DKIM, and DMARC pass; test replies and spam-folder placement.
9. Use a unique strong mailbox password and MFA if offered. Secure the Porkbun registrar account with MFA and recovery codes because DNS changes can redirect all mail.
10. Keep a recovery path and export important messages periodically. Understand retention, account recovery, and provider cancellation behavior.

## DNS record roles

- **MX:** tells the world which service receives mail for `davo.au`.
- **SPF TXT:** lists which outbound servers are permitted to send for the domain/envelope sender.
- **DKIM TXT/CNAME:** publishes the public key used to verify the provider's cryptographic signature on sent messages.
- **DMARC TXT:** tells receiving systems how to handle messages failing SPF/DKIM alignment and where to send reports.
- **Autoconfig records:** may help clients discover IMAP/SMTP settings; use the provider's instructions.

Mail hostnames must be DNS-only if using a DNS provider with an HTTP proxy; ordinary SMTP/IMAP protocols should not resolve to an HTTP proxy address. With Porkbun DNS, enter the records the mail provider specifies.

## Email forwarding option

If the only requirement is to receive messages and have them arrive at an existing inbox, Porkbun's free forwarding may be enough. It does not provide a mailbox on its own and receiving-only forwarding is less useful if you need to reply as `daddy@davo.au`. Sending from a forwarded identity often requires separately configuring a provider that supports authenticated custom-domain sending; do not use a forged From header.

## If self-hosting is a learning goal

Use a dedicated VPS, not a home Singtel connection. A full mail stack commonly includes an MTA (such as Postfix), IMAP store/server (such as Dovecot), spam filtering, DKIM signing, TLS certificates, and webmail/client access. A maintained mail-suite container can reduce setup effort but does not remove operations work.

Before choosing this path, verify the VPS provider permits outbound TCP/25 and provides reverse-DNS/PTR configuration. Ensure the sending IP is not on blocklists and has stable reputation. Configure:

- Static public IP, matching PTR and forward DNS (`mail.davo.au` -> IP; IP PTR -> `mail.davo.au`).
- MX pointing to `mail.davo.au`.
- SMTP submission on 587 with STARTTLS and authentication; never operate an open relay.
- SMTP server-to-server delivery on 25 with TLS support.
- IMAPS on 993 if offering IMAP; disable insecure plaintext access from public networks.
- SPF, DKIM, and DMARC with alignment, plus correct HELO/EHLO hostname.
- Spam/virus filtering, rate limits, brute-force protection, monitoring, alerting, automated security updates, tested encrypted backups, and a disaster-recovery process.
- Strict separation of mail accounts and admin credentials; MFA for webmail/admin where supported.

Home residential IPs commonly have weak mail reputation, dynamic addressing, absent reverse DNS, or port-25 restrictions. A tunnel/proxy designed for web traffic does not solve SMTP delivery. Do not attempt to use Cloudflare's normal HTTP proxy for SMTP/IMAP.

## Recommendation

For one personal address, use a hosted mailbox. Porkbun's own mailbox is convenient if its feature set and price suit; use an established hosted email provider if you prefer its apps, security features, or service history. Keep the domain registration and DNS at Porkbun, publish the mail provider's exact records, and set SPF/DKIM/DMARC carefully.

## Sources checked (2026-10-25)

- Porkbun email hosting and current listing: https://porkbun.com/products/porkbun_email
- Porkbun hosted email setup: https://kb.porkbun.com/article/24-how-to-set-up-a-hosted-email-account
- Porkbun hosted email vs forwarding: https://kb.porkbun.com/article/67-hosted-email-vs-email-forwarding
- Gmail sender requirements: https://support.google.com/mail/answer/81126?hl=en-en
- Cloudflare email DNS record overview: https://developers.cloudflare.com/dns/manage-dns-records/how-to/email-records/
- auDA Australian Presence requirement: https://www.auda.org.au/au-domain-names/learn-about-au-domain-names/benefits-of-au-domain-names/australian-presence-requirement/
