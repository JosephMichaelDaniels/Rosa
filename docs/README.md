# SEZE developer report — living doc

The single source of truth for engineering progress on SEZE.

## Files
- `dev-report.json` — the living record: build log, verifications, risks, decisions, roadmap, infra, and per-finding status. **Edit this.**
- `audit-register.json` — the 70-finding audit register (problem/impact/fix/personas).
- `gen_report.py` — generator: reads the two JSONs → `DEVELOPER-APP-REPORT.html`.
- `DEVELOPER-APP-REPORT.html` — the rendered report (also published as an Artifact).

## Update workflow
1. Add the new commit(s) to `buildLog`, tick any `findingStatus`, update `risks`/`roadmap`/`snapshot`.
2. `python3 docs/gen_report.py`
3. Republish `DEVELOPER-APP-REPORT.html` to the same Artifact link.
4. Commit.

Live in-app metrics (members, revenue, feedback) are in the app's **Admin panel**, not this doc.
