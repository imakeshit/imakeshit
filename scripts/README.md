# scripts

Zero-dependency Node scripts that generate every SVG in `assets/`.

## Generate all panels

```bash
node scripts/generate.mjs
```

Reads `data/stats.json` if it exists (numbers, language split, contribution
streak) and writes all 9 SVGs into `assets/`. Without it, the stats panel
renders placeholder values.

## Refresh stats from GitHub

```bash
node scripts/update-stats.mjs
```

Fetches live data for `GH_USER` (default `beingDurgesh`):

| field       | source                                        |
| ----------- | --------------------------------------------- |
| repos       | `GET /users/:user` (public_repos)             |
| followers   | `GET /users/:user` (followers / following)    |
| commits     | `GET /search/commits?q=author::user`          |
| languages   | each public repo's `/languages`, byte totals  |
| streak      | the public contributions calendar             |

Then it writes `data/stats.json` and runs `generate.mjs` for you.

- `GITHUB_TOKEN` is optional locally and automatically provided in Actions.
- If a source fails, its previous value is kept (failures never break the build).

## Weekly automation

`.github/workflows/refresh-stats.yml` runs `update-stats.mjs` every Monday at
00:00 UTC and commits `assets/` + `data/` when something changed. You can also
trigger it by hand from the Actions tab (Manual trigger available).
