// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
function SplashScreen({ navigate }) {
  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center' }}>
        <div className="fadeUp" style={{ animationDelay:'0.1s' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'72px', color:'#3A1848', lineHeight:1, letterSpacing:'0.05em', marginBottom:'16px' }}>
            ROSA
          </div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'20px', color:'rgba(152,120,184,0.85)', marginBottom:'24px', fontStyle:'italic', lineHeight:1.4 }}>
            Redefining what's possible after pregnancy.
          </div>
        </div>

        <div className="fadeUp" style={{ animationDelay:'0.3s', maxWidth:'280px', marginBottom:'56px' }}>
          <div style={{ width:'48px', height:'1px', background:'rgba(200,184,232,0.4)', margin:'0 auto 20px' }} />
          <p style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(152,120,184,0.85)', lineHeight:1.7, fontStyle:'italic' }}>
            "I proved the mould was a lie. Now it's your turn."
          </p>
          <p style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:400, color:'rgba(152,120,184,0.55)', marginTop:'8px' }}>— Rosa</p>
        </div>

        <div className="fadeUp" style={{ animationDelay:'0.5s', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px', width:'100%' }}>
          <PillButton onClick={() => navigate('onboarding')} style={{ width:'100%', maxWidth:'280px', padding:'16px 28px', fontSize:'14px' }}>
            Begin your journey
          </PillButton>
          <button onClick={() => navigate('home')} style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.6)', background:'none', border:'none', cursor:'pointer' }}>
            I already have an account
          </button>
        </div>

        <div className="fadeUp" style={{ animationDelay:'0.7s', position:'absolute', bottom:'40px', display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ width:'28px', height:'1px', background:'rgba(200,184,232,0.35)' }} />
          <span style={{ fontFamily:'Outfit', fontSize:'9px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.15em', color:'rgba(152,120,184,0.4)' }}>
            Built by a champion. For champions.
          </span>
          <div style={{ width:'28px', height:'1px', background:'rgba(200,184,232,0.35)' }} />
        </div>
      </div>
    </AppBackground>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingScreen({ navigate }) {
  const [step, setStep] = useState(1);
  const TOTAL = 7;
  const [answers, setAnswers] = useState({
    lifeStage: null,
    height: 165,
    weight: 65,
    imperial: false,
    bodyType: null,
    goals: [],
    daysPerWeek: 3,
    sessionLength: 45,
    equipment: 'gym',
    dietType: 'omnivore',
    allergies: [],
  });
  const [matrix, setMatrix] = useState(null);
  const [revealing, setRevealing] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const update = (key, val) => setAnswers(a => ({ ...a, [key]: val }));

  const next = () => {
    if (step === 6) {
      setStep(7);
      setRevealing(true);
      setTimeout(() => {
        setMatrix(computeMatrix(answers));
        setRevealing(false);
        setRevealed(true);
      }, 2200);
    } else if (step < TOTAL) {
      setStep(s => s + 1);
    } else {
      navigate('home');
    }
  };
  const back = () => step > 1 && setStep(s => s - 1);

  const canContinue = () => {
    if (step === 2) return !!answers.lifeStage;
    if (step === 4) return answers.goals.length > 0;
    return true;
  };

  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', padding:'0 20px 32px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'56px', paddingBottom:'24px' }}>
          {step > 1
            ? <button onClick={back} style={{ background:'none', border:'none', cursor:'pointer', padding:'4px' }}><BackIcon /></button>
            : <div style={{ width:'28px' }} />}
          <div style={{ display:'flex', gap:'6px' }}>
            {Array.from({length:TOTAL}).map((_,i) => (
              <div key={i} style={{ width: i+1===step ? '20px' : '6px', height:'6px', borderRadius:'3px', background: i+1<=step ? '#9878B8' : 'rgba(152,120,184,0.25)', transition:'all 0.3s ease' }} />
            ))}
          </div>
          <div style={{ width:'28px' }} />
        </div>

        {/* Step content */}
        <div key={step} className="slideL" style={{ flex:1, display:'flex', flexDirection:'column' }}>
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 answers={answers} update={update} />}
          {step === 3 && <Step3 answers={answers} update={update} />}
          {step === 4 && <Step4 answers={answers} update={update} />}
          {step === 5 && <Step5 answers={answers} update={update} />}
          {step === 6 && <Step6 answers={answers} update={update} />}
          {step === 7 && <Step7 revealing={revealing} revealed={revealed} matrix={matrix} answers={answers} />}
        </div>

        {/* CTA */}
        {!(step === 7 && !revealed) && (
          <div style={{ paddingTop:'20px' }}>
            {step === 7 && revealed
              ? <PillButton onClick={() => navigate('home')} style={{ width:'100%', padding:'16px' }}>Let's start →</PillButton>
              : step < 7
                ? <PillButton onClick={next} disabled={!canContinue()} style={{ width:'100%', padding:'16px' }}>
                    {step === 6 ? 'Find my match' : 'Continue'}
                  </PillButton>
                : null}
          </div>
        )}
      </div>
    </AppBackground>
  );
}

// ── Step 1: Welcome ───────────────────────────────────────────────────────────
function Step1() {
  return (
    <div>
      <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#3A1848', lineHeight:1.2, marginBottom:'8px' }}>Welcome.</div>
      <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)', marginBottom:'28px' }}>Let's build your programme together.</div>
      <GlassCard strong accent style={{ padding:'20px' }}>
        <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:'linear-gradient(135deg,#9878B8,#C8B8E8)', marginBottom:'16px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>💪</div>
        <p style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'rgba(152,120,184,0.85)', fontStyle:'italic', lineHeight:1.6, marginBottom:'14px' }}>
          "I had three babies. Three surgeries. I was 35. Everyone said my body was different now."
        </p>
        <p style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(58,24,72,0.7)', lineHeight:1.7 }}>
          I decided to prove them wrong — and I did. This app is everything I know, built for you. 15 years of elite expertise. Your personal programme starts now.
        </p>
        <div style={{ marginTop:'16px', paddingTop:'16px', borderTop:'0.5px solid rgba(200,184,232,0.3)', fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.6)', fontStyle:'italic' }}>
          — Rosa, European &amp; British Bodybuilding Champion
        </div>
      </GlassCard>
      <div style={{ marginTop:'20px', display:'flex', gap:'10px' }}>
        {['7 specialist programmes','AI programme matching','Nutrition tracking'].map(f => (
          <div key={f} style={{ flex:1, textAlign:'center' }}>
            <div style={{ fontFamily:'Outfit', fontSize:'9px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(152,120,184,0.65)', lineHeight:1.4 }}>{f}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 2: Life Stage ────────────────────────────────────────────────────────
const LIFE_STAGES = [
  { id:'new_baby',      label:'Just had a baby',       sub:'0–6 months post-birth',   emoji:'👶' },
  { id:'post_baby_6_24',label:'Post-baby',              sub:'6–24 months',              emoji:'🌱' },
  { id:'post_baby_2plus',label:'Post-baby',             sub:'2+ years',                 emoji:'💪' },
  { id:'pregnant',      label:'Currently pregnant',    sub:'Any trimester',            emoji:'🤰' },
  { id:'no_children',   label:'No children',           sub:'Fitness focused',          emoji:'⚡' },
];
function Step2({ answers, update }) {
  return (
    <div>
      <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'6px' }}>Where are you right now?</div>
      <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)', marginBottom:'24px' }}>This shapes everything Rosa builds for you.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {LIFE_STAGES.map(s => {
          const sel = answers.lifeStage === s.id;
          return (
            <GlassCard key={s.id} strong={sel} accent={sel}
              onClick={() => update('lifeStage', s.id)}
              style={{ display:'flex', alignItems:'center', gap:'14px', cursor:'pointer', border: sel ? '1.5px solid rgba(152,120,184,0.7)' : '0.5px solid rgba(255,255,255,0.85)', transition:'all 0.15s' }}>
              <div style={{ width:'40px', height:'40px', borderRadius:'50%', background: sel ? 'rgba(152,120,184,0.15)' : 'rgba(255,255,255,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>
                {s.emoji}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:500, color:'#3A1848' }}>{s.label}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)' }}>{s.sub}</div>
              </div>
              {sel && <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#9878B8', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><CheckIcon /></div>}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 3: Body Stats ────────────────────────────────────────────────────────
const BODY_TYPES = [
  { id:'ectomorph',  label:'Lean',    sub:'Naturally slim, hard to gain',  emoji:'🏃‍♀️' },
  { id:'mesomorph',  label:'Athletic',sub:'Builds muscle easily',           emoji:'🏋️‍♀️' },
  { id:'endomorph',  label:'Curvy',   sub:'Gains weight more easily',      emoji:'💃' },
];
function Step3({ answers, update }) {
  const imp = answers.imperial;
  return (
    <div>
      <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'6px' }}>Your body today.</div>
      <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)', marginBottom:'20px' }}>Used to calculate your personal macro targets.</div>
      <GlassCard style={{ marginBottom:'16px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
          <span style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848' }}>Units</span>
          <div style={{ display:'flex', borderRadius:'20px', overflow:'hidden', border:'0.5px solid rgba(152,120,184,0.25)' }}>
            {['Metric','Imperial'].map((u,i) => (
              <button key={u} onClick={() => update('imperial', i===1)} style={{ padding:'6px 14px', fontSize:'12px', fontFamily:'Outfit', fontWeight: (imp===false&&i===0)||(imp===true&&i===1) ? 500 : 400, background: (imp===false&&i===0)||(imp===true&&i===1) ? '#9878B8' : 'transparent', color: (imp===false&&i===0)||(imp===true&&i===1) ? '#F2EEFB' : 'rgba(152,120,184,0.7)', border:'none', cursor:'pointer' }}>{u}</button>
            ))}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
          {[{label: imp ? 'Height (ft)' : 'Height (cm)', key:'height', def: imp ? 5.4 : 165},
            {label: imp ? 'Weight (lbs)' : 'Weight (kg)', key:'weight', def: imp ? 143 : 65}].map(f => (
            <div key={f.key}>
              <div style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.65)', marginBottom:'6px' }}>{f.label}</div>
              <input
                type="number"
                defaultValue={answers[f.key] || f.def}
                onChange={e => update(f.key, Number(e.target.value))}
                style={{ width:'100%', padding:'12px 14px', borderRadius:'12px', border:'0.5px solid rgba(200,184,232,0.4)', background:'rgba(253,238,224,0.4)', fontFamily:'Gilda Display', fontSize:'22px', color:'#3A1848', textAlign:'center' }}
              />
            </div>
          ))}
        </div>
      </GlassCard>
      <SectionHeader>Body Type</SectionHeader>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
        {BODY_TYPES.map(b => {
          const sel = answers.bodyType === b.id;
          return (
            <GlassCard key={b.id} strong={sel} onClick={() => update('bodyType', b.id)}
              style={{ textAlign:'center', cursor:'pointer', border: sel ? '1.5px solid rgba(152,120,184,0.7)' : '0.5px solid rgba(255,255,255,0.85)', padding:'12px 8px' }}>
              <div style={{ fontSize:'24px', marginBottom:'6px' }}>{b.emoji}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848' }}>{b.label}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)', marginTop:'3px', lineHeight:1.3 }}>{b.sub}</div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 4: Goals ─────────────────────────────────────────────────────────────
const GOALS = [
  { id:'lose_fat',      label:'Lose body fat',              emoji:'🔥' },
  { id:'build_muscle',  label:'Build muscle & strength',    emoji:'💪' },
  { id:'core',          label:'Core & pelvic floor',        emoji:'🎯' },
  { id:'rebuild',       label:'Rebuild after birth',        emoji:'🌱' },
  { id:'prenatal',      label:'Train safely in pregnancy',  emoji:'🤰' },
  { id:'booty',         label:'All-over body composition',  emoji:'⚡' },
  { id:'energy',        label:'Improve energy & wellbeing', emoji:'✨' },
];
function Step4({ answers, update }) {
  const toggle = (id) => {
    const current = answers.goals;
    if (current.includes(id)) {
      update('goals', current.filter(g => g !== id));
    } else if (current.length < 2) {
      update('goals', [...current, id]);
    }
  };
  return (
    <div>
      <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'6px' }}>What's your goal?</div>
      <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)', marginBottom:'8px' }}>Pick up to two. Rosa will prioritise them.</div>
      <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.5)', marginBottom:'20px' }}>{answers.goals.length}/2 selected</div>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {GOALS.map(g => {
          const sel = answers.goals.includes(g.id);
          const disabled = !sel && answers.goals.length >= 2;
          return (
            <GlassCard key={g.id} strong={sel} onClick={() => !disabled && toggle(g.id)}
              style={{ display:'flex', alignItems:'center', gap:'12px', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.45 : 1, border: sel ? '1.5px solid rgba(152,120,184,0.7)' : '0.5px solid rgba(255,255,255,0.85)' }}>
              <span style={{ fontSize:'20px' }}>{g.emoji}</span>
              <span style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight: sel ? 500 : 400, color:'#3A1848', flex:1 }}>{g.label}</span>
              {sel && <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#9878B8', display:'flex', alignItems:'center', justifyContent:'center' }}><CheckIcon /></div>}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 5: Time & Equipment ──────────────────────────────────────────────────
function Step5({ answers, update }) {
  const durations = [20, 30, 45, 60];
  const equipOptions = [
    { id:'home_none', label:'Home / No equipment', emoji:'🏠' },
    { id:'home_bands',label:'Home + Bands/Dumbbells', emoji:'🏋️' },
    { id:'gym',       label:'Full gym access', emoji:'🏢' },
  ];
  return (
    <div>
      <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'6px' }}>Your time.</div>
      <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)', marginBottom:'24px' }}>Rosa works around your life, not the other way.</div>

      <SectionHeader>Days per week</SectionHeader>
      <div style={{ display:'flex', gap:'6px', marginBottom:'20px', flexWrap:'wrap' }}>
        {[1,2,3,4,5,6,7].map(d => {
          const sel = answers.daysPerWeek === d;
          return (
            <button key={d} onClick={() => update('daysPerWeek', d)}
              style={{ width:'40px', height:'40px', borderRadius:'50%', background: sel ? '#9878B8' : 'rgba(255,255,255,0.5)', color: sel ? '#F2EEFB' : '#3A1848', fontFamily:'Outfit', fontSize:'14px', fontWeight:500, border: sel ? 'none' : '0.5px solid rgba(200,184,232,0.4)', cursor:'pointer' }}>
              {d}
            </button>
          );
        })}
      </div>

      <SectionHeader>Session length</SectionHeader>
      <div style={{ display:'flex', gap:'8px', marginBottom:'20px' }}>
        {durations.map(d => {
          const sel = answers.sessionLength === d;
          return (
            <button key={d} onClick={() => update('sessionLength', d)}
              style={{ flex:1, padding:'10px 4px', borderRadius:'24px', background: sel ? '#9878B8' : 'rgba(255,255,255,0.5)', color: sel ? '#F2EEFB' : '#3A1848', fontFamily:'Outfit', fontSize:'12px', fontWeight:500, border: sel ? 'none' : '0.5px solid rgba(200,184,232,0.4)', cursor:'pointer' }}>
              {d}min
            </button>
          );
        })}
      </div>

      <SectionHeader>Equipment</SectionHeader>
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {equipOptions.map(e => {
          const sel = answers.equipment === e.id;
          return (
            <GlassCard key={e.id} strong={sel} onClick={() => update('equipment', e.id)}
              style={{ display:'flex', alignItems:'center', gap:'12px', cursor:'pointer', border: sel ? '1.5px solid rgba(152,120,184,0.7)' : '0.5px solid rgba(255,255,255,0.85)' }}>
              <span style={{ fontSize:'20px' }}>{e.emoji}</span>
              <span style={{ fontFamily:'Outfit', fontSize:'14px', color:'#3A1848', fontWeight: sel ? 500 : 400 }}>{e.label}</span>
              {sel && <div style={{ marginLeft:'auto', width:'20px', height:'20px', borderRadius:'50%', background:'#9878B8', display:'flex', alignItems:'center', justifyContent:'center' }}><CheckIcon /></div>}
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}

// ── Step 6: Nutrition ─────────────────────────────────────────────────────────
const DIET_TYPES = [
  { id:'omnivore',     label:'Omnivore',     emoji:'🍗' },
  { id:'pescetarian',  label:'Pescetarian',  emoji:'🐟' },
  { id:'vegetarian',   label:'Vegetarian',   emoji:'🥦' },
  { id:'vegan',        label:'Vegan',        emoji:'🌱' },
];
const ALLERGENS = ['Gluten','Dairy','Nuts','Eggs','Soy','Shellfish'];
function Step6({ answers, update }) {
  const toggleAllergen = (a) => {
    const cur = answers.allergies;
    update('allergies', cur.includes(a) ? cur.filter(x => x!==a) : [...cur, a]);
  };
  return (
    <div>
      <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'6px' }}>Nutrition preferences.</div>
      <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)', marginBottom:'24px' }}>ROSA Kitchen will filter to what works for you.</div>

      <SectionHeader>Diet type</SectionHeader>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'20px' }}>
        {DIET_TYPES.map(d => {
          const sel = answers.dietType === d.id;
          return (
            <GlassCard key={d.id} strong={sel} onClick={() => update('dietType', d.id)}
              style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', border: sel ? '1.5px solid rgba(152,120,184,0.7)' : '0.5px solid rgba(255,255,255,0.85)' }}>
              <span style={{ fontSize:'20px' }}>{d.emoji}</span>
              <span style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight: sel ? 500 : 400, color:'#3A1848' }}>{d.label}</span>
            </GlassCard>
          );
        })}
      </div>

      <SectionHeader>Allergies / intolerances</SectionHeader>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'8px' }}>
        {ALLERGENS.map(a => {
          const sel = answers.allergies.includes(a);
          return (
            <button key={a} onClick={() => toggleAllergen(a)}
              style={{ padding:'8px 16px', borderRadius:'24px', fontFamily:'Outfit', fontSize:'12px', fontWeight:500, cursor:'pointer', background: sel ? '#9878B8' : 'rgba(255,255,255,0.5)', color: sel ? '#F2EEFB' : '#3A1848', border: sel ? 'none' : '0.5px solid rgba(200,184,232,0.4)' }}>
              {sel ? '✓ ' : ''}{a}-free
            </button>
          );
        })}
      </div>
      {answers.allergies.length === 0 && (
        <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.5)', marginTop:'12px' }}>No restrictions — you're good with everything.</div>
      )}
    </div>
  );
}

// ── Step 7: Matrix Reveal ─────────────────────────────────────────────────────
function Step7({ revealing, revealed, matrix }) {
  const [macroAnim, setMacroAnim] = useState(false);
  useEffect(() => {
    if (revealed) setTimeout(() => setMacroAnim(true), 400);
  }, [revealed]);

  if (revealing) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
        <div style={{ width:'48px', height:'48px', borderRadius:'50%', border:'3px solid #C8B8E8', borderTopColor:'#9878B8', animation:'spin 0.9s linear infinite' }} />
        <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(152,120,184,0.7)', animation:'pulse 1.5s ease-in-out infinite' }}>
          Finding your perfect match...
        </div>
        <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.5)' }}>Rosa's analysing your profile</div>
      </div>
    );
  }

  if (!revealed || !matrix) {
    return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}><div style={{ animation:'pulse 1.5s ease-in-out infinite', fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.6)' }}>Preparing your matrix…</div></div>;
  }

  const { primary, secondary, reason, kcal, protein, carbs, fat } = matrix;

  return (
    <div style={{ flex:1 }}>
      <div className="fadeUp" style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)', marginBottom:'8px' }}>
        Based on everything you've told us, Rosa has matched you with:
      </div>

      <GlassCard amethyst style={{ padding:'20px', marginBottom:'14px' }} className="scaleIn">
        <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(242,238,251,0.65)', marginBottom:'6px' }}>Your programme</div>
        <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#F2EEFB', lineHeight:1.2, marginBottom:'10px' }}>{primary.name}</div>
        <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
          <span style={{ padding:'4px 10px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', fontFamily:'Outfit', fontSize:'11px', color:'rgba(242,238,251,0.8)' }}>{primary.tag}</span>
          <span style={{ padding:'4px 10px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', fontFamily:'Outfit', fontSize:'11px', color:'rgba(242,238,251,0.8)' }}>{primary.weeks > 0 ? `${primary.weeks} weeks` : 'Trimester-based'}</span>
        </div>
        <p style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:300, color:'rgba(242,238,251,0.85)', lineHeight:1.7 }}>{reason}</p>
      </GlassCard>

      {secondary && (
        <GlassCard style={{ marginBottom:'14px' }}>
          <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(152,120,184,0.65)', marginBottom:'6px' }}>Rosa also recommends</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848' }}>{secondary.name}</div>
          <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)', marginTop:'3px' }}>As a complementary add-on</div>
        </GlassCard>
      )}

      <SectionHeader>Your daily targets</SectionHeader>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
        {[{label:'Calories', val:kcal, unit:'kcal'},{label:'Protein',val:protein,unit:'g'},{label:'Carbs',val:carbs,unit:'g'},{label:'Fat',val:fat,unit:'g'}].map((m,i) => (
          <GlassCard key={m.label} strong style={{ textAlign:'center', padding:'12px 8px', animation: macroAnim ? `countUp 0.4s ease-out ${i*0.1}s both` : 'none' }}>
            <div style={{ fontFamily:'Gilda Display', fontSize:'20px', color:'#3A1848' }}>{m.val}</div>
            <div style={{ fontFamily:'Outfit', fontSize:'9px', color:'rgba(152,120,184,0.65)', marginTop:'2px' }}>{m.unit}</div>
            <div style={{ fontFamily:'Outfit', fontSize:'9px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.06em', color:'rgba(152,120,184,0.5)', marginTop:'3px' }}>{m.label}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
