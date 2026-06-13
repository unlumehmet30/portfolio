# Security Audit Report - 2026-06-13

Target: `https://165.232.45.167.sslip.io`

Scope: low-risk black-box checks against the live site plus gray-box review of the local backend, frontend, Docker, and Caddy configuration. Destructive testing, denial-of-service, brute-force campaigns, real session theft, web shell execution, and data-modifying exploit chains were not performed. PoCs below use harmless canary payloads or code-level evidence.

## Summary Table

| # | Title | Category | CVSS | Severity | Status |
|---|---|---|---:|---|---|
| 1 | Upload validation trusted client MIME type | F1/F2 | 5.4 | Medium | Fixed |
| 2 | Admin rate-limit bypass risk via broad proxy trust and username-scoped limiter | C1/E2 | 7.1 | High | Fixed |
| 3 | JWT verifier did not validate header and could throw on malformed JSON | C2/H1 | 5.3 | Medium | Fixed |
| 4 | Over-broad frontend `connect-src` and technology headers | G1/H3 | 4.6 | Medium | Fixed, with residual CSP note |
| 5 | Production containers ran as root | I/Hardening | 5.0 | Medium | Fixed |
| 6 | Dependency audit found vulnerable `tsx/esbuild` chain | I1/I2 | 8.1 | High | Fixed |
| 7 | Public health endpoint exposed service name | H3 | 2.6 | Low | Fixed |
| 8 | Remaining `next -> postcss` audit advisory | I1/I2 | 6.1 | Medium | Open/Monitor |

## Live Test Evidence

- `GET /api/projects/%27%20OR%201%3D1--` returned `404 Project not found`; no SQL error or data expansion observed.
- `GET /api/projects/%3Cscript%3Ealert(1)%3C%2Fscript%3E` returned `404 Project not found`; no reflected script execution observed.
- Unauthorized `POST /api/admin/uploads/project-image` returned `401 Admin authorization token is required`.
- Unauthorized `PUT /api/admin/projects/1` returned `401 Admin authorization token is required`.
- `Origin: https://evil.example` did not receive `Access-Control-Allow-Origin`; wildcard credentialed CORS was not observed.
- `/.env`, `/.git/config`, `/backup.zip`, `/swagger.json` returned `404`.
- `http://165.232.45.167` redirects to HTTPS. `https://165.232.45.167.sslip.io` responds.
- Direct `:8080` and `:3001` checks timed out from the public internet, so backend/frontend service ports do not appear directly exposed.
- TLS 1.2 succeeded with `ECDHE-ECDSA-AES128-GCM-SHA256`; TLS 1.3 succeeded with `TLS_AES_128_GCM_SHA256`; certificate verification returned OK.

## Detailed Findings

### [F1/F2] Upload validation trusted client MIME type

- Severity: Medium
- CVSS v3.1: `CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:L` -> 5.4
- Location: `backend/src/middleware/project-image-upload.ts`, `/api/admin/uploads/project-image`, `/api/admin/uploads/post-image`
- Threat model: An attacker with a stolen admin token could upload a file whose declared `Content-Type` is an image while the actual bytes are not an image. The existing random file name and static extension reduced risk, but content validation was missing.
- Safe PoC: Submit a non-image file as `image/png`; before the fix, Multer accepted based on MIME alone. Unauthorized live probe correctly returned `401`, so this was confirmed by code review rather than privileged exploitation.
- Impact: Stored non-image content under the uploads path; depending on future server behavior, this can become XSS/content-smuggling risk.
- Fix: Added magic-byte validation for JPEG, PNG, WebP, and GIF after upload; invalid files are deleted and rejected with `400`.
- Operational tasks: Redeploy backend; keep upload volume mounted only to backend; do not enable SVG/XML uploads without a sanitizer.

### [C1/E2] Admin rate-limit bypass risk via broad proxy trust and username-scoped limiter

- Severity: High
- CVSS v3.1: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:L/A:N` -> 7.1
- Location: `docker-compose.yml`, `.env.example`, `backend/src/routes/admin.routes.ts`, `backend/src/config/security-checks.ts`
- Threat model: With `TRUST_PROXY=true`, Express can trust a broad forwarded IP chain. If the reverse proxy preserves spoofable `X-Forwarded-For` values, IP-based rate limits can be weakened. The previous admin login limiter also keyed by `ip + username`, allowing more attempts by rotating usernames.
- Safe PoC: Repeated login attempts were not brute-forced. Code review showed the limiter key and proxy trust setting.
- Impact: Increased chance of successful password guessing against `/api/admin/login`.
- Fix: Added an IP-wide login limiter before the username-scoped limiter; changed production default `TRUST_PROXY` to `1`; production startup now rejects `TRUST_PROXY=true`.
- Operational tasks: Ensure Droplet `.env` uses `TRUST_PROXY=1`; keep backend inaccessible except through Caddy.

### [C2/H1] JWT verifier did not validate header and could throw on malformed JSON

- Severity: Medium
- CVSS v3.1: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:N/I:L/A:L` -> 5.3
- Location: `backend/src/utils/admin-token.ts`
- Threat model: A malformed token could reach JSON parsing. Also, the JWT-like header was not enforced as `HS256/JWT`, which is confusing and brittle even though the HMAC signature was still checked.
- Safe PoC: Use a malformed bearer token such as `Bearer a.b.c`; this should return `401`, not `500`.
- Impact: Possible error handling instability and weaker token format guarantees.
- Fix: Enforced exactly three token parts, safe JSON decoding, `alg=HS256`, `typ=JWT`, finite `exp`, string `sub`, and admin role.
- Operational tasks: Rotate `ADMIN_SESSION_SECRET` if it has ever been shared in chat/logs; keep it at least 32 random characters.

### [G1/H3] Over-broad frontend `connect-src` and technology headers

- Severity: Medium
- CVSS v3.1: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:L/I:L/A:N` -> 4.6
- Location: `frontend/next.config.mjs`, `Caddyfile`
- Threat model: If a future XSS appears, broad `connect-src https: http: ws: wss:` gives payloads more exfiltration choices. Live headers also disclosed `X-Powered-By: Next.js` and `Via: 1.1 Caddy`.
- Safe PoC: Header read on live site showed broad `connect-src` and technology headers.
- Impact: Defense-in-depth weakness and easier stack fingerprinting.
- Fix: Production `connect-src` now allows only `'self'` and the configured API origin; Caddy strips `Server`, `Via`, and `X-Powered-By`.
- Residual note: `script-src 'unsafe-inline'` remains because Next/theme bootstrap currently uses inline scripts. Removing it properly requires a nonce/hash CSP pass.
- Operational tasks: Redeploy frontend/Caddy; after deploy, verify headers again with `curl -I`.

### [I/Hardening] Production containers ran as root

- Severity: Medium
- CVSS v3.1: `CVSS:3.1/AV:N/AC:H/PR:H/UI:N/S:U/C:H/I:H/A:L` -> 5.0
- Location: `backend/Dockerfile`, `frontend/Dockerfile`
- Threat model: If an app-level exploit ever escapes into the container process, root inside the container increases blast radius.
- Safe PoC: Dockerfile review showed no `USER` directive.
- Impact: Higher container compromise impact.
- Fix: Backend and frontend runner stages now create needed writable paths and run as the built-in `node` user.
- Operational tasks: Rebuild images; verify named volumes still allow backend writes to `/app/data` and `/app/uploads`.

### [I1/I2] Vulnerable `tsx/esbuild` dependency chain

- Severity: High
- CVSS v3.1: `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:H/A:H` -> 8.1
- Location: `package-lock.json`
- Threat model: Vulnerable transitive build/dev tooling can affect developer or CI environments, especially if registry configuration is compromised.
- Safe PoC: `npm audit --workspaces --json` reported `tsx -> esbuild` high severity advisories.
- Impact: Supply-chain risk in development/build environment.
- Fix: Ran `npm audit fix --workspaces` without `--force`, updating `esbuild` to `0.28.1` and removing high findings.
- Operational tasks: Reinstall from lockfile in CI/prod build; keep audit in deployment checklist.

### [H3] Public health endpoint exposed service name

- Severity: Low
- CVSS v3.1: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N` -> 2.6
- Location: `backend/src/routes/index.ts`, `/api/health`
- Threat model: Public health metadata gives attackers minor stack/service hints.
- Safe PoC: `HEAD /api/health` showed the endpoint exists.
- Impact: Minor information disclosure.
- Fix: Health response now returns only `{ status: "ok" }`.
- Operational tasks: Redeploy backend.

### [I1/I2] Remaining `next -> postcss` audit advisory

- Severity: Medium
- CVSS v3.1: `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N` -> 6.1
- Location: `node_modules/next/node_modules/postcss` as reported by `npm audit`
- Threat model: Audit reports PostCSS CSS stringification XSS via Next's bundled dependency. The project does not expose user-controlled CSS generation in the app, so practical exploitability appears limited here.
- Safe PoC: `npm audit --workspaces --omit=dev --json` reports the advisory remains after safe fixes.
- Impact: Supply-chain/compliance finding until Next ships or resolves the bundled dependency advisory in a non-breaking path.
- Fix status: Open. `npm audit fix --force` suggests an invalid breaking downgrade to `next@9.3.3`, so it was not applied.
- Operational tasks: Track Next patch releases; upgrade Next when an upstream fixed release is available; do not use `--force` downgrade.

## Category Coverage Notes

- A1 SQL Injection: No SQLi found. Prisma queries use structured parameters; live canary returned 404 without SQL error.
- A2 NoSQL Injection: Not applicable; no MongoDB/NoSQL query surface found.
- A3 Command Injection: No `child_process` command execution surface found in app code.
- A4 Template Injection: No server-side template engine surface found.
- A5 LDAP/XPath Injection: Not applicable; no LDAP/XPath use found.
- B1/B2/B3 XSS: No reflected/stored/DOM XSS found in tested public routes. React rendering escapes contact/admin content, and no `dangerouslySetInnerHTML` was found.
- B4 Session theft scenario: Not executed and no weaponized theft PoC provided. If XSS is introduced later, the admin token in `sessionStorage` would be reachable by script; consider HttpOnly cookie auth as a future hardening item.
- B5 CSP bypass: No bypass tested. CSP was improved, but `unsafe-inline` remains a residual hardening task.
- C3 Session fixation/hijacking: No cookie session or remember-me flow exists. Bearer token expires after 8 hours.
- C4 Password reset: Not applicable; no password reset feature.
- C5 MFA bypass: Not applicable; no MFA feature.
- C6 Remember-me: Not applicable; no remember-me feature.
- C7 Account lockout: No persistent account lockout; rate limiting is present and was strengthened.
- D1/D2/D3 IDOR/access control: Admin endpoints require bearer admin token; public IDs/slugs expose only public content.
- D4 CSRF: Admin state changes use bearer Authorization header, not cookies; CSRF risk is low. CORS credentials were removed.
- D5 Method override: No method override middleware found.
- D6 Path traversal: No endpoint accepts filesystem paths; uploads use random filenames.
- E1 GraphQL: Not applicable; no GraphQL endpoint found.
- E3 CORS: No wildcard origin observed; unnecessary credentials header fixed.
- E4 Mass assignment: Zod schemas whitelist request fields.
- E5 API key/token disclosure: No public secrets found; avoid sharing `.env` values in chat/logs.
- E6 Webhooks: Not applicable; no webhook surface.
- F3/F4/F5: No path traversal, XML/SVG upload, or zip handling surface found.
- F6 File size DoS: 5 MB upload limit exists; invalid Multer errors now return 400.
- G2 Clickjacking: `X-Frame-Options` and `frame-ancestors` are present.
- G3 HSTS: Present on frontend and backend responses.
- G4 Referrer/Permissions Policy: Present.
- G5 TLS: TLS 1.2/1.3 verified; old TLS could not be offered by local OpenSSL and was not claimed as supported.
- G6 Mixed content: Production CSP now upgrades insecure requests and narrows connect sources.
- G7 Cookies: No auth cookies are used.
- H1 Stack traces: Live probes did not expose stack traces; token parsing was hardened to avoid malformed-token 500s.
- H2 Sensitive files: Common probes returned 404.
- H4 Directory listing: No directory listing observed.
- H5 Google dorks: Not performed from this environment.
- H6 Username enumeration: Login returns a generic invalid credentials message.
- I3 Subdomain takeover: `sslip.io` dynamic DNS pattern; no project-owned subdomain inventory assessed.
- I4 DNS zone transfer: Not applicable to `sslip.io` in this app scope.
- I5 Ports: 80/443 reachable; 8080/3001 not reachable from public checks. Restrict SSH 22 to trusted IPs.
- I6 Cloud storage: Not applicable; uploads are local Docker volume.
- J1-J5 Business logic: No payments, orders, coupons, account deletion, or hidden search/filter data surfaces found.
