// ─── WORKOUT PLAYER ───────────────────────────────────────────────────────────
function WorkoutPlayerScreen({ navigate }) {
  const [exIdx, setExIdx] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [resting, setResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [done, setDone] = useState(false);
  const [weights, setWeights] = useState(EXERCISES.map(e => e.weight));
  const timerRef = useRef(null);

  const ex = EXERCISES[exIdx];
  const totalSets = ex.sets;
  const progress = (exIdx / EXERCISES.length) * 100 + (setsDone / (totalSets * EXERCISES.length)) * 100;

  const startRest = useCallback(() => {
    if (ex.rest === 0) {
      advanceSet();
      return;
    }
    setResting(true);
    setTimeLeft(ex.rest);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setResting(false);
          advanceSet();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [ex, setsDone, exIdx]);

  const advanceSet = useCallback(() => {
    setSetsDone(s => {
      const next = s + 1;
      if (next >= totalSets) {
        if (exIdx >= EXERCISES.length - 1) {
          setDone(true);
        } else {
          setExIdx(i => i + 1);
        }
        return 0;
      }
      return next;
    });
  }, [totalSets, exIdx]);

  const skipRest = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setResting(false);
    advanceSet();
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  if (done) {
    return (
      <AppBackground>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 20px', textAlign:'center' }}>
          <div style={{ fontSize:'64px', marginBottom:'20px', animation:'badgePop 0.6s ease-out' }}>🎯</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'36px', color:'#3A1848', marginBottom:'8px' }}>Session complete!</div>
          <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(152,120,184,0.7)', marginBottom:'8px' }}>You showed up, {USER.name}. That's everything.</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'15px', color:'rgba(152,120,184,0.8)', fontStyle:'italic', marginBottom:'32px' }}>
            "You're stronger than yesterday."
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', width:'100%', marginBottom:'28px' }}>
            {[{l:'Exercises',v:EXERCISES.length},{l:'Sets',v:EXERCISES.reduce((a,e)=>a+e.sets,0)},{l:'Duration',v:`${TODAY_SESSION.duration}m`},{l:'Week',v:`${USER.programmeWeek}/${12}`}].map(s => (
              <GlassCard key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848' }}>{s.v}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'10px', textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.6)', marginTop:'4px' }}>{s.l}</div>
              </GlassCard>
            ))}
          </div>
          <PillButton onClick={() => navigate('home')} style={{ width:'100%', padding:'15px' }}>Back to home →</PillButton>
        </div>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', padding:'0 20px 32px' }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', paddingTop:'52px', marginBottom:'16px' }}>
          <button onClick={() => navigate('home')} style={{ background:'rgba(255,255,255,0.4)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(12px)' }}>
            <CloseIcon size={16} />
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.65)', marginBottom:'4px' }}>{TODAY_SESSION.name} · Week {TODAY_SESSION.week}</div>
            <div style={{ height:'4px', borderRadius:'2px', background:'rgba(255,255,255,0.4)', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'#9878B8', borderRadius:'2px', transition:'width 0.4s ease' }} />
            </div>
          </div>
          <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.65)' }}>{exIdx+1}/{EXERCISES.length}</span>
        </div>

        {/* Rest timer overlay */}
        {resting ? (
          <div className="scaleIn" style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'16px' }}>
            <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(152,120,184,0.7)' }}>Rest</div>
            <div style={{ fontFamily:'Gilda Display', fontSize:'80px', color:'#3A1848', lineHeight:1, animation:'timerTick 1s ease-in-out infinite' }}>{timeLeft}</div>
            <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.6)' }}>seconds</div>
            <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:300, color:'rgba(152,120,184,0.6)', textAlign:'center', maxWidth:'220px', fontStyle:'italic' }}>"{ex.tip}"</div>
            <PillButton variant="ghost" onClick={skipRest} style={{ marginTop:'16px' }}>Skip rest</PillButton>
          </div>
        ) : (
          <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
            {/* Exercise name */}
            <div style={{ marginBottom:'20px' }}>
              <div style={{ fontFamily:'Gilda Display', fontSize:'36px', color:'#3A1848', lineHeight:1.2, marginBottom:'6px' }}>{ex.name}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)', fontStyle:'italic' }}>{ex.tip}</div>
            </div>

            {/* Set progress */}
            <div style={{ display:'flex', gap:'6px', marginBottom:'20px' }}>
              {Array.from({length:totalSets}).map((_,i) => (
                <div key={i} style={{ flex:1, height:'4px', borderRadius:'2px', background: i < setsDone ? '#9878B8' : 'rgba(255,255,255,0.5)' }} />
              ))}
            </div>
            <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.65)', marginBottom:'20px' }}>
              Set {setsDone + 1} of {totalSets}
            </div>

            {/* Set / Rep / Weight grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginBottom:'24px' }}>
              {[{label:'Sets', value:`${setsDone+1}/${totalSets}`, sub:'current'},
                {label:'Reps', value: ex.reps > 0 ? ex.reps : '—', sub: ex.reps > 0 ? 'target' : 'hold'},
                {label:'Weight', value: weights[exIdx] > 0 ? weights[exIdx] : 'BW', sub: weights[exIdx] > 0 ? 'kg' : 'bodyweight'}].map(s => (
                <GlassCard key={s.label} strong style={{ textAlign:'center', padding:'16px 10px' }}>
                  <div style={{ fontFamily:'Gilda Display', fontSize:'30px', color:'#3A1848', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.07em', color:'rgba(152,120,184,0.55)', marginTop:'4px' }}>{s.sub}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:500, color:'rgba(152,120,184,0.7)', marginTop:'2px' }}>{s.label}</div>
                </GlassCard>
              ))}
            </div>

            {/* Weight adjust */}
            {ex.weight > 0 && (
              <GlassCard style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'20px', padding:'12px 16px' }}>
                <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)' }}>Adjust weight</span>
                <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                  <button onClick={() => setWeights(w => { const n=[...w]; n[exIdx]=Math.max(0,n[exIdx]-2.5); return n; })} style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(200,184,232,0.4)', fontFamily:'Outfit', fontSize:'18px', cursor:'pointer', color:'#9878B8' }}>−</button>
                  <span style={{ fontFamily:'Gilda Display', fontSize:'20px', color:'#3A1848', minWidth:'40px', textAlign:'center' }}>{weights[exIdx]}kg</span>
                  <button onClick={() => setWeights(w => { const n=[...w]; n[exIdx]=n[exIdx]+2.5; return n; })} style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(200,184,232,0.4)', fontFamily:'Outfit', fontSize:'18px', cursor:'pointer', color:'#9878B8' }}>+</button>
                </div>
              </GlassCard>
            )}

            {/* Next exercise preview */}
            {exIdx < EXERCISES.length - 1 && (
              <GlassCard style={{ marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px' }}>
                <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'rgba(152,120,184,0.55)', flexShrink:0 }}>Up next</div>
                <div style={{ flex:1, fontFamily:'Outfit', fontSize:'13px', color:'#3A1848' }}>{EXERCISES[exIdx+1].name}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.6)' }}>{EXERCISES[exIdx+1].sets}×{EXERCISES[exIdx+1].reps}</div>
              </GlassCard>
            )}

            <div style={{ marginTop:'auto' }}>
              <PillButton onClick={startRest} style={{ width:'100%', padding:'16px', fontSize:'14px' }}>
                {ex.rest > 0 ? `Complete set → Rest ${ex.rest}s` : 'Complete set →'}
              </PillButton>
            </div>
          </div>
        )}
      </div>
    </AppBackground>
  );
}

// ─── NUTRITION SCREEN ─────────────────────────────────────────────────────────
function NutritionScreen({ navigate }) {
  const [tab, setTab] = useState('today');
  const [dietFilter, setDietFilter] = useState('All');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [loggedMeals, setLoggedMeals] = useState([10]);
  const [searchQ, setSearchQ] = useState('');

  const dietOpts = ['All','Vegan','Vegetarian','Pescetarian','Omnivore'];
  const filtered = KITCHEN_MEALS.filter(m => {
    const dMatch = dietFilter === 'All' || m.diet.includes(dietFilter.toLowerCase());
    const sMatch = !searchQ || m.name.toLowerCase().includes(searchQ.toLowerCase());
    return dMatch && sMatch;
  });

  if (selectedMeal) {
    return <MealDetail meal={selectedMeal} onBack={() => setSelectedMeal(null)} onLog={() => { setLoggedMeals(l => [...l, selectedMeal.id]); setSelectedMeal(null); }} logged={loggedMeals.includes(selectedMeal.id)} />;
  }

  return (
    <AppBackground>
      <Screen withNav>
        <div style={{ paddingTop:'56px', marginBottom:'20px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#3A1848' }}>Today's nutrition.</div>
        </div>

        {/* Macro summary */}
        <GlassCard strong accent style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
            <div>
              <span style={{ fontFamily:'Gilda Display', fontSize:'36px', color:'#3A1848' }}>{USER.macros.kcal}</span>
              <span style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.6)', marginLeft:'4px' }}>/ {USER.macros.kcalTarget} kcal</span>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)' }}>Remaining</div>
              <div style={{ fontFamily:'Gilda Display', fontSize:'20px', color:'#9878B8' }}>{USER.macros.kcalTarget - USER.macros.kcal}</div>
            </div>
          </div>
          <div style={{ height:'8px', borderRadius:'4px', background:'rgba(255,255,255,0.5)', marginBottom:'16px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${(USER.macros.kcal/USER.macros.kcalTarget)*100}%`, background:'linear-gradient(90deg,#C8B8E8,#F8D0E4)', borderRadius:'4px', transition:'width 0.8s ease' }} />
          </div>
          <MacroBar label="Protein" value={USER.macros.protein} target={USER.macros.proteinTarget} colour="#C8B8E8" />
          <MacroBar label="Carbohydrates" value={USER.macros.carbs} target={USER.macros.carbsTarget} colour="#DDD5F5" />
          <MacroBar label="Fat" value={USER.macros.fat} target={USER.macros.fatTarget} colour="#F8D0E4" />
        </GlassCard>

        {/* Tab row */}
        <div style={{ display:'flex', borderRadius:'24px', background:'rgba(255,255,255,0.4)', padding:'3px', marginBottom:'16px' }}>
          {[{id:'today',label:"Today's log"},{id:'kitchen',label:'ROSA Kitchen'}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1, padding:'9px', borderRadius:'20px', fontFamily:'Outfit', fontSize:'12px', fontWeight:500, cursor:'pointer', background: tab===t.id ? '#9878B8' : 'transparent', color: tab===t.id ? '#F2EEFB' : 'rgba(152,120,184,0.7)', border:'none', transition:'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'today' ? (
          <TodayLog navigate={navigate} />
        ) : (
          <KitchenTab dietFilter={dietFilter} setDietFilter={setDietFilter} dietOpts={dietOpts} filtered={filtered} searchQ={searchQ} setSearchQ={setSearchQ} setSelectedMeal={setSelectedMeal} loggedMeals={loggedMeals} />
        )}
      </Screen>
      <BottomNav active="nutrition" navigate={navigate} />
    </AppBackground>
  );
}

function TodayLog({ navigate }) {
  const [showAdd, setShowAdd] = useState(false);
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
        <SectionHeader>Food log</SectionHeader>
        <button onClick={() => setShowAdd(!showAdd)} style={{ display:'flex', alignItems:'center', gap:'4px', background:'rgba(152,120,184,0.15)', border:'none', borderRadius:'20px', padding:'6px 12px', cursor:'pointer' }}>
          <PlusIcon size={14} />
          <span style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:500, color:'#9878B8' }}>Add food</span>
        </button>
      </div>

      {showAdd && (
        <GlassCard style={{ marginBottom:'12px' }}>
          <input placeholder="Search food or scan barcode…" style={{ width:'100%', padding:'10px 14px', borderRadius:'12px', border:'0.5px solid rgba(200,184,232,0.4)', background:'rgba(253,238,224,0.4)', fontFamily:'Outfit', fontSize:'13px', color:'#3A1848' }} />
          <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.55)', marginTop:'8px', textAlign:'center' }}>Barcode scanner available in the full app</div>
        </GlassCard>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'16px' }}>
        {MEALS_TODAY.map(m => (
          <GlassCard key={m.id} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:'rgba(253,238,224,0.6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>{m.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848' }}>{m.name}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.65)', marginTop:'2px' }}>{m.time} · {m.diet[0]}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:'Gilda Display', fontSize:'16px', color:'#3A1848' }}>{m.kcal}</div>
              <div style={{ fontFamily:'Outfit', fontSize:'9px', color:'rgba(152,120,184,0.55)' }}>kcal</div>
              <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)', marginTop:'2px' }}>{m.protein}g prot</div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard style={{ textAlign:'center', padding:'20px' }}>
        <div style={{ fontFamily:'Gilda Display', fontSize:'15px', color:'rgba(152,120,184,0.7)', fontStyle:'italic' }}>"Nourish your body like the athlete you are."</div>
        <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.45)', marginTop:'6px' }}>— Rosa</div>
      </GlassCard>
    </div>
  );
}

function KitchenTab({ dietFilter, setDietFilter, dietOpts, filtered, searchQ, setSearchQ, setSelectedMeal, loggedMeals }) {
  const categories = [...new Set(filtered.map(m => m.category))];
  return (
    <div>
      <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search ROSA Kitchen…"
        style={{ width:'100%', padding:'12px 16px', borderRadius:'24px', border:'0.5px solid rgba(200,184,232,0.4)', background:'rgba(255,255,255,0.5)', fontFamily:'Outfit', fontSize:'13px', color:'#3A1848', marginBottom:'12px' }} />
      <div style={{ display:'flex', gap:'6px', overflowX:'auto', paddingBottom:'4px', marginBottom:'16px' }}>
        {dietOpts.map(d => (
          <button key={d} onClick={() => setDietFilter(d)}
            style={{ padding:'7px 14px', borderRadius:'24px', whiteSpace:'nowrap', fontFamily:'Outfit', fontSize:'11px', fontWeight:500, cursor:'pointer', background: dietFilter===d ? '#9878B8' : 'rgba(255,255,255,0.5)', color: dietFilter===d ? '#F2EEFB' : '#3A1848', border: dietFilter===d ? 'none' : '0.5px solid rgba(200,184,232,0.3)', flexShrink:0 }}>
            {d}
          </button>
        ))}
      </div>
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom:'16px' }}>
          <SectionHeader>{cat}</SectionHeader>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {filtered.filter(m => m.category === cat).map(m => (
              <GlassCard key={m.id} onClick={() => setSelectedMeal(m)} style={{ cursor:'pointer', padding:'12px' }}>
                <div style={{ fontSize:'28px', marginBottom:'8px' }}>{m.emoji}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:500, color:'#3A1848', lineHeight:1.3, marginBottom:'6px' }}>{m.name}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ fontFamily:'Gilda Display', fontSize:'14px', color:'#3A1848' }}>{m.kcal}<span style={{ fontFamily:'Outfit', fontSize:'9px', color:'rgba(152,120,184,0.6)' }}> kcal</span></span>
                  <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)' }}>{m.prepMins}m</span>
                </div>
                <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'#9878B8', fontWeight:500, marginTop:'4px' }}>{m.protein}g protein</div>
                {loggedMeals.includes(m.id) && (
                  <div style={{ marginTop:'6px', padding:'3px 8px', borderRadius:'8px', background:'rgba(200,184,232,0.25)', fontFamily:'Outfit', fontSize:'9px', color:'#9878B8', fontWeight:500, textAlign:'center' }}>✓ Logged</div>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function MealDetail({ meal, onBack, onLog, logged }) {
  const [portions, setPortions] = useState(1);
  const scale = portions;
  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', overflowY:'auto', paddingBottom:'32px' }}>
        <div style={{ background:'rgba(253,238,224,0.7)', padding:'56px 20px 24px', backdropFilter:'blur(16px)' }}>
          <button onClick={onBack} style={{ background:'rgba(255,255,255,0.5)', border:'none', borderRadius:'50%', width:'36px', height:'36px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'16px' }}>
            <BackIcon size={18} />
          </button>
          <div style={{ fontSize:'48px', marginBottom:'12px' }}>{meal.emoji}</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'26px', color:'#3A1848', marginBottom:'4px' }}>{meal.name}</div>
          <div style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)' }}>{meal.category} · {meal.prepMins} min prep</div>
        </div>
        <div style={{ padding:'20px' }}>
          {/* Macros */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px', marginBottom:'16px' }}>
            {[{l:'Calories',v:Math.round(meal.kcal*scale),u:'kcal'},{l:'Protein',v:Math.round(meal.protein*scale),u:'g'},{l:'Carbs',v:Math.round(meal.carbs*scale),u:'g'},{l:'Fat',v:Math.round(meal.fat*scale),u:'g'}].map(m => (
              <GlassCard key={m.l} style={{ textAlign:'center', padding:'10px 6px' }}>
                <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848' }}>{m.v}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'9px', color:'rgba(152,120,184,0.55)' }}>{m.u}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.06em', color:'rgba(152,120,184,0.5)', marginTop:'2px' }}>{m.l}</div>
              </GlassCard>
            ))}
          </div>

          {/* Portions */}
          <GlassCard style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px', padding:'12px 16px' }}>
            <span style={{ fontFamily:'Outfit', fontSize:'13px', color:'#3A1848' }}>Portions</span>
            <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
              <button onClick={() => setPortions(p => Math.max(0.5,p-0.5))} style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(200,184,232,0.4)', fontFamily:'Outfit', fontSize:'18px', cursor:'pointer', color:'#9878B8' }}>−</button>
              <span style={{ fontFamily:'Gilda Display', fontSize:'22px', color:'#3A1848', minWidth:'32px', textAlign:'center' }}>{portions}</span>
              <button onClick={() => setPortions(p => p+0.5)} style={{ width:'32px', height:'32px', borderRadius:'50%', background:'rgba(255,255,255,0.5)', border:'0.5px solid rgba(200,184,232,0.4)', fontFamily:'Outfit', fontSize:'18px', cursor:'pointer', color:'#9878B8' }}>+</button>
            </div>
          </GlassCard>

          {/* Ingredients */}
          <SectionHeader>Ingredients</SectionHeader>
          <GlassCard style={{ marginBottom:'16px' }}>
            {meal.ingredients.map((ing, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom: i < meal.ingredients.length-1 ? '0.5px solid rgba(200,184,232,0.2)' : 'none' }}>
                <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#C8B8E8', flexShrink:0 }} />
                <span style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(58,24,72,0.75)' }}>{ing}</span>
              </div>
            ))}
          </GlassCard>

          {/* Method */}
          <SectionHeader>Method</SectionHeader>
          <GlassCard style={{ marginBottom:'20px' }}>
            <p style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:300, color:'rgba(58,24,72,0.75)', lineHeight:1.7 }}>{meal.method}</p>
          </GlassCard>

          <PillButton onClick={onLog} disabled={logged} style={{ width:'100%', padding:'14px' }} variant={logged ? 'secondary' : 'primary'}>
            {logged ? '✓ Logged to today' : 'Log this meal'}
          </PillButton>
        </div>
      </div>
    </AppBackground>
  );
}
