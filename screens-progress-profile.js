// ─── PROGRESS SCREEN ──────────────────────────────────────────────────────────
function ProgressScreen({ navigate }) {
  const maxSessions = Math.max(...WEEKLY_DATA.map(d => d.sessions));
  const totalSessions = WEEKLY_DATA.reduce((a, d) => a + d.sessions, 0);
  const avgSessions = (totalSessions / WEEKLY_DATA.length).toFixed(1);

  return (
    <AppBackground>
      <Screen withNav>
        <div style={{ paddingTop:'56px', marginBottom:'20px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#3A1848', marginBottom:'4px' }}>Your progress.</div>
          <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)' }}>Every session counts. Here's the proof.</div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'20px' }}>
          {[{l:'Total sessions', v:totalSessions},{l:'Avg / week', v:avgSessions},{l:'Best week', v:maxSessions}].map(s => (
            <GlassCard key={s.l} strong style={{ textAlign:'center', padding:'14px 8px' }}>
              <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848' }}>{s.v}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(152,120,184,0.6)', marginTop:'4px', lineHeight:1.3 }}>{s.l}</div>
            </GlassCard>
          ))}
        </div>

        {/* Bar chart */}
        <SectionHeader>Weekly sessions</SectionHeader>
        <GlassCard style={{ marginBottom:'16px', padding:'16px' }}>
          <MiniBarChart data={WEEKLY_DATA} />
        </GlassCard>

        {/* Programme progress */}
        <SectionHeader>Active programme</SectionHeader>
        <GlassCard amethyst style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'12px' }}>
            <div>
              <div style={{ fontFamily:'Gilda Display', fontSize:'20px', color:'#F2EEFB', marginBottom:'4px' }}>{USER.programme}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(242,238,251,0.7)' }}>Week {USER.programmeWeek} of 12</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#F2EEFB' }}>{Math.round(USER.programmeProgress * 100)}%</div>
              <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(242,238,251,0.6)' }}>complete</div>
            </div>
          </div>
          <div style={{ height:'6px', borderRadius:'3px', background:'rgba(255,255,255,0.2)', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${USER.programmeProgress * 100}%`, background:'rgba(255,255,255,0.75)', borderRadius:'3px', transition:'width 1s ease' }} />
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }}>
            <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(242,238,251,0.55)' }}>Phase 1: Restore ✓</span>
            <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(242,238,251,0.55)' }}>Phase 2: Strengthen →</span>
          </div>
        </GlassCard>

        {/* Progress ring */}
        <SectionHeader>This week</SectionHeader>
        <GlassCard style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'16px' }}>
          <ProgressRing completed={USER.sessionsThisWeek} total={USER.sessionsTarget} size={88} />
          <div>
            <div style={{ fontFamily:'Gilda Display', fontSize:'22px', color:'#3A1848', marginBottom:'4px' }}>
              {USER.sessionsThisWeek === USER.sessionsTarget ? 'Week complete!' : `${USER.sessionsTarget - USER.sessionsThisWeek} session${USER.sessionsTarget - USER.sessionsThisWeek !== 1 ? 's' : ''} to go`}
            </div>
            <div style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)', lineHeight:1.5 }}>
              {USER.sessionsThisWeek} of {USER.sessionsTarget} sessions done this week
            </div>
            {USER.sessionsThisWeek > 0 && (
              <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.55)', fontStyle:'italic', marginTop:'6px' }}>
                "You're stronger than yesterday."
              </div>
            )}
          </div>
        </GlassCard>

        {/* Achievements preview */}
        <SectionHeader>Achievements</SectionHeader>
        <GlassCard style={{ marginBottom:'16px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'12px' }}>
            {BADGES.slice(0, 8).map(b => (
              <BadgeItem key={b.id} badge={b} earned={USER.earnedBadges.includes(b.id)} />
            ))}
          </div>
          <div style={{ borderTop:'0.5px solid rgba(200,184,232,0.2)', paddingTop:'10px', textAlign:'center' }}>
            <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)' }}>
              {USER.earnedBadges.length} of {BADGES.length} badges earned
            </span>
          </div>
        </GlassCard>

        {/* Streak milestones */}
        <SectionHeader>Streak milestones</SectionHeader>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
          {[{days:7,msg:"One week straight. Rosa would be proud.",done:USER.streak>=7},
            {days:30,msg:"A month of showing up. You're building something real.",done:USER.streak>=30},
            {days:90,msg:"90 days. You didn't just break the mould — you proved it was always a lie.",done:USER.streak>=90}].map(m => (
            <GlassCard key={m.days} style={{ display:'flex', alignItems:'center', gap:'12px', opacity: m.done ? 1 : 0.55 }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'50%', background: m.done ? '#9878B8' : 'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Outfit', fontSize:'11px', fontWeight:500, color: m.done ? '#F2EEFB' : 'rgba(152,120,184,0.6)', flexShrink:0 }}>{m.days}d</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight: m.done ? 500 : 400, color:'#3A1848', marginBottom:'2px' }}>{m.days}-day streak {m.done ? '✓' : ''}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:300, color:'rgba(152,120,184,0.65)', fontStyle:'italic', lineHeight:1.4 }}>"{m.msg}"</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Screen>
      <BottomNav active="progress" navigate={navigate} />
    </AppBackground>
  );
}

// ─── PROFILE SCREEN ───────────────────────────────────────────────────────────
function ProfileScreen({ navigate }) {
  const initials = USER.name.slice(0, 2).toUpperCase();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <AppBackground>
      <Screen withNav>
        <div style={{ paddingTop:'56px', marginBottom:'20px' }}>
          {/* Avatar + name */}
          <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'20px' }}>
            <div style={{ width:'68px', height:'68px', borderRadius:'50%', background:'linear-gradient(135deg,#9878B8,#C8B8E8)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Gilda Display', fontSize:'26px', color:'#F2EEFB', flexShrink:0, boxShadow:'0 4px 16px rgba(152,120,184,0.35)' }}>
              {initials}
            </div>
            <div>
              <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', lineHeight:1.1 }}>{USER.name}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)', marginTop:'3px' }}>Active: {USER.programme}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.55)', marginTop:'2px' }}>Week {USER.programmeWeek}</div>
            </div>
          </div>

          {/* Streak banner */}
          <StreakBanner streak={USER.streak} style={{ marginBottom:'16px' }} />

          {/* Stats grid */}
          <SectionHeader>Your stats</SectionHeader>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'20px' }}>
            {[{label:'Day streak',    value:USER.streak,                   emoji:'🔥'},
              {label:'Sessions',      value:WEEKLY_DATA.reduce((a,d)=>a+d.sessions,0), emoji:'💪'},
              {label:'Badges',        value:USER.earnedBadges.length,      emoji:'🏆'},
              {label:'Programme',     value:`${Math.round(USER.programmeProgress*100)}%`, emoji:'⚡'}].map(s => (
              <GlassCard key={s.label} strong style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ fontSize:'24px' }}>{s.emoji}</div>
                <div>
                  <div style={{ fontFamily:'Gilda Display', fontSize:'26px', color:'#3A1848', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(152,120,184,0.6)', marginTop:'3px' }}>{s.label}</div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Badges grid */}
          <SectionHeader>All achievements</SectionHeader>
          <GlassCard style={{ marginBottom:'16px', padding:'16px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'12px' }}>
              {BADGES.map(b => (
                <BadgeItem key={b.id} badge={b} earned={USER.earnedBadges.includes(b.id)} />
              ))}
            </div>
            <div style={{ marginTop:'14px', paddingTop:'12px', borderTop:'0.5px solid rgba(200,184,232,0.2)' }}>
              <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.65)', textAlign:'center' }}>
                {USER.earnedBadges.length} earned · {BADGES.length - USER.earnedBadges.length} remaining
              </div>
            </div>
          </GlassCard>

          {/* Recent history */}
          <SectionHeader>Workout history</SectionHeader>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'20px' }}>
            {[{date:'Today',    name:'Lower Body Sculpt', duration:'45m', week:'W3D2'},
              {date:'Yesterday',name:'Core & Recovery',   duration:'30m', week:'W3D1'},
              {date:'Mon',      name:'Upper Body Strength',duration:'45m', week:'W2D4'},
              {date:'Sat',      name:'Full Body HIIT',    duration:'30m', week:'W2D3'},
            ].map((s,i) => (
              <GlassCard key={i} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'rgba(200,184,232,0.25)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:'Outfit', fontSize:'9px', fontWeight:500, color:'#9878B8', textAlign:'center', lineHeight:1.2 }}>{s.week}</span>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848' }}>{s.name}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.65)', marginTop:'1px' }}>{s.date}</div>
                </div>
                <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.65)' }}>{s.duration}</span>
              </GlassCard>
            ))}
          </div>

          {/* Settings */}
          <SectionHeader>Account</SectionHeader>
          <GlassCard style={{ marginBottom:'20px' }}>
            {[{label:'Edit profile',      icon:'✏️'},
              {label:'Notification settings', icon:'🔔'},
              {label:'Units (Metric)',    icon:'📏'},
              {label:'Privacy policy',   icon:'🔒'},
              {label:'About ROSA',       icon:'💜'},
            ].map((item, i, arr) => (
              <div key={item.label} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 0', borderBottom: i < arr.length-1 ? '0.5px solid rgba(200,184,232,0.2)' : 'none', cursor:'pointer' }}>
                <span style={{ fontSize:'16px', width:'24px', textAlign:'center' }}>{item.icon}</span>
                <span style={{ fontFamily:'Outfit', fontSize:'13px', color:'#3A1848', flex:1 }}>{item.label}</span>
                <span style={{ fontFamily:'Outfit', fontSize:'16px', color:'rgba(152,120,184,0.35)' }}>›</span>
              </div>
            ))}
          </GlassCard>

          {/* Rosa quote */}
          <GlassCard accent style={{ textAlign:'center', padding:'20px', marginBottom:'20px' }}>
            <div style={{ fontFamily:'Gilda Display', fontSize:'16px', color:'rgba(152,120,184,0.85)', fontStyle:'italic', lineHeight:1.6 }}>
              "We are not just mums. We are the teachers of the future generation."
            </div>
            <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.45)', marginTop:'8px' }}>— Rosa</div>
          </GlassCard>
        </div>
      </Screen>
      <BottomNav active="profile" navigate={navigate} />
    </AppBackground>
  );
}
