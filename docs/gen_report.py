#!/usr/bin/env python3
"""Living SEZE developer report generator.
Reads docs/dev-report.json (+ docs/audit-register.json) and emits the HTML report.
Update the JSON, re-run this, then republish the HTML to the same artifact URL.
Usage: python3 docs/gen_report.py
"""
import json, html, os
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'dev-report.json')))
REG = json.load(open(os.path.join(HERE, 'audit-register.json')))['register']

def esc(s): return html.escape(str(s if s is not None else ''))

ST_META = {'FIXED': ('Fixed & verified', '#0E9F6E'), 'MITIGATED': ('Mitigated', '#B7791F'),
           'ROADMAP': ('Roadmap', '#6B7280'), 'DEFERRED': ('Deferred (by decision)', '#7C6FD0')}
SEV_COLOR = {'critical': '#c0392b', 'high': '#E04486', 'medium': '#B7791F', 'low': '#6B7280'}
SEV_ORD = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
STATUS = D['findingStatus']

# apply statuses + counts
counts = {'FIXED': 0, 'MITIGATED': 0, 'ROADMAP': 0, 'DEFERRED': 0}
for f in REG:
    f['status'] = STATUS.get(f['id'], 'ROADMAP')
    counts[f['status']] += 1
REG.sort(key=lambda f: (SEV_ORD.get(f['severity'], 9), f['id']))

# ---- fragments ----
snap = ''.join(f'<div class="tile"><div class="big">{esc(v)}</div><div class="lab">{esc(k)}</div></div>' for k, v in D['snapshot'].items())

build = ''
for b in D['buildLog']:
    ver = f'<div class="ver">✓ Verified — {esc(b["verified"])}</div>' if b.get('verified') else ''
    build += f'''<div class="log">
      <div class="logtop"><span class="mono">{esc(b["commit"])}</span><span class="date">{esc(b["date"])}</span></div>
      <div class="ltitle">{esc(b["title"])}</div>
      <div class="lsum">{esc(b["summary"])}</div>{ver}
    </div>'''

vers = ''.join(f'<div class="vrow"><span class="vok">PASS</span><div><b>{esc(v["flow"])}</b><div class="ev">{esc(v["evidence"])}</div></div></div>' for v in D['verifications'])

freg = ''
for f in REG:
    lbl, col = ST_META[f['status']]
    freg += f'''<tr>
      <td class="mono">{esc(f["id"])}</td>
      <td><span class="sev" style="background:{SEV_COLOR[f["severity"]]}">{f["severity"][0].upper()}</span></td>
      <td><div class="ttl">{esc(f["title"])}</div><div class="loc">{esc(f["area"])}</div></td>
      <td><span class="st" style="color:{col};border-color:{col}">{esc(lbl)}</span></td>
    </tr>'''

def pill(v):
    c = {'High': '#c0392b', 'Medium': '#B7791F', 'Low': '#6B7280'}.get(v, '#6B7280')
    return f'<span class="pill" style="color:{c};border-color:{c}">{esc(v)}</span>'
def rstatus(s):
    c = '#0E9F6E' if 'itigat' in s else ('#6B7280' if 'Accept' in s else '#c0392b')
    return f'<span class="pill" style="color:{c};border-color:{c}">{esc(s)}</span>'
risks = ''.join(f'<tr><td class="mono">{esc(r["id"])}</td><td>{esc(r["risk"])}</td><td>{pill(r["impact"])}</td><td>{pill(r["likelihood"])}</td><td>{esc(r["mitigation"])}</td><td>{rstatus(r["status"])}</td></tr>' for r in D['risks'])

def rpill(p):
    c = {'High': '#E04486', 'Medium': '#B7791F', 'Low': '#6B7280'}.get(p, '#6B7280')
    return f'<span class="pill" style="color:{c};border-color:{c}">{esc(p)}</span>'
road = ''.join(f'<div class="rd"><div class="rdmark {"next" if r.get("status")=="next" else ""}">{"NEXT" if r.get("status")=="next" else "•"}</div><div class="rdt">{esc(r["item"])}</div>{rpill(r["priority"])}</div>' for r in D['roadmap'])

decs = ''.join(f'<div class="dec"><div class="dt">{esc(d["decision"])}</div><div class="dr">{esc(d["rationale"])}</div></div>' for d in D['decisions'])
infra = ''.join(f'<div class="kv"><b>{esc(k)}</b><span>{esc(v)}</span></div>' for k, v in D['infra'].items())

m = D['meta']
HTML = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#E04486">
<title>SEZE — Developer Report</title>
<style>
html,body{{margin:0;padding:0}}
</style>
<style>
:root{{ --bg:#faf7f8; --panel:#fff; --ink:#1A0D14; --muted:#6b6570; --line:#ece5e9; --pink:#E04486; --teal:#15B5A6; --soft:#fff0f5; }}
@media (prefers-color-scheme:dark){{ :root{{ --bg:#131016; --panel:#1c181f; --ink:#f4eef1; --muted:#a89fa8; --line:#2c2630; --soft:#241a20; }} }}
:root[data-theme=dark]{{ --bg:#131016; --panel:#1c181f; --ink:#f4eef1; --muted:#a89fa8; --line:#2c2630; --soft:#241a20; }}
:root[data-theme=light]{{ --bg:#faf7f8; --panel:#fff; --ink:#1A0D14; --muted:#6b6570; --line:#ece5e9; --soft:#fff0f5; }}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;line-height:1.5;font-size:15px}}
.wrap{{max-width:1000px;margin:0 auto;padding:0 20px 80px}}
.hero{{background:linear-gradient(135deg,#E04486,#B72B6D);color:#fff;padding:42px 20px 38px}}
.hero .in{{max-width:1000px;margin:0 auto}}
.badge{{display:inline-block;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.35);border-radius:20px;padding:3px 11px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px}}
.hero h1{{font-family:Georgia,serif;font-size:33px;margin:0 0 6px}}
.hero .sub{{opacity:.9;font-size:14.5px;max-width:78ch}}
.meta{{display:flex;flex-wrap:wrap;gap:7px 20px;margin-top:18px;font-size:12.5px}}
.meta b{{opacity:.75}} .meta a{{color:#fff;text-decoration:underline;text-underline-offset:2px}}
h2{{font-family:Georgia,serif;font-size:21px;margin:38px 0 6px}}
h2 .n{{color:var(--pink);font-size:12px;font-family:system-ui;font-weight:700;letter-spacing:.09em;display:block;margin-bottom:3px;text-transform:uppercase}}
p.lead{{color:var(--muted);max-width:80ch;margin:6px 0 0}}
.tiles{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:18px 0}}
.tile{{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px;text-align:center}}
.tile .big{{font-family:Georgia,serif;font-size:26px;line-height:1;color:var(--pink)}}
.tile .lab{{font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-top:6px}}
.status-row{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:14px 0 4px}}
.sc{{border-radius:14px;padding:14px;text-align:center;color:#fff}}
.sc .b{{font-family:Georgia,serif;font-size:26px;line-height:1}} .sc .l{{font-size:11px;margin-top:4px;opacity:.95}}
.card{{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px;margin:14px 0}}
.log{{border-left:3px solid var(--pink);padding:2px 0 2px 16px;margin:16px 0}}
.logtop{{display:flex;justify-content:space-between;align-items:center}}
.date{{font-size:11px;color:var(--muted)}}
.ltitle{{font-family:Georgia,serif;font-size:16.5px;margin:3px 0 4px}}
.lsum{{font-size:13.5px;color:var(--muted)}}
.ver{{margin-top:7px;font-size:12px;color:var(--teal);background:var(--soft);border-radius:8px;padding:6px 10px}}
.mono{{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--muted)}}
.vrow{{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--line)}}
.vrow:last-child{{border:none}}
.vok{{background:#0E9F6E;color:#fff;font-size:10px;font-weight:700;letter-spacing:.05em;border-radius:6px;padding:3px 7px;flex-shrink:0;margin-top:1px}}
.ev{{color:var(--muted);font-size:12.5px;margin-top:2px}}
.scroll{{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:var(--panel)}}
table{{width:100%;border-collapse:collapse;font-size:13.5px}}
th{{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding:11px 12px;border-bottom:1px solid var(--line);position:sticky;top:0;background:var(--panel)}}
td{{padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}}
tr:last-child td{{border-bottom:none}}
.sev{{display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:6px;color:#fff;font-size:11px;font-weight:700}}
.ttl{{font-weight:600}} .loc{{color:var(--muted);font-size:11.5px;margin-top:2px}}
.st,.pill{{display:inline-block;border:1px solid;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600;white-space:nowrap}}
.rd{{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--line)}}
.rd:last-child{{border:none}}
.rdmark{{width:30px;height:22px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:var(--muted);background:var(--soft);flex-shrink:0}}
.rdmark.next{{background:var(--pink);color:#fff}}
.rdt{{flex:1;font-size:13.5px}}
.dec{{padding:11px 0;border-bottom:1px solid var(--line)}} .dec:last-child{{border:none}}
.dt{{font-weight:600;font-size:14px}} .dr{{color:var(--muted);font-size:12.5px;margin-top:3px}}
.kv{{display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);font-size:13px}}
.kv:last-child{{border:none}} .kv b{{color:var(--muted);font-weight:600;min-width:150px;flex-shrink:0}}
.foot{{color:var(--muted);font-size:12.5px;margin-top:40px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}}
.foot code{{background:var(--soft);border-radius:5px;padding:1px 6px;font-size:12px}}
@media(max-width:720px){{.tiles,.status-row{{grid-template-columns:repeat(2,1fr)}} .kv b{{min-width:110px}}}}
</style>
</head>
<body>

<div class="hero"><div class="in">
 <span class="badge">Live developer report · updated {esc(m["generated"])}</span>
 <h1>SEZE — Developer Report</h1>
 <div class="sub">{esc(m["tagline"])}. The living engineering record: build log, verifications, findings, risks, decisions and roadmap. Regenerated from a version-controlled source in the repo.</div>
 <div class="meta">
  <span><b>Version</b> {esc(m["version"])}</span>
  <span><b>Live</b> <a href="{esc(m["liveUrl"])}">{esc(m["liveUrl"]).replace("https://","")}</a></span>
  <span><b>Repo</b> {esc(m["repo"])}</span>
  <span><b>Backend</b> {esc(m["backend"])}</span>
 </div>
</div></div>

<div class="wrap">

<h2><span class="n">Snapshot</span>Where things stand</h2>
<p class="lead">{esc(D["snapshotNote"])}</p>
<div class="tiles">{snap}</div>
<div class="status-row">
 <div class="sc" style="background:#0E9F6E"><div class="b">{counts['FIXED']}</div><div class="l">Fixed &amp; verified</div></div>
 <div class="sc" style="background:#B7791F"><div class="b">{counts['MITIGATED']}</div><div class="l">Mitigated</div></div>
 <div class="sc" style="background:#6B7280"><div class="b">{counts['ROADMAP']}</div><div class="l">Roadmap</div></div>
 <div class="sc" style="background:#7C6FD0"><div class="b">{counts['DEFERRED']}</div><div class="l">Deferred (by decision)</div></div>
</div>
<p class="lead">{esc(D["summary"])}</p>

<h2><span class="n">01 — Build log</span>Every change, newest first</h2>
{build}

<h2><span class="n">02 — Verification log</span>Proven against the live database</h2>
<div class="card">{vers}</div>

<h2><span class="n">03 — Findings register</span>{len(REG)} audit findings · current status</h2>
<p class="lead">Severity: <span class="sev" style="background:#c0392b">C</span> critical · <span class="sev" style="background:#E04486">H</span> high · <span class="sev" style="background:#B7791F">M</span> medium · <span class="sev" style="background:#6B7280">L</span> low. Full detail lives in <code>docs/audit-register.json</code>.</p>
<div class="scroll"><table><thead><tr><th>ID</th><th>Sev</th><th>Finding</th><th>Status</th></tr></thead><tbody>{freg}</tbody></table></div>

<h2><span class="n">04 — Risk register</span>Watch before public launch</h2>
<div class="scroll"><table><thead><tr><th>ID</th><th>Risk</th><th>Impact</th><th>Likelihood</th><th>Mitigation</th><th>Status</th></tr></thead><tbody>{risks}</tbody></table></div>

<h2><span class="n">05 — Roadmap</span>Next, in priority order</h2>
<div class="card">{road}</div>

<h2><span class="n">06 — Key decisions</span>Why it's built this way</h2>
<div class="card">{decs}</div>

<h2><span class="n">07 — Infrastructure</span>What's running</h2>
<div class="card">{infra}</div>

<div class="foot">
 <b>How this doc stays current.</b> Generated from <code>docs/dev-report.json</code> (the version-controlled source of truth) plus <code>docs/audit-register.json</code>. To update: edit the JSON, run <code>python3 docs/gen_report.py</code>, then redeploy. Live in-app metrics (members, revenue, feedback) are in the app's <b>Admin panel</b>. Generated {esc(m["generated"])} from <code>main</code>.
</div>
</div>
</body>
</html>
'''
# Standalone doc for hosting (Vercel) + local viewing
for OUT in [os.path.join(HERE, 'DEVELOPER-APP-REPORT.html'), os.path.join(HERE, '..', 'report.html')]:
    open(OUT, 'w').write(HTML)
print(f"wrote report.html + docs/DEVELOPER-APP-REPORT.html ({len(HTML)} bytes) · findings {len(REG)} · counts {counts}")
