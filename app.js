// ─── ROOT APP ─────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState('splash');
  const [params, setParams] = useState({});
  const [consentData, setConsentData] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Check existing Supabase session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setScreen('home');
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && screen === 'auth') setScreen('home');
    });

    return () => subscription.unsubscribe();
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
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'48px', color:'#3A1848', letterSpacing:'0.06em', animation:'pulse 1.5s ease-in-out infinite' }}>ROSA</div>
        </div>
      </AppBackground>
    );
  }

  switch (screen) {
    case 'splash':
      return <SplashScreen navigate={navigate} />;
    case 'terms':
      return <TermsScreen onAccept={handleTermsAccept} />;
    case 'auth':
      return <AuthScreen navigate={navigate} consentData={consentData} />;
    case 'onboarding':
      return <OnboardingScreen navigate={navigate} />;
    case 'home':
      return <HomeScreen navigate={navigate} />;
    case 'programmes':
      return <ProgrammesScreen navigate={navigate} />;
    case 'programme_detail':
      return <ProgrammeDetailScreen navigate={navigate} params={params} />;
    case 'workout':
      return <WorkoutPlayerScreen navigate={navigate} />;
    case 'nutrition':
      return <NutritionScreen navigate={navigate} />;
    case 'progress':
      return <ProgressScreen navigate={navigate} />;
    case 'profile':
      return <ProfileScreen navigate={navigate} />;
    default:
      return <SplashScreen navigate={navigate} />;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
