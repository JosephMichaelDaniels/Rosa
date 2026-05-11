// ─── AUTH SCREENS ─────────────────────────────────────────────────────────────
// Covers: Terms gate → Login (email / Google / Meta / Apple) → Verify / Signup

// ── Terms & Conditions Gate ───────────────────────────────────────────────────
function TermsScreen({ onAccept }) {
  const [scrolled, setScrolled] = useState(false);
  const [gdpr, setGdpr] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40) setScrolled(true);
  };

  const canAccept = scrolled && gdpr;

  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', padding:'0 20px 32px' }}>
        <div style={{ paddingTop:'56px', marginBottom:'20px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'4px' }}>Before you begin.</div>
          <div style={{ fontFamily:'Outfit', fontSize:'14px', color:'rgba(152,120,184,0.7)' }}>Please read and accept our terms to continue.</div>
        </div>

        {/* Scrollable terms */}
        <GlassCard strong style={{ flex:1, overflow:'hidden', marginBottom:'16px', padding:0, display:'flex', flexDirection:'column' }}>
          <div ref={scrollRef} onScroll={handleScroll}
            style={{ overflowY:'auto', padding:'16px', flex:1, maxHeight:'42vh' }}>
            <TermsContent />
            <PrivacyContent />
            <MedicalDisclaimer />
            <DataRights />
          </div>
          {!scrolled && (
            <div style={{ padding:'10px 16px', background:'rgba(200,184,232,0.15)', borderTop:'0.5px solid rgba(200,184,232,0.3)', textAlign:'center' }}>
              <span style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.7)' }}>↓ Scroll to read all terms before accepting</span>
            </div>
          )}
        </GlassCard>

        {/* Consent checkboxes */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
          <ConsentRow checked={gdpr} onChange={setGdpr}
            label="I have read and agree to the Terms of Service, Privacy Policy, and Medical Disclaimer. I understand ROSA is a fitness app and not a medical service." required />
          <ConsentRow checked={marketing} onChange={setMarketing}
            label="I'd like to receive updates, programme launches and tips from Rosa. (Optional — you can change this anytime.)" required={false} />
        </div>

        <PillButton onClick={() => canAccept && onAccept({ gdpr, marketing })} disabled={!canAccept}
          style={{ width:'100%', padding:'16px', fontSize:'14px', opacity: canAccept ? 1 : 0.45 }}>
          Accept & continue
        </PillButton>
        <div style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.5)', textAlign:'center', marginTop:'10px', lineHeight:1.5 }}>
          By continuing you confirm you are 18 or over. Your data is stored securely and never sold. GDPR compliant.
        </div>
      </div>
    </AppBackground>
  );
}

function ConsentRow({ checked, onChange, label, required }) {
  return (
    <GlassCard style={{ display:'flex', gap:'12px', alignItems:'flex-start', padding:'12px 14px', cursor:'pointer' }}
      onClick={() => onChange(!checked)}>
      <div style={{ width:'22px', height:'22px', borderRadius:'6px', border: checked ? 'none' : '1.5px solid rgba(152,120,184,0.4)', background: checked ? '#9878B8' : 'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'1px' }}>
        {checked && <CheckIcon size={13} />}
      </div>
      <div style={{ flex:1 }}>
        <span style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(58,24,72,0.8)', lineHeight:1.55 }}>{label}</span>
        {required && <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.6)', marginLeft:'4px' }}>*Required</span>}
      </div>
    </GlassCard>
  );
}

// ── Login / Signup Screen ─────────────────────────────────────────────────────
function AuthScreen({ navigate, consentData }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmail = async () => {
    if (!email || (mode !== 'forgot' && !password)) { setError('Please fill in all fields.'); return; }
    setLoading('email');
    setError('');
    try {
      if (mode === 'signup') {
        const redirectTo = window.location.hostname === 'localhost' ? window.location.origin : 'https://rosa-app-ten.vercel.app';
        const { data, error: err } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo, data: { full_name: name, marketing_consent: consentData?.marketing, gdpr_consent: true, gdpr_date: new Date().toISOString() } } });
        if (err) throw err;
        setMode('verify');
      } else if (mode === 'login') {
        const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        const { data: profile } = await supabase.from('profiles').select('onboarding_complete').eq('id', data.user.id).single();
        navigate(profile?.onboarding_complete ? 'home' : 'onboarding');
      } else {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email);
        if (err) throw err;
        setMode('forgot_sent');
      }
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.');
    }
    setLoading(null);
  };

  const handleOAuth = async (provider) => {
    setLoading(provider);
    setError('');
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo: window.location.origin } });
      if (err) throw err;
    } catch (e) {
      setError(e.message || 'OAuth sign-in failed.');
    }
    setLoading(null);
  };

  // Verify email sent state
  if (mode === 'verify') {
    return (
      <AppBackground>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 28px', textAlign:'center' }}>
          <div style={{ fontSize:'56px', marginBottom:'20px' }}>📬</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'8px' }}>Check your inbox.</div>
          <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(152,120,184,0.7)', lineHeight:1.7, marginBottom:'32px' }}>
            We've sent a verification link to <strong style={{ color:'#3A1848' }}>{email}</strong>. Click it to activate your account, then come back here.
          </div>
          <PillButton onClick={() => navigate('home')} style={{ width:'100%', maxWidth:'280px', padding:'14px' }}>
            I've verified — continue →
          </PillButton>
          <button onClick={() => setMode('login')} style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.6)', background:'none', border:'none', cursor:'pointer', marginTop:'16px' }}>
            Back to login
          </button>
        </div>
      </AppBackground>
    );
  }

  if (mode === 'forgot_sent') {
    return (
      <AppBackground>
        <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 28px', textAlign:'center' }}>
          <div style={{ fontSize:'56px', marginBottom:'20px' }}>🔑</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'28px', color:'#3A1848', marginBottom:'8px' }}>Reset link sent.</div>
          <div style={{ fontFamily:'Outfit', fontSize:'14px', fontWeight:300, color:'rgba(152,120,184,0.7)', lineHeight:1.7, marginBottom:'32px' }}>
            Check your email for a password reset link.
          </div>
          <PillButton onClick={() => setMode('login')} style={{ width:'100%', maxWidth:'280px', padding:'14px' }}>
            Back to login
          </PillButton>
        </div>
      </AppBackground>
    );
  }

  return (
    <AppBackground>
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', padding:'0 24px 32px' }}>
        {/* Header */}
        <div style={{ paddingTop:'64px', textAlign:'center', marginBottom:'32px' }}>
          <div style={{ fontFamily:'Gilda Display', fontSize:'48px', color:'#3A1848', letterSpacing:'0.06em', marginBottom:'8px' }}>ROSA</div>
          <div style={{ fontFamily:'Gilda Display', fontSize:'16px', color:'rgba(152,120,184,0.8)', fontStyle:'italic' }}>
            {mode === 'signup' ? 'Create your account.' : mode === 'forgot' ? 'Reset your password.' : 'Welcome back.'}
          </div>
        </div>

        {/* OAuth buttons */}
        {mode !== 'forgot' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
            <OAuthButton provider="google" label="Continue with Google" loading={loading==='google'} onClick={() => handleOAuth('google')} />
            <OAuthButton provider="apple"  label="Continue with Apple"  loading={loading==='apple'}  onClick={() => handleOAuth('apple')} />
            <OAuthButton provider="facebook" label="Continue with Meta" loading={loading==='facebook'} onClick={() => handleOAuth('facebook')} />
          </div>
        )}

        {/* Divider */}
        {mode !== 'forgot' && (
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
            <div style={{ flex:1, height:'0.5px', background:'rgba(200,184,232,0.4)' }} />
            <span style={{ fontFamily:'Outfit', fontSize:'11px', color:'rgba(152,120,184,0.55)' }}>or with email</span>
            <div style={{ flex:1, height:'0.5px', background:'rgba(200,184,232,0.4)' }} />
          </div>
        )}

        {/* Email form */}
        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'16px' }}>
          {mode === 'signup' && (
            <AuthInput placeholder="Full name" value={name} onChange={setName} type="text" icon="👤" />
          )}
          <AuthInput placeholder="Email address" value={email} onChange={setEmail} type="email" icon="✉️" />
          {mode !== 'forgot' && (
            <AuthInput placeholder="Password" value={password} onChange={setPassword}
              type={showPassword ? 'text' : 'password'} icon="🔒"
              rightAction={{ label: showPassword ? 'Hide' : 'Show', onClick: () => setShowPassword(!showPassword) }} />
          )}
        </div>

        {error && (
          <div style={{ padding:'10px 14px', borderRadius:'10px', background:'rgba(248,100,100,0.12)', border:'0.5px solid rgba(248,100,100,0.3)', fontFamily:'Outfit', fontSize:'12px', color:'#c0392b', marginBottom:'12px' }}>
            {error}
          </div>
        )}

        {mode === 'login' && (
          <button onClick={() => { setMode('forgot'); setError(''); }}
            style={{ fontFamily:'Outfit', fontSize:'12px', color:'rgba(152,120,184,0.7)', background:'none', border:'none', cursor:'pointer', textAlign:'right', marginBottom:'12px' }}>
            Forgot password?
          </button>
        )}

        <PillButton onClick={handleEmail} style={{ width:'100%', padding:'15px', fontSize:'14px', marginBottom:'16px' }}>
          {loading === 'email' ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Send reset link' : 'Sign in'}
        </PillButton>

        {/* Toggle login/signup */}
        {mode !== 'forgot' ? (
          <div style={{ textAlign:'center' }}>
            <span style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
              style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#9878B8', background:'none', border:'none', cursor:'pointer' }}>
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        ) : (
          <button onClick={() => { setMode('login'); setError(''); }}
            style={{ fontFamily:'Outfit', fontSize:'13px', color:'rgba(152,120,184,0.7)', background:'none', border:'none', cursor:'pointer', textAlign:'center', width:'100%' }}>
            ← Back to sign in
          </button>
        )}

        {/* Legal note */}
        <div style={{ marginTop:'auto', paddingTop:'24px', textAlign:'center' }}>
          <span style={{ fontFamily:'Outfit', fontSize:'10px', color:'rgba(152,120,184,0.45)', lineHeight:1.6 }}>
            Protected by reCAPTCHA. GDPR compliant. Your data is never sold.{'\n'}
            <span style={{ textDecoration:'underline', cursor:'pointer' }}>Privacy Policy</span> · <span style={{ textDecoration:'underline', cursor:'pointer' }}>Terms of Service</span>
          </span>
        </div>
      </div>
    </AppBackground>
  );
}

// ── OAuth Button ──────────────────────────────────────────────────────────────
function OAuthButton({ provider, label, onClick, loading }) {
  const icons = {
    google:   <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
    apple:    <svg width="18" height="18" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.18 1.27-2.16 3.8.03 3.02 2.65 4.03 2.68 4.04l-.07.28zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>,
    facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  };
  return (
    <GlassCard strong onClick={onClick} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', padding:'13px', cursor:'pointer' }}>
      {loading ? <div style={{ width:'18px', height:'18px', borderRadius:'50%', border:'2px solid #C8B8E8', borderTopColor:'#9878B8', animation:'spin 0.8s linear infinite' }} /> : icons[provider]}
      <span style={{ fontFamily:'Outfit', fontSize:'13px', fontWeight:500, color:'#3A1848' }}>{label}</span>
    </GlassCard>
  );
}

// ── Auth Input ────────────────────────────────────────────────────────────────
function AuthInput({ placeholder, value, onChange, type='text', icon, rightAction }) {
  return (
    <div style={{ position:'relative' }}>
      <div style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', fontSize:'16px', pointerEvents:'none' }}>{icon}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width:'100%', padding:'14px 14px 14px 42px', borderRadius:'14px', border:'0.5px solid rgba(200,184,232,0.5)', background:'rgba(255,255,255,0.55)', backdropFilter:'blur(8px)', fontFamily:'Outfit', fontSize:'14px', color:'#3A1848', paddingRight: rightAction ? '56px' : '14px' }}
      />
      {rightAction && (
        <button onClick={rightAction.onClick} style={{ position:'absolute', right:'14px', top:'50%', transform:'translateY(-50%)', fontFamily:'Outfit', fontSize:'11px', fontWeight:500, color:'#9878B8', background:'none', border:'none', cursor:'pointer' }}>{rightAction.label}</button>
      )}
    </div>
  );
}

// ─── TERMS & LEGAL CONTENT ────────────────────────────────────────────────────
function LegalSection({ title, children }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      <div style={{ fontFamily:'Outfit', fontSize:'11px', fontWeight:500, textTransform:'uppercase', letterSpacing:'0.08em', color:'#9878B8', marginBottom:'6px' }}>{title}</div>
      <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:300, color:'rgba(58,24,72,0.75)', lineHeight:1.75 }}>{children}</div>
    </div>
  );
}

function TermsContent() {
  return (
    <>
      <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848', marginBottom:'12px' }}>Terms of Service</div>
      <LegalSection title="1. Acceptance">
        By creating a ROSA account you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the app. These terms are governed by the laws of England and Wales.
      </LegalSection>
      <LegalSection title="2. Eligibility">
        You must be 18 or older to use ROSA. By registering, you confirm you meet this requirement.
      </LegalSection>
      <LegalSection title="3. Your Account">
        You are responsible for maintaining the confidentiality of your login credentials. You must notify us immediately of any unauthorised use. We may suspend accounts that violate these terms.
      </LegalSection>
      <LegalSection title="4. Subscription & Billing">
        ROSA offers free and premium tiers. Premium subscriptions renew automatically. You may cancel at any time via your account settings. Refunds are governed by applicable consumer law (UK Consumer Rights Act 2015 / EU Directive 2011/83/EU).
      </LegalSection>
      <LegalSection title="5. Intellectual Property">
        All content — programmes, nutrition data, branding, copy, and imagery — is the intellectual property of ROSA and its licensors. You may not reproduce, distribute or create derivative works without written permission.
      </LegalSection>
      <LegalSection title="6. Prohibited Use">
        You agree not to: reverse-engineer the app; scrape or automate data collection; share your account; use the service for commercial purposes without authorisation; upload harmful, illegal or infringing content.
      </LegalSection>
      <LegalSection title="7. Limitation of Liability">
        ROSA is a fitness information platform, not a medical service. To the maximum extent permitted by law, ROSA is not liable for indirect, incidental or consequential damages arising from use of the app.
      </LegalSection>
      <LegalSection title="8. Changes to Terms">
        We may update these terms. We'll notify you of material changes by email or in-app notification. Continued use after notice constitutes acceptance.
      </LegalSection>
    </>
  );
}

function PrivacyContent() {
  return (
    <>
      <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848', marginBottom:'12px', marginTop:'8px' }}>Privacy Policy</div>
      <LegalSection title="Data Controller">
        ROSA App Ltd is the data controller for personal data collected via this application (GDPR Article 4(7) / UK GDPR).
      </LegalSection>
      <LegalSection title="What We Collect">
        • Account data: name, email address, password (hashed){'\n'}
        • Profile data: age range, life stage, fitness goals, body measurements (user-provided){'\n'}
        • Usage data: sessions completed, nutrition logs, streaks, badges{'\n'}
        • Device data: device type, OS, IP address (for security purposes){'\n'}
        • Optional: marketing preferences
      </LegalSection>
      <LegalSection title="Legal Basis (GDPR Article 6)">
        We process your data under: (a) contractual necessity — to provide the app service; (b) legitimate interests — app security and fraud prevention; (c) consent — marketing communications (withdrawable at any time).
      </LegalSection>
      <LegalSection title="How We Use Your Data">
        • Providing and personalising your programme{'\n'}
        • Calculating macro targets and nutrition recommendations{'\n'}
        • Sending service communications (account, safety){'\n'}
        • Marketing emails (consent-based only){'\n'}
        • Analytics to improve the app (anonymised/aggregated)
      </LegalSection>
      <LegalSection title="Data Sharing">
        We do not sell your personal data. We share data only with: (a) Supabase (infrastructure — EU data processing agreement in place); (b) payment processors for subscription billing; (c) analytics providers under data processing agreements. All processors are GDPR-compliant.
      </LegalSection>
      <LegalSection title="Data Retention">
        We retain account data for the duration of your account and up to 3 years after deletion (for legal compliance). Anonymised analytics data may be retained indefinitely.
      </LegalSection>
      <LegalSection title="International Transfers">
        Your data is stored in EU/EEA data centres. Any transfers outside the EEA are protected by Standard Contractual Clauses (SCCs) per GDPR Article 46.
      </LegalSection>
      <LegalSection title="Cookies">
        We use essential cookies only. Analytics cookies require your separate consent via our cookie banner.
      </LegalSection>
    </>
  );
}

function DataRights() {
  return (
    <>
      <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848', marginBottom:'12px', marginTop:'8px' }}>Your Rights</div>
      <LegalSection title="GDPR & UK GDPR Rights">
        You have the right to: (a) Access your personal data; (b) Rectify inaccurate data; (c) Erase your data ("right to be forgotten"); (d) Restrict processing; (e) Data portability; (f) Object to processing; (g) Withdraw consent at any time.{'\n\n'}
        To exercise any right, contact: <strong>privacy@rosa-app.com</strong>{'\n'}
        We respond within 30 days (GDPR Article 12). You have the right to lodge a complaint with the ICO (UK) or your national supervisory authority (EU).
      </LegalSection>
      <LegalSection title="California (CCPA)">
        California residents have additional rights including the right to know, delete, and opt-out of the sale of personal information. We do not sell personal information. Contact: privacy@rosa-app.com
      </LegalSection>
    </>
  );
}

function MedicalDisclaimer() {
  return (
    <>
      <div style={{ fontFamily:'Gilda Display', fontSize:'18px', color:'#3A1848', marginBottom:'12px', marginTop:'8px' }}>Medical Disclaimer</div>
      <GlassCard style={{ background:'rgba(255,200,100,0.15)', border:'0.5px solid rgba(255,180,50,0.4)', marginBottom:'12px' }}>
        <div style={{ fontFamily:'Outfit', fontSize:'12px', fontWeight:300, color:'rgba(58,24,72,0.8)', lineHeight:1.75 }}>
          ⚕️ <strong>Important:</strong> ROSA is a fitness and wellness app. It is not a medical service and does not provide medical advice, diagnosis or treatment. Content is for informational purposes only.{'\n\n'}
          • Consult your GP or healthcare provider before starting any new fitness programme, particularly if you are pregnant, postpartum, or have a medical condition.{'\n'}
          • The prenatal programme (Stay Fit Whilst Pregnant) requires physician sign-off. By selecting it, you confirm you have obtained medical clearance.{'\n'}
          • Pelvic floor and postnatal content is designed by fitness professionals, not physiotherapists. If you experience pain, stop and consult a qualified pelvic health physiotherapist.{'\n'}
          • ROSA is not liable for any injury arising from use of its programmes.
        </div>
      </GlassCard>
    </>
  );
}
