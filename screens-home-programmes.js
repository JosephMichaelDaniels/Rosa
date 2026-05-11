// ─── HOME SCREEN ──────────────────────────────────────────────────────────────
function HomeScreen({ navigate }) {
  const tip = ROSA_TIPS[Math.floor(Math.random() * ROSA_TIPS.length)];
  const [tipOpen, setTipOpen] = useState(false);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppBackground>
      <Screen withNav scrollable>
        {/* Header */}
        <div style={{ paddingTop:'56px', marginBottom:'20px' }}>
          <div style={{ fontFamily:'Outfit', fontSize:'15px', fontWeight:300, color:'rgba(152,120,184,0.8)' }}>{greeting},</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'34px', color:'#3A1848', lineHeight:1.1 }}>{USER.name}.</div>
        </div>

        {/* Progress ring + streak row */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'16px', alignItems:'stretch' }}>
          <GlassCard strong accent style={{ flex:'0 0 auto', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'18px 14px' }}>
            <ProgressRing completed={USER.sessionsThisWeek} total={USER.sessionsTarget} size={96} />
            <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.6)', marginTop:'8px' }}>This week</div>
          </GlassCard>

          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'12px' }}>
            <StreakBanner streak={USER.streak} style={{ flex:1 }} />
            <GlassCard style={{ padding:'12px 14px' }}>
              <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.6)', marginBottom:'4px' }}>Programme</div>
              <div style={{ fontFamily:'Gilda Display', fontSize:'14px', color:'#3A1848', lineHeight:1.3 }}>{USER.programme}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.65)', marginTop:'2px' }}>Week {USER.programmeWeek}</div>
              <div style={{ marginTop:'8px', height:'4px', borderRadius:'2px', background:'rgba(255,255,255,0.5)' }}>
                <div style={{ height:'100%', width:`${USER.programmeProgress*100}%`, background:'#C8B8E8', borderRadius:'2px', transition:'width 1s ease' }} />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Today's session */}
        <SectionHeader>Today's session</SectionHeader>
        <GlassCard strong accent style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
            <div>
              <div style={{ fontFamily:'Gilda Display', fontSize:'22px', color:'#3A1848', marginBottom:'4px' }}>{TODAY_SESSION.name}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)' }}>Week {TODAY_SESSION.week} · Day {TODAY_SESSION.day}</div>
            </div>
            <div style={{ padding:'6px 12px', borderRadius:'12px', background:'rgba(200,184,232,0.25)', fontFamily:'Outfit', fontSize:'11px', color:'#9878B8', fontWeight:500 }}>
              {TODAY_SESSION.duration} min
            </div>
          </div>
          <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
            {[`${TODAY_SESSION.exerciseCount} exercises`, TODAY_SESSION.programme, 'Lower body'].map(t => (
              <span key={t} style={{ padding:'4px 10px', borderRadius:'10px', background:'rgba(255,255,255,0.45)', fontFamily:'Outfit', fontSize:'10px', color:'rgba(58,24,72,0.65)', border:'0.5px solid rgba(255,255,255,0.85)' }}>{t}</span>
            ))}
          </div>
          <PillButton onClick={() => navigate('workout')} style={{ width:'100%', padding:'13px' }}>
            Start session →
          </PillButton>
        </GlassCard>

        {/* Nutrition summary */}
        <SectionHeader>Today's nutrition</SectionHeader>
        <GlassCard style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <div>
              <span style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848' }}>{USER.macros.kcal}</span>
              <span style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.65)', marginLeft:'4px' }}>/ {USER.macros.kcalTarget} kcal</span>
            </div>
            <PillButton variant="ghost" small onClick={() => navigate('nutrition')}>View →</PillButton>
          </div>
          <div style={{ height:'6px', borderRadius:'3px', background:'rgba(255,255,255,0.5)', marginBottom:'12px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(USER.macros.kcal/USER.macros.kcalTarget)*100}%`, background:'linear-gradient(90deg,#C8B8E8,#F8D0E4)', borderRadius:'3px' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
            {[{l:'Protein',v:USER.macros.protein,t:USER.macros.proteinTarget,c:'#C8B8E8'},
              {l:'Carbs',  v:USER.macros.carbs,  t:USER.macros.carbsTarget,  c:'#F8D0E4'},
              {l:'Fat',    v:USER.macros.fat,     t:USER.macros.fatTarget,    c:'#DDD5F5'}].map(m => (
              <div key={m.l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848' }}>{m.v}<span style={{ fontSize:'11px', fontFamily:'Outfit', color:'rgba(152,120,184,0.6)' }}>g</span></div>
                <div style={{ fontFamily:'Outfit', fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(152,120,184,0.6)', marginTop:'2px' }}>{m.l}</div>
                <div style={{ height:'3px', borderRadius:'2px', background:'rgba(255,255,255,0.5)', marginTop:'5px', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${Math.min((m.v/m.t)*100,100)}%`, background:m.c, borderRadius:'2px' }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Rosa's tip */}
        <SectionHeader>Rosa's tip</SectionHeader>
        <GlassCard style={{ marginBottom:'20px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', gap:'8px', alignItems:'center', marginBottom:'8px' }}>
                <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#9878B8,#C8B8E8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px' }}>💡</div>
                <span style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.65)' }}>From Rosa</span>
              </div>
              <p style={{ fontFamily:'Gilda Display', fontSize:'15px', color:'rgba(152,120,184,0.85)', fontStyle:'italic', lineHeight:1.6 }}>
                "{tip}"
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Recent badge */}
        {USER.earnedBadges.length > 0 && (() => {
          const latest = BADGES.find(b => b.id === USER.earnedBadges[USER.earnedBadges.length - 1]);
          return latest ? (
            <>
              <SectionHeader>Latest achievement</SectionHeader>
              <GlassCard strong style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'20px' }}>
                <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:'rgba(248,208,228,0.6)', border:'1.5px solid rgba(248,208,228,0.9)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', animation:'glowPulse 2s ease-in-out infinite', boxShadow:'0 0 12px rgba(248,208,228,0.5)' }}>
                  {latest.emoji}
                </div>
                <div>
                  <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848' }}>{latest.name}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)', marginTop:'2px' }}>{latest.desc}</div>
                </div>
              </GlassCard>
            </>
          ) : null;
        })()}
      </Screen>
      <BottomNav active="home" navigate={navigate} />
    </AppBackground>
  );
}

// ─── PROGRAMMES SCREEN ────────────────────────────────────────────────────────
function ProgrammesScreen({ navigate }) {
  const [filter, setFilter] = useState('All');
  const filters = ['All','Active','Recovery','Strength','Prenatal'];
  const filterMap = { All: () => true, Active: p => p.active, Recovery: p => p.tag === 'Recovery', Strength: p => p.tag === 'Strength' || p.tag === 'Build', Prenatal: p => p.tag === 'Prenatal' };
  const visible = PROGRAMMES.filter(filterMap[filter] || (() => true));

  return (
    <AppBackground>
      <Screen withNav>
        <div style={{ paddingTop:'56px', marginBottom:'20px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#3A1848', marginBottom:'4px' }}>Choose your path.</div>
          <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)' }}>7 specialist programmes. One built for you.</div>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px', marginBottom:'20px' }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding:'8px 16px', borderRadius:'24px', whiteSpace:'nowrap', fontFamily:'Outfit', fontSize:'12px', fontWeight:500, cursor:'pointer', background: filter===f ? '#9878B8' : 'rgba(255,255,255,0.5)', color: filter===f ? '#F2EEFB' : '#3A1848', border: filter===f ? 'none' : '0.5px solid rgba(200,184,232,0.3)', flexShrink:0 }}>
              {f}
            </button>
          ))}
        </div>

        {/* Programme cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:'12px', paddingBottom:'20px' }}>
          {visible.map((p, i) => (
            <ProgrammeCard key={p.id} prog={p} idx={i} navigate={navigate} />
          ))}
        </div>
      </Screen>
      <BottomNav active="programmes" navigate={navigate} />
    </AppBackground>
  );
}

function ProgrammeCard({ prog, idx, navigate }) {
  return (
    <div className="scaleIn" style={{ animationDelay: `${idx * 0.06}s`,
      borderRadius:'16px', overflow:'hidden',
      border: prog.active ? '1.5px solid rgba(255,255,255,0.6)' : '0.5px solid rgba(255,255,255,0.4)',
      cursor:'pointer', position:'relative',
      boxShadow: prog.active ? '0 8px 32px rgba(152,120,184,0.25)' : '0 2px 12px rgba(0,0,0,0.06)' }}
      onClick={() => navigate('programme_detail', { prog })}>

      {/* Hero image */}
      <div style={{ position:'relative', height:'180px', overflow:'hidden' }}>
        <img src={prog.image} alt={prog.name}
          style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
        {/* Gradient overlay so text is always readable */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.55) 100%)' }} />
        {/* Tags over image */}
        <div style={{ position:'absolute', top:'12px', left:'12px', display:'flex', gap:'6px' }}>
          <span style={{ padding:'4px 10px', borderRadius:'10px', background:'rgba(255,255,255,0.25)', backdropFilter:'blur(8px)', fontFamily:'Outfit', fontSize:'10px', fontWeight:500, color:'#fff' }}>{prog.tag}</span>
          {prog.active && <span style={{ padding:'4px 10px', borderRadius:'10px', background:'rgba(152,120,184,0.75)', backdropFilter:'blur(8px)', fontFamily:'Outfit', fontSize:'10px', fontWeight:500, color:'#fff' }}>● Active</span>}
        </div>
        <span style={{ position:'absolute', top:'12px', right:'12px', fontFamily:'Outfit', fontSize:'11px', color:'rgba(255,255,255,0.8)' }}>{prog.weeks > 0 ? `${prog.weeks} wks` : 'Ongoing'}</span>
        {/* Programme name over image bottom */}
        <div style={{ position:'absolute', bottom:'12px', left:'14px', right:'14px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'22px', color:'#fff', lineHeight:1.2, textShadow:'0 1px 8px rgba(0,0,0,0.4)' }}>{prog.name}</div>
        </div>
      </div>

      {/* Card body */}
      <div style={{ background: prog.colour, padding:'14px' }}>
        <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:300, color: prog.text === '#F2EEFB' ? 'rgba(242,238,251,0.85)' : 'rgba(58,24,72,0.7)', marginBottom:'12px', lineHeight:1.5 }}>{prog.tagline}</div>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontFamily:'Outfit', fontSize:'11px', color: prog.text === '#F2EEFB' ? 'rgba(242,238,251,0.6)' : 'rgba(58,24,72,0.5)' }}>{prog.level}</span>
          <span style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:500, color: prog.text }}>{prog.active ? 'Continue →' : 'Start →'}</span>
        </div>

        {prog.active && prog.progress > 0 && (
          <div style={{ marginTop:'10px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
              <span style={{ fontFamily:'Outfit', fontSize:'10px', color: prog.text === '#F2EEFB' ? 'rgba(242,238,251,0.65)' : 'rgba(58,24,72,0.5)' }}>Progress</span>
              <span style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, color: prog.text }}>{Math.round(prog.progress*100)}%</span>
            </div>
            <div style={{ height:'4px', borderRadius:'2px', background:'rgba(255,255,255,0.3)' }}>
              <div style={{ height:'100%', width:`${prog.progress*100}%`, background:'rgba(255,255,255,0.75)', borderRadius:'2px' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PROGRAMME DETAIL ─────────────────────────────────────────────────────────
function ProgrammeDetailScreen({ navigate, params }) {
  const prog = params?.prog || PROGRAMMES[0];
  const phases = ['Restore','Strengthen','Transform'];
  const weeks = Array.from({length: prog.weeks || 12}, (_,i) => i+1);

  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', paddingBottom:'32px', overflowY:'auto' }}>
        {/* Hero image */}
        <div style={{ position:'relative', height:'280px', overflow:'hidden' }}>
          <img src={prog.image} alt={prog.name}
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
          {/* Dark gradient overlay */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.65) 100%)' }} />
          {/* Back button */}
          <button onClick={() => navigate('programmes')} style={{ position:'absolute', top:'52px', left:'16px', background:'rgba(255,255,255,0.25)', backdropFilter:'blur(8px)', border:'none', borderRadius:'50%', width:'38px', height:'38px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <BackIcon color="#fff" size={18} />
          </button>
          {/* Tags */}
          <div style={{ position:'absolute', top:'56px', right:'16px', display:'flex', gap:'6px', flexDirection:'column', alignItems:'flex-end' }}>
            <span style={{ padding:'5px 12px', borderRadius:'12px', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(8px)', fontFamily:'Outfit', fontSize:'11px', fontWeight:500, color:'#fff' }}>{prog.tag}</span>
            {prog.id === 'pregnant' && <span style={{ padding:'5px 12px', borderRadius:'12px', background:'rgba(255,160,50,0.55)', backdropFilter:'blur(8px)', fontFamily:'Outfit', fontSize:'11px', fontWeight:500, color:'#fff' }}>⚕️ Physician advised</span>}
          </div>
          {/* Title overlay */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'20px' }}>
            <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#fff', lineHeight:1.2, marginBottom:'6px', textShadow:'0 2px 12px rgba(0,0,0,0.4)' }}>{prog.name}</div>
            <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(255,255,255,0.85)', lineHeight:1.5, textShadow:'0 1px 6px rgba(0,0,0,0.3)' }}>{prog.tagline}</div>
          </div>
        </div>

        <div style={{ padding:'20px' }}>
          {/* Rosa's intro */}
          <GlassCard accent style={{ marginBottom:'16px', padding:'18px' }}>
            <div style={{ display:'flex', gap:'10px', alignItems:'flex-start' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#9878B8,#C8B8E8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>💪</div>
              <div>
                <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.65)', marginBottom:'6px' }}>Rosa says</div>
                <p style={{ fontFamily:'Gilda Display', fontSize:'15px', color:'rgba(152,120,184,0.85)', fontStyle:'italic', lineHeight:1.7 }}>
                  "This programme was built from everything I learned rebuilding my own body. Follow the phases — they're sequenced for a reason. Trust the process."
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Programme info */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'20px' }}>
            {[{l:'Duration', v: prog.weeks > 0 ? `${prog.weeks} weeks` : 'Ongoing'},
              {l:'Level', v:prog.level},{l:'Sessions', v:'3–5/week'}].map(i => (
              <GlassCard key={i.l} style={{ textAlign:'center', padding:'12px 8px' }}>
                <div style={{ fontFamily:'Gilda Display', fontSize:'14px', color:'#3A1848' }}>{i.v}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(152,120,184,0.6)', marginTop:'3px' }}>{i.l}</div>
              </GlassCard>
            ))}
          </div>

          {/* Phases */}
          {prog.weeks > 0 && (
            <>
              <SectionHeader>Programme phases</SectionHeader>
              <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
                {phases.map((ph, i) => (
                  <GlassCard key={ph} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <div style={{ width:'28px', height:'28px', borderRadius:'50%', background: i === 0 ? '#9878B8' : 'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {i === 0 ? <CheckIcon size={14} /> : <span style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:500, color:'rgba(152,120,184,0.6)' }}>{i+1}</span>}
                    </div>
                    <div>
                      <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848' }}>Phase {i+1}: {ph}</div>
                      <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.65)' }}>Weeks {i*4+1}–{(i+1)*4}</div>
                    </div>
                    {i === 0 && <span style={{ marginLeft:'auto', fontFamily:'Outfit', fontSize:'10px', color:'#9878B8', fontWeight:500 }}>Current</span>}
                  </GlassCard>
                ))}
              </div>
            </>
          )}

          {/* Week grid */}
          <SectionHeader>Sessions</SectionHeader>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'20px' }}>
            {weeks.slice(0, 12).map(w => {
              const done = w <= (USER.programmeWeek - 1);
              const current = w === USER.programmeWeek;
              return (
                <GlassCard key={w} strong={current} accent={current}
                  onClick={() => current && navigate('workout')}
                  style={{ display:'flex', alignItems:'center', gap:'10px', cursor: current ? 'pointer' : 'default', opacity: !done && !current ? 0.55 : 1 }}>
                  <div style={{ width:'32px', height:'32px', borderRadius:'50%', background: done ? '#C8B8E8' : current ? '#9878B8' : 'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {done ? <CheckIcon color="#3A1848" size={14} /> : <span style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:500, color: current ? '#F2EEFB' : 'rgba(152,120,184,0.65)' }}>{w}</span>}
                  </div>
                  <div>
                    <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:500, color:'#3A1848' }}>Week {w}</div>
                    <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)' }}>{done ? 'Complete' : current ? 'In progress' : '3 sessions'}</div>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <PillButton style={{ width:'100%', padding:'14px' }} onClick={() => navigate('workout')}>
            {prog.active ? 'Continue programme →' : 'Start this programme →'}
          </PillButton>
        </div>
      </div>
    </AppBackground>
  );
}
