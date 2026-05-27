// ─── DEV TEST MODE BUTTON ─────────────────────────────────────────────────────
const ALL_SCREENS = ['splash','terms','auth','onboarding','home','programmes','programme_detail','workout','nutrition','progress','profile'];

function DevTestButton({ screen, navigate }) {
  const [open, setOpen] = useState(false);
  const [touring, setTouring] = useState(false);
  const tourRef = useRef(null);

  const startTour = () => {
    setOpen(false);
    setTouring(true);
    const stops = ['splash','terms','onboarding','home','programmes','workout','nutrition','progress','profile'];
    let i = 0;
    const tick = () => {
      if (i >= stops.length) { setTouring(false); return; }
      navigate(stops[i++]);
      tourRef.current = setTimeout(tick, 2500);
    };
    tick();
  };

  useEffect(() => () => clearTimeout(tourRef.current), []);

  return (
    <div style={{ position:'fixed', bottom:'90px', right:'16px', zIndex:9999, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px' }}>
      {open && (
        <div style={{ background:'rgba(58,24,72,0.92)', backdropFilter:'blur(12px)', borderRadius:'14px', padding:'10px 0', minWidth:'170px', boxShadow:'0 8px 32px rgba(0,0,0,0.3)' }}>
          <div style={{ fontFamily:'Outfit', fontSize:'10px', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.12em', color:'rgba(200,184,232,0.5)', padding:'0 14px 8px' }}>Jump to screen</div>
          {ALL_SCREENS.map(s => (
            <button key={s} onClick={() => { navigate(s); setOpen(false); }}
              style={{ display:'block', width:'100%', textAlign:'left', fontFamily:'Outfit', fontSize:'12px', color: s === screen ? '#C8B8E8' : 'rgba(255,255,255,0.75)', background: s === screen ? 'rgba(200,184,232,0.15)' : 'none', border:'none', padding:'7px 14px', cursor:'pointer', fontWeight: s === screen ? 600 : 400 }}>
              {s === screen ? '▶ ' : ''}{s}
            </button>
          ))}
          <div style={{ height:'0.5px', background:'rgba(200,184,232,0.2)', margin:'8px 0' }} />
          <button onClick={startTour}
            style={{ display:'block', width:'100%', textAlign:'left', fontFamily:'Outfit', fontSize:'12px', color:'#E8C8D8', background:'none', border:'none', padding:'7px 14px', cursor:'pointer', fontWeight:500 }}>
            🎬 Auto-tour (2.5s each)
          </button>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)}
        style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:600, background: touring ? 'rgba(232,100,100,0.9)' : 'rgba(58,24,72,0.85)', color:'white', border:'none', borderRadius:'20px', padding:'7px 14px', cursor:'pointer', backdropFilter:'blur(8px)', boxShadow:'0 4px 16px rgba(0,0,0,0.25)', letterSpacing:'0.04em' }}>
        {touring ? '⏹ Stop tour' : '🎬 Dev'}
      </button>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
async function getProfileRoute(session) {
  try {
    const { data } = await supabase.from('profiles').select('onboarding_complete').eq('id', session.user.id).single();
    return data?.onboarding_complete ? 'home' : 'onboarding';
  } catch (_) {
    return 'home';
  }
}

function App() {
  const [screen, setScreen] = useState('splash');
  const [params, setParams] = useState({});
  const [consentData, setConsentData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let done = false;
    const finish = (dest) => {
      if (done) return;
      done = true;
      if (dest) setScreen(dest);
      setAuthChecked(true);
    };

    // Hard 3s timeout — never leave user stuck on loading screen
    const timeout = setTimeout(() => finish(null), 3000);

    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        if (session) {
          const dest = await getProfileRoute(session);
          finish(dest);
        } else {
          finish(null); // no session → splash
        }
      })
      .catch(() => finish(null))
      .finally(() => clearTimeout(timeout));

    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session && (screen === 'auth' || screen === 'splash')) {
          try {
            const dest = await getProfileRoute(session);
            setScreen(dest);
          } catch (_) {
            setScreen('home');
          }
        }
      });
      subscription = data.subscription;
    } catch (_) {}

    return () => {
      clearTimeout(timeout);
      try { subscription && subscription.unsubscribe(); } catch (_) {}
    };
  }, []);

  const navigate = (dest, p = {}) => {
    setParams(p);
    setScreen(dest);
    window.scrollTo(0, 0);
  };

  const handleTermsAccept = (consent) => {
    setConsentData(consent);
    navigate('auth');
  };

  if (!authChecked) {
    return (
      <AppBackground>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'20px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'56px', color:'#3A1848', letterSpacing:'0.06em', animation:'pulse 1.5s ease-in-out infinite' }}>ROSA</div>
          <div style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.5)', letterSpacing:'0.08em' }}>loading…</div>
        </div>
      </AppBackground>
    );
  }

  const screenEl = (() => {
    switch (screen) {
      case 'splash':         return <SplashScreen navigate={navigate} />;
      case 'terms':          return <TermsScreen onAccept={handleTermsAccept} />;
      case 'auth':           return <AuthScreen navigate={navigate} consentData={consentData} />;
      case 'onboarding':     return <OnboardingScreen navigate={navigate} />;
      case 'home':           return <HomeScreen navigate={navigate} />;
      case 'programmes':     return <ProgrammesScreen navigate={navigate} />;
      case 'programme_detail': return <ProgrammeDetailScreen navigate={navigate} params={params} />;
      case 'workout':        return <WorkoutPlayerScreen navigate={navigate} />;
      case 'nutrition':      return <NutritionScreen navigate={navigate} />;
      case 'progress':       return <ProgressScreen navigate={navigate} />;
      case 'profile':        return <ProfileScreen navigate={navigate} />;
      default:               return <SplashScreen navigate={navigate} />;
    }
  })();

  return (
    <>
      {screenEl}
      <DevTestButton screen={screen} navigate={navigate} />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
