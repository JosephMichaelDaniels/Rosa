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

            <div style={{ marginTop:'24px' }}>
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
const QUICK_FOODS = [
  { label:'☕ Coffee',     text:'a latte' },
  { label:'🥚 2 Eggs',    text:'2 eggs' },
  { label:'🍞 Toast',     text:'a slice of brown bread' },
  { label:'🍌 Banana',    text:'a banana' },
  { label:'🥛 Protein',   text:'a protein shake' },
  { label:'🍎 Apple',     text:'an apple' },
  { label:'🥣 Oats',      text:'a bowl of oats' },
  { label:'🐟 Salmon',    text:'a salmon fillet' },
];

const MEAL_SLOTS = [
  { id:'breakfast', label:'Breakfast',       hours:[6,10] },
  { id:'lunch',     label:'Lunch',           hours:[11,14] },
  { id:'dinner',    label:'Dinner',          hours:[17,21] },
  { id:'snack',     label:'Snacks & Other',  hours:[] },
];

function getMealSlot() {
  const h = new Date().getHours();
  if (h >= 6  && h < 11) return 'breakfast';
  if (h >= 11 && h < 15) return 'lunch';
  if (h >= 17 && h < 22) return 'dinner';
  return 'snack';
}

function FoodCameraButton({ onResult, disabled }) {
  const fileRef = React.useRef(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch(`${ROSA_EDGE_URL}/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64, media_type: file.type || 'image/jpeg', mode: 'food' }),
      });
      const data = await resp.json();
      const items = Array.isArray(data.parsed) ? data.parsed : [];
      if (items.length > 0) {
        onResult(items.map((it, i) => ({ ...it, id: Date.now() + i, displayQty: 1, source: 'photo' })));
      } else {
        onResult([{ id: Date.now(), name: 'Meal from photo', kcal: 400, protein: 20, carbs: 40, fat: 12, emoji: '📸', displayQty: 1, source: 'photo' }]);
      }
    } catch (_) {
      onResult([{ id: Date.now(), name: 'Meal from photo', kcal: 400, protein: 20, carbs: 40, fat: 12, emoji: '📸', displayQty: 1, source: 'photo' }]);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display:'none' }} />
      <button onClick={() => fileRef.current?.click()} disabled={disabled || loading} title="Photo scan food"
        style={{ width:'44px', height:'44px', borderRadius:'12px', background:'rgba(200,184,232,0.25)', border:'0.5px solid rgba(200,184,232,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', cursor: disabled ? 'default' : 'pointer', flexShrink:0 }}>
        {loading ? '⏳' : '📷'}
      </button>
    </>
  );
}

function MenuScannerTab({ userGoal }) {
  const fileRef = React.useRef(null);
  const [state, setState] = useState('idle'); // idle | scanning | done | error
  const [recs, setRecs] = useState([]);
  const [preview, setPreview] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setState('scanning');
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch(`${ROSA_EDGE_URL}/analyze-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: base64, media_type: file.type || 'image/jpeg', mode: 'menu', goals: userGoal || 'general health' }),
      });
      const data = await resp.json();
      const list = data.parsed?.recommendations;
      if (list?.length > 0) { setRecs(list); setState('done'); }
      else setState('error');
    } catch (_) { setState('error'); }
    e.target.value = '';
  };

  const reset = () => { setState('idle'); setRecs([]); setPreview(null); };

  return (
    <div>
      <GlassCard strong style={{ marginBottom:'16px', padding:'20px', textAlign:'center' }}>
        <div style={{ fontSize:'36px', marginBottom:'8px' }}>🍽️</div>
        <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848', marginBottom:'4px' }}>Menu Analyser</div>
        <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)', marginBottom:'16px' }}>
          Take a photo of any menu — ROSA picks the best options for your goals
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display:'none' }} />
        <button onClick={() => { reset(); setTimeout(() => fileRef.current?.click(), 50); }}
          disabled={state === 'scanning'}
          style={{ padding:'14px 28px', borderRadius:'28px', background:'linear-gradient(135deg,#9878B8,#7858A0)', color:'#F2EEFB', border:'none', fontFamily:'Outfit', fontSize:'13px', fontWeight:600, cursor:'pointer', opacity: state==='scanning' ? 0.7 : 1 }}>
          {state === 'scanning' ? '🌸 Reading menu…' : state === 'done' ? '📷 Scan another' : '📷 Scan menu'}
        </button>
      </GlassCard>

      {preview && state === 'scanning' && (
        <GlassCard style={{ marginBottom:'16px', overflow:'hidden', padding:0 }}>
          <img src={preview} alt="menu" style={{ width:'100%', maxHeight:'180px', objectFit:'cover' }} />
          <div style={{ padding:'12px', textAlign:'center', fontFamily:'Outfit', fontSize:'12px', color:'#9878B8' }}>
            🌸 Matching items to your goals…
          </div>
        </GlassCard>
      )}

      {state === 'done' && recs.length > 0 && (
        <div>
          <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(152,120,184,0.5)', marginBottom:'10px' }}>
            Rosa's picks for your goal
          </div>
          {recs.map((r, i) => (
            <GlassCard key={i} style={{ marginBottom:'10px', padding:'14px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'5px' }}>
                <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:600, color:'#3A1848' }}>{r.emoji || '🍽️'} {r.name}</div>
                <div style={{ fontFamily:'Outfit', fontSize:'13px', color:'#9878B8', fontWeight:600 }}>{r.kcal} kcal</div>
              </div>
              <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.7)', marginBottom:'8px', lineHeight:1.4 }}>{r.why}</div>
              <div style={{ display:'flex', gap:'12px' }}>
                {[['P', r.protein, '#C8B8E8'], ['C', r.carbs, '#DDD5F5'], ['F', r.fat, '#F8D0E4']].map(([l, v, c]) => (
                  <div key={l} style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.6)' }}>
                    <span style={{ fontWeight:700, color:c }}>{l}</span> {v}g
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {state === 'error' && (
        <GlassCard style={{ padding:'16px', textAlign:'center' }}>
          <div style={{ fontFamily:'Outfit', fontSize:'13px', color:'#e05c7a' }}>Couldn't read the menu. Try better lighting or a clearer photo.</div>
        </GlassCard>
      )}
    </div>
  );
}

function NutritionScreen({ navigate }) {
  const [tab, setTab] = useState('log');
  const [dietFilter, setDietFilter] = useState('All');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [kitchenLogged, setKitchenLogged] = useState([]);
  const [searchQ, setSearchQ] = useState('');
  // AI logger state
  const [aiInput, setAiInput] = useState('');
  const [aiState, setAiState] = useState('idle'); // idle | thinking | review | photo
  const [parsedItems, setParsedItems] = useState([]);
  const [loggedItems, setLoggedItems] = useState(() =>
    MEALS_TODAY.map(m => ({ ...m, _id: m.id, slot: m.time < '11:00' ? 'breakfast' : m.time < '15:00' ? 'lunch' : 'snack', time: m.time }))
  );

  const totals = loggedItems.reduce((a,m) => ({ kcal:a.kcal+m.kcal, protein:a.protein+m.protein, carbs:a.carbs+m.carbs, fat:a.fat+m.fat }), { kcal:0, protein:0, carbs:0, fat:0 });
  const targets = { kcal:USER.macros.kcalTarget, protein:USER.macros.proteinTarget, carbs:USER.macros.carbsTarget, fat:USER.macros.fatTarget };

  const submitAI = (inputText) => {
    const t = (inputText || aiInput).trim();
    if (!t) return;
    setAiState('thinking');
    setTimeout(() => {
      const items = parseFood(t);
      if (items.length === 0) {
        setParsedItems([{ id: Date.now(), name: t, kcal:150, protein:8, carbs:15, fat:6, emoji:'🍽️', estimated:true, displayQty:1 }]);
      } else {
        setParsedItems(items);
      }
      setAiState('review');
    }, 700);
  };

  const confirmLog = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const slot = getMealSlot();
    const loggedDate = now.toISOString().split('T')[0];
    const newItems = parsedItems.map(item => ({ ...item, _id: Date.now()+Math.random(), slot, time: timeStr }));
    setLoggedItems(prev => [...prev, ...newItems]);
    setParsedItems([]);
    setAiInput('');
    setAiState('idle');
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        newItems.forEach(item => {
          supabase.from('rosa_nutrition_logs').insert({
            user_id:    session.user.id,
            meal_name:  item.name,
            meal_type:  slot,
            logged_date: loggedDate,
            kcal:       item.kcal,
            protein:    item.protein,
            carbs:      item.carbs,
            fat:        item.fat,
            portions:   item.displayQty || 1,
            source:     item.source || 'text_ai',
          });
        });
      }
    });
  };

  const handlePhotoResult = (items) => {
    setParsedItems(items);
    setAiState('review');
  };

  const removeLogged = (id) => setLoggedItems(prev => prev.filter(m => m._id !== id));
  const updateParsedQty = (id, delta) => {
    setParsedItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      const newQty = Math.max(0.5, (item.displayQty || 1) + delta);
      const ratio = newQty / (item.displayQty || 1);
      return { ...item, displayQty:newQty, kcal:Math.round(item.kcal*ratio), protein:Math.round(item.protein*ratio*10)/10, carbs:Math.round(item.carbs*ratio*10)/10, fat:Math.round(item.fat*ratio*10)/10 };
    }));
  };

  const dietOpts = ['All','Vegan','Vegetarian','Pescetarian','Omnivore'];
  const filtered = KITCHEN_MEALS.filter(m => {
    const dMatch = dietFilter === 'All' || m.diet.includes(dietFilter.toLowerCase());
    const sMatch = !searchQ || m.name.toLowerCase().includes(searchQ.toLowerCase());
    return dMatch && sMatch;
  });

  if (selectedMeal) {
    return <MealDetail meal={selectedMeal} onBack={() => setSelectedMeal(null)}
      onLog={() => {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        setLoggedItems(l => [...l, { ...selectedMeal, _id: Date.now(), slot: getMealSlot(), time: timeStr }]);
        setKitchenLogged(l => [...l, selectedMeal.id]);
        setSelectedMeal(null);
      }}
      logged={kitchenLogged.includes(selectedMeal.id)} />;
  }

  const pct = (v,t) => Math.min(100, Math.round((v/(t||1))*100));
  const remaining = targets.kcal - totals.kcal;
  const overTarget = remaining < 0;

  return (
    <AppBackground>
      <Screen withNav>
        <div style={{ paddingTop:'56px', marginBottom:'16px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'32px', color:'#3A1848' }}>Today's nutrition.</div>
        </div>

        {/* Live macro summary */}
        <GlassCard strong accent style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'10px' }}>
            <div>
              <span style={{ fontFamily:'Gilda Display', fontSize:'40px', color:'#3A1848', lineHeight:1 }}>{totals.kcal}</span>
              <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.6)', marginLeft:'5px' }}>/ {targets.kcal} kcal</span>
            </div>
            <div style={{ textAlign:'right', paddingBottom:'4px' }}>
              <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.6)' }}>Remaining</div>
              <div style={{ fontFamily:'Gilda Display', fontSize:'22px', color: overTarget ? '#e05c7a' : '#9878B8' }}>{Math.abs(remaining)}{overTarget ? ' over' : ''}</div>
            </div>
          </div>
          <div style={{ height:'8px', borderRadius:'4px', background:'rgba(255,255,255,0.5)', marginBottom:'14px', overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct(totals.kcal,targets.kcal)}%`, background: overTarget ? 'linear-gradient(90deg,#e05c7a,#f8a0b4)' : 'linear-gradient(90deg,#C8B8E8,#F8D0E4)', borderRadius:'4px', transition:'width 0.6s ease' }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
            {[{l:'Protein',v:totals.protein,t:targets.protein,c:'#C8B8E8',u:'g'},{l:'Carbs',v:totals.carbs,t:targets.carbs,c:'#DDD5F5',u:'g'},{l:'Fat',v:totals.fat,t:targets.fat,c:'#F8D0E4',u:'g'}].map(m => (
              <div key={m.l}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
                  <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.7)' }}>{m.l}</span>
                  <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'#3A1848', fontWeight:500 }}>{Math.round(m.v)}<span style={{ color:'rgba(152,120,184,0.5)' }}>/{m.t}{m.u}</span></span>
                </div>
                <div style={{ height:'5px', borderRadius:'3px', background:'rgba(255,255,255,0.5)', overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct(m.v,m.t)}%`, background:m.c, borderRadius:'3px', transition:'width 0.6s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Tabs */}
        <div style={{ display:'flex', borderRadius:'24px', background:'rgba(255,255,255,0.4)', padding:'3px', marginBottom:'16px' }}>
          {[{id:'log',label:'🤖 Log'},{id:'menu',label:'🍽️ Menu'},{id:'kitchen',label:'Kitchen'}].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ flex:1, padding:'9px', borderRadius:'20px', fontFamily:'Outfit', fontSize:'12px', fontWeight:500, cursor:'pointer', background: tab===t.id ? '#9878B8' : 'transparent', color: tab===t.id ? '#F2EEFB' : 'rgba(152,120,184,0.7)', border:'none', transition:'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'log' && (
          <CalorieLogTab aiInput={aiInput} setAiInput={setAiInput} aiState={aiState} parsedItems={parsedItems}
            onSubmit={submitAI} onConfirm={confirmLog} onCancel={() => { setParsedItems([]); setAiState('idle'); }}
            onUpdateQty={updateParsedQty} loggedItems={loggedItems} onRemove={removeLogged}
            onPhotoResult={handlePhotoResult} />
        )}
        {tab === 'menu' && <MenuScannerTab userGoal="general health" />}
        {tab === 'kitchen' && (
          <KitchenTab dietFilter={dietFilter} setDietFilter={setDietFilter} dietOpts={dietOpts} filtered={filtered}
            searchQ={searchQ} setSearchQ={setSearchQ} setSelectedMeal={setSelectedMeal} loggedMeals={kitchenLogged} />
        )}
      </Screen>
      <BottomNav active="nutrition" navigate={navigate} />
    </AppBackground>
  );
}

function CalorieLogTab({ aiInput, setAiInput, aiState, parsedItems, onSubmit, onConfirm, onCancel, onUpdateQty, loggedItems, onRemove, onPhotoResult }) {
  const inputRef = useRef(null);

  const handleKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSubmit(); } };

  const grouped = MEAL_SLOTS.map(slot => ({
    ...slot,
    items: loggedItems.filter(m => m.slot === slot.id),
  })).filter(s => s.items.length > 0);

  return (
    <div>
      {/* AI input card */}
      <GlassCard strong style={{ marginBottom:'12px', padding:'14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px' }}>
          <div style={{ width:'28px', height:'28px', borderRadius:'50%', background:'linear-gradient(135deg,#9878B8,#C8B8E8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', flexShrink:0 }}>🌸</div>
          <div>
            <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:600, color:'#3A1848' }}>Tell Rosa what you ate</div>
            <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.6)' }}>Type naturally — "2 eggs on toast with a latte"</div>
          </div>
        </div>
        <textarea ref={inputRef} value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={handleKey}
          placeholder="e.g. &quot;a bowl of porridge with blueberries and honey, then a coffee&quot;"
          disabled={aiState !== 'idle'}
          style={{ width:'100%', minHeight:'72px', padding:'10px 12px', borderRadius:'12px', border:'0.5px solid rgba(200,184,232,0.4)', background:'rgba(253,238,224,0.3)', fontFamily:'Outfit', fontSize:'13px', color:'#3A1848', resize:'none', outline:'none', boxSizing:'border-box', lineHeight:1.5 }} />
        <div style={{ marginTop:'10px', display:'flex', gap:'8px' }}>
          <button onClick={() => onSubmit()}
            disabled={!aiInput.trim() || aiState !== 'idle'}
            style={{ flex:1, padding:'12px', borderRadius:'24px', background: aiInput.trim() && aiState==='idle' ? 'linear-gradient(135deg,#9878B8,#7858A0)' : 'rgba(200,184,232,0.3)', color: aiInput.trim() && aiState==='idle' ? '#F2EEFB' : 'rgba(152,120,184,0.5)', border:'none', fontFamily:'Outfit', fontSize:'13px', fontWeight:500, cursor: aiInput.trim() ? 'pointer' : 'default', transition:'all 0.2s' }}>
            {aiState === 'thinking' ? '🌸 Calculating…' : 'Analyse & log →'}
          </button>
          <FoodCameraButton onResult={onPhotoResult} disabled={aiState !== 'idle'} />
        </div>
      </GlassCard>

      {/* Quick add chips */}
      {aiState === 'idle' && (
        <div style={{ marginBottom:'16px' }}>
          <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(152,120,184,0.5)', marginBottom:'8px' }}>Quick add</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
            {QUICK_FOODS.map(f => (
              <button key={f.label} onClick={() => onSubmit(f.text)}
                style={{ padding:'7px 12px', borderRadius:'20px', background:'rgba(255,255,255,0.55)', border:'0.5px solid rgba(200,184,232,0.35)', fontFamily:'Outfit', fontSize:'11px', color:'#3A1848', cursor:'pointer', whiteSpace:'nowrap' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review parsed items */}
      {aiState === 'review' && parsedItems.length > 0 && (
        <GlassCard style={{ marginBottom:'16px', padding:'14px' }}>
          <div style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', color:'rgba(152,120,184,0.6)', marginBottom:'10px' }}>Rosa found {parsedItems.length} item{parsedItems.length>1?'s':''}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'12px' }}>
            {parsedItems.map(item => (
              <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'12px', background:'rgba(255,255,255,0.45)', border:'0.5px solid rgba(200,184,232,0.2)' }}>
                <div style={{ fontSize:'22px', flexShrink:0 }}>{item.emoji}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:500, color:'#3A1848', textTransform:'capitalize' }}>{item.name}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)', marginTop:'1px' }}>
                    {item.kcal} kcal · {item.protein}g P · {item.carbs}g C · {item.fat}g F
                    {item.estimated && <span style={{ color:'rgba(152,120,184,0.45)' }}> (est.)</span>}
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexShrink:0 }}>
                  <button onClick={() => onUpdateQty(item.id,-0.5)} style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(200,184,232,0.3)', border:'none', fontFamily:'Outfit', fontSize:'14px', color:'#9878B8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>−</button>
                  <span style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:600, color:'#3A1848', minWidth:'20px', textAlign:'center' }}>{item.displayQty}</span>
                  <button onClick={() => onUpdateQty(item.id,0.5)} style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(200,184,232,0.3)', border:'none', fontFamily:'Outfit', fontSize:'14px', color:'#9878B8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'8px 12px', borderRadius:'10px', background:'rgba(200,184,232,0.15)', marginBottom:'12px' }}>
            <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(58,24,72,0.7)' }}>
              Total: <strong style={{ color:'#3A1848' }}>{parsedItems.reduce((a,i)=>a+i.kcal,0)} kcal</strong>
              &nbsp;· {Math.round(parsedItems.reduce((a,i)=>a+i.protein,0)*10)/10}g protein
            </span>
          </div>
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={onCancel} style={{ flex:1, padding:'11px', borderRadius:'20px', background:'rgba(200,184,232,0.2)', border:'none', fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)', cursor:'pointer' }}>Edit</button>
            <button onClick={onConfirm} style={{ flex:2, padding:'11px', borderRadius:'20px', background:'linear-gradient(135deg,#9878B8,#7858A0)', border:'none', fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#F2EEFB', cursor:'pointer' }}>✓ Log it all</button>
          </div>
        </GlassCard>
      )}

      {/* Logged meals grouped by meal slot */}
      {grouped.length > 0 ? grouped.map(slot => (
        <div key={slot.id} style={{ marginBottom:'16px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
            <SectionHeader>{slot.label}</SectionHeader>
            <span style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.6)' }}>
              {slot.items.reduce((a,m)=>a+m.kcal,0)} kcal
            </span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
            {slot.items.map(m => (
              <div key={m._id} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 14px', borderRadius:'14px', background:'rgba(255,255,255,0.5)', backdropFilter:'blur(8px)' }}>
                <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(253,238,224,0.7)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>{m.emoji || '🍽️'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848', textTransform:'capitalize', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.name}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.65)', marginTop:'1px' }}>{m.time} · {m.protein}g prot</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:'Gilda Display', fontSize:'16px', color:'#3A1848' }}>{m.kcal}</div>
                  <div style={{ fontFamily:'Outfit', fontSize:'9px', color:'rgba(152,120,184,0.5)' }}>kcal</div>
                </div>
                <button onClick={() => onRemove(m._id)} style={{ width:'24px', height:'24px', borderRadius:'50%', background:'rgba(200,184,232,0.2)', border:'none', fontSize:'12px', color:'rgba(152,120,184,0.5)', cursor:'pointer', flexShrink:0 }}>×</button>
              </div>
            ))}
          </div>
        </div>
      )) : (
        <GlassCard style={{ textAlign:'center', padding:'24px' }}>
          <div style={{ fontSize:'32px', marginBottom:'8px' }}>🌸</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'15px', color:'rgba(152,120,184,0.7)', fontStyle:'italic' }}>"What have you eaten today? Tell me and I'll track it for you."</div>
          <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.45)', marginTop:'6px' }}>— Rosa</div>
        </GlassCard>
      )}
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
