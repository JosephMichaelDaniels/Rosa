// ─── CORE COMPONENTS ─────────────────────────────────────────────────────────
const { useState, useEffect, useRef, useCallback } = React;

// ── AppBackground ─────────────────────────────────────────────────────────────
function AppBackground({ children }) {
  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(150deg,#F2EEFB 0%,#FDEEE0 45%,#F8D0E4 100%)', position:'relative', overflowX:'hidden' }}>
      <div style={{ position:'fixed', top:'-30px', right:'-30px', width:'180px', height:'180px', borderRadius:'50%', background:'rgba(248,208,228,0.45)', filter:'blur(40px)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'fixed', bottom:'-20px', left:'-20px', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(200,184,232,0.3)', filter:'blur(32px)', pointerEvents:'none', zIndex:0 }} />
      <div style={{ position:'relative', zIndex:1 }}>{children}</div>
    </div>
  );
}

// ── GlassCard ─────────────────────────────────────────────────────────────────
function GlassCard({ children, strong, accent, amethyst, dark, style={}, onClick, className='' }) {
  const base = {
    background:     amethyst ? '#9878B8' : dark ? '#7858A0' : strong ? 'rgba(255,255,255,0.58)' : 'rgba(255,255,255,0.45)',
    border:         amethyst || dark ? 'none' : accent ? '1.5px solid rgba(248,208,228,0.85)' : '0.5px solid rgba(255,255,255,0.85)',
    borderRadius:   '16px',
    backdropFilter: amethyst || dark ? 'none' : 'blur(16px)',
    WebkitBackdropFilter: amethyst || dark ? 'none' : 'blur(16px)',
    padding:        '14px',
    ...style,
  };
  return <div style={base} onClick={onClick} className={className}>{children}</div>;
}

// ── PillButton ────────────────────────────────────────────────────────────────
function PillButton({ children, variant='primary', onClick, style={}, disabled=false, small=false }) {
  const v = {
    primary:   { background:'#9878B8', color:'#F2EEFB' },
    secondary: { background:'rgba(255,255,255,0.55)', color:'#3A1848', border:'0.5px solid rgba(255,255,255,0.85)' },
    ghost:     { background:'transparent', color:'#3A1848', border:'1.5px solid rgba(152,120,184,0.35)' },
    powder:    { background:'rgba(248,208,228,0.6)', color:'#3A1848', border:'1px solid rgba(248,208,228,0.85)' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        borderRadius:'24px',
        padding: small ? '8px 16px' : '13px 28px',
        fontSize: small ? '12px' : '13px',
        fontWeight:500,
        letterSpacing:'0.01em',
        border:'none',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition:'transform 0.1s, opacity 0.15s',
        ...v[variant],
        ...style,
      }}
      onMouseDown={e => e.currentTarget.style.transform='scale(0.97)'}
      onMouseUp={e => e.currentTarget.style.transform='scale(1)'}
      onTouchStart={e => e.currentTarget.style.transform='scale(0.97)'}
      onTouchEnd={e => e.currentTarget.style.transform='scale(1)'}
    >
      {children}
    </button>
  );
}

// ── ProgressRing ──────────────────────────────────────────────────────────────
function ProgressRing({ completed, total, size=96 }) {
  const r = (size / 2) - 10;
  const circ = 2 * Math.PI * r;
  const pct = total > 0 ? completed / total : 0;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    let frame;
    let start = null;
    const duration = 900;
    const animate = (ts) => {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimated(eased * pct);
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [pct]);

  const offset = circ - animated * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display:'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="9"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#C8B8E8" strokeWidth="9"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition:'none' }}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F8D0E4" strokeWidth="3"
        strokeDasharray={`${circ * 0.08} ${circ * 0.92}`} strokeLinecap="round"
        transform={`rotate(${-90 + animated * 360} ${size/2} ${size/2})`} opacity="0.9"/>
      <text x={size/2} y={size/2 - 5} textAnchor="middle" fill="#3A1848"
        fontSize="17" fontFamily="Gilda Display, serif">{completed}/{total}</text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" fill="rgba(152,120,184,0.65)"
        fontSize="9" fontFamily="Outfit, sans-serif">sessions</text>
    </svg>
  );
}

// ── MacroBar ──────────────────────────────────────────────────────────────────
function MacroBar({ label, value, target, colour='#C8B8E8' }) {
  const pct = Math.min((value / target) * 100, 100);
  return (
    <div style={{ marginBottom:'10px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'5px' }}>
        <span style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:400, color:'#3A1848' }}>{label}</span>
        <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)' }}>{value} / {target}g</span>
      </div>
      <div style={{ height:'6px', background:'rgba(255,255,255,0.5)', borderRadius:'3px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:colour, borderRadius:'3px', transition:'width 0.8s cubic-bezier(0.34,1.56,0.64,1)' }}/>
      </div>
    </div>
  );
}

// ── BadgeItem ─────────────────────────────────────────────────────────────────
function BadgeItem({ badge, earned }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px',
      animation: earned ? 'badgePop 0.6s ease-out both' : 'none' }}>
      <div style={{
        width:'52px', height:'52px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'22px',
        background: earned ? 'rgba(248,208,228,0.6)' : 'rgba(255,255,255,0.3)',
        border: earned ? '1.5px solid rgba(248,208,228,0.9)' : '0.5px solid rgba(255,255,255,0.5)',
        opacity: earned ? 1 : 0.4,
        boxShadow: earned ? '0 0 12px rgba(248,208,228,0.5)' : 'none',
      }}>
        {badge.emoji}
      </div>
      <span style={{ fontFamily:'Outfit', fontSize:'9px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', color:earned ? '#3A1848' : 'rgba(152,120,184,0.5)', textAlign:'center', maxWidth:'58px' }}>
        {badge.name}
      </span>
    </div>
  );
}

// ── StreakBanner ──────────────────────────────────────────────────────────────
function StreakBanner({ streak, style={} }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplay(i);
      if (i >= streak) clearInterval(timer);
    }, 60);
    return () => clearInterval(timer);
  }, [streak]);

  return (
    <GlassCard amethyst style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 18px', ...style }}>
      <div>
        <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(242,238,251,0.7)', marginBottom:'2px' }}>Current Streak</div>
        <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#F2EEFB', lineHeight:1 }}>{display}</div>
        <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(242,238,251,0.7)', marginTop:'2px' }}>days in a row</div>
      </div>
      <div style={{ fontSize:'44px', animation:'timerTick 2s ease-in-out infinite' }}>🔥</div>
    </GlassCard>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────────
function SectionHeader({ children }) {
  return (
    <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(152,120,184,0.65)', marginBottom:'10px', marginTop:'4px' }}>
      {children}
    </div>
  );
}

// ── BottomNav ─────────────────────────────────────────────────────────────────
function BottomNav({ active, navigate }) {
  const tabs = [
    { id:'home',        label:'Home',       icon:HomeIcon },
    { id:'programmes',  label:'Train',      icon:BoltIcon },
    { id:'nutrition',   label:'Nutrition',  icon:LeafIcon },
    { id:'progress',    label:'Progress',   icon:ChartIcon },
    { id:'profile',     label:'Me',         icon:UserIcon },
  ];
  return (
    <div style={{
      position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
      width:'100%', maxWidth:'390px',
      background:'rgba(255,255,255,0.75)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      borderTop:'0.5px solid rgba(255,255,255,0.9)',
      display:'flex', justifyContent:'space-around', alignItems:'center',
      padding:'10px 0 20px', zIndex:100,
    }}>
      {tabs.map(t => {
        const isActive = active === t.id;
        const Icon = t.icon;
        return (
          <button key={t.id} onClick={() => navigate(t.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'3px', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>
            <Icon size={24} color={isActive ? '#9878B8' : 'rgba(152,120,184,0.3)'} filled={isActive} />
            <span style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight: isActive ? 500 : 400, color: isActive ? '#9878B8' : 'rgba(152,120,184,0.4)' }}>{t.label}</span>
            {isActive && <div style={{ width:'4px', height:'4px', borderRadius:'50%', background:'#9878B8', marginTop:'1px' }} />}
          </button>
        );
      })}
    </div>
  );
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function HomeIcon({ size=24, color, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {filled
        ? <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill={color} stroke="none"/>
        : <><path d="M3 9.5L12 3l9 6.5"/><path d="M9 21V12h6v9"/><rect x="3" y="9" width="18" height="12" rx="1"/></>}
    </svg>
  );
}
function BoltIcon({ size=24, color, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z"/>
    </svg>
  );
}
function LeafIcon({ size=24, color, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 21C5 21 19 17 21 5C19 5 5 7 5 21z"/>
      <path d="M5 21L12 14"/>
    </svg>
  );
}
function ChartIcon({ size=24, color, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {filled
        ? <><rect x="3" y="12" width="4" height="9" rx="1" fill={color}/><rect x="10" y="7" width="4" height="14" rx="1" fill={color}/><rect x="17" y="3" width="4" height="18" rx="1" fill={color}/></>
        : <><path d="M3 21V12"/><path d="M10 21V7"/><path d="M17 21V3"/></>}
    </svg>
  );
}
function UserIcon({ size=24, color, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : 'none'} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}
function BackIcon({ size=20, color='#3A1848' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7"/>
    </svg>
  );
}
function CheckIcon({ size=16, color='#F2EEFB' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 13l4 4L19 7"/>
    </svg>
  );
}
function PlusIcon({ size=20, color='#9878B8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  );
}
function CloseIcon({ size=20, color='#3A1848' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );
}

// ── MiniBarChart ──────────────────────────────────────────────────────────────
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.sessions), 1);
  const H = 100, W = 280, barW = 32, gap = (W - data.length * barW) / (data.length + 1);
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H + 24}`} style={{ display:'block' }}>
      {data.map((d, i) => {
        const x = gap + i * (barW + gap);
        const barH = (d.sessions / max) * H;
        const y = H - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="6" fill="#C8B8E8" opacity="0.85"/>
            <text x={x + barW/2} y={H + 16} textAnchor="middle" fontFamily="Outfit" fontSize="9" fill="rgba(152,120,184,0.7)">{d.week}</text>
            <text x={x + barW/2} y={y - 4} textAnchor="middle" fontFamily="Outfit" fontSize="9" fill="#9878B8">{d.sessions}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Screen wrapper ────────────────────────────────────────────────────────────
function Screen({ children, pad=true, scrollable=true, withNav=false }) {
  return (
    <div className="fadeUp" style={{
      minHeight:'100vh',
      paddingBottom: withNav ? '90px' : 0,
      overflowY: scrollable ? 'auto' : 'hidden',
    }}>
      <div style={{ padding: pad ? '0 20px' : 0 }}>
        {children}
      </div>
    </div>
  );
}
