# PA × Vanguard — Licence to Operate

A role-based learning website for PA Consulting teams working with Vanguard. This repository contains the original Vanguard project; the separate FCA site is not included.

## Learning features

- Ten learning modules and five role pathways
- Knowledge checks, reflections and bookmarks
- Final readiness assessment
- Downloadable playbook and learning record
- Progress saved in each learner's browser
- Server-side shared-password protection

This is a review edition, not approved client policy or an enterprise learning management system. See [CONTENT-NOTES.md](CONTENT-NOTES.md) for scope, sources and review requirements.

## Local development

Use Node.js 22.13 or later.

```sh
npm ci
npm run dev
```

Configure `SITE_PASSWORD_HASH` and `SITE_SESSION_SECRET` in a local, ignored `.dev.vars` file. The password hash is the SHA-256 hexadecimal digest of your chosen password. The session secret should be a cryptographically random value. `.env.example` lists the variable names; no production credentials are included.

## Verification and build

```sh
npx tsc --noEmit
node --experimental-strip-types --test tests/access.test.mjs
npm run build
```

Built with React, Vinext, Vite and a Cloudflare Worker. The build writes its Worker configuration to `dist/server/wrangler.json`. Hosting requires a Worker-compatible runtime and the two runtime secrets above. GitHub stores the source; GitHub Pages alone cannot run the server-side password gate.

The existing `.openai/hosting.json` identifies the original Sites project. For an independent deployment, use a distinct Worker name and configure secrets in the destination hosting account. Do not commit passwords, `.dev.vars`, dependency directories or generated builds.
