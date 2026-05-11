// ─── ROOT APP ─────────────────────────────────────────────────────────────────
function App() {
  const [screen, setScreen] = useState('splash');
  const [params, setParams] = useState({});

  const navigate = (dest, p = {}) => {
    setParams(p);
    setScreen(dest);
    window.scrollTo(0, 0);
  };

  switch (screen) {
    case 'splash':
      return <SplashScreen navigate={navigate} />;
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
