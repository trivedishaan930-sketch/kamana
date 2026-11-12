import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarDays, Flower2, Landmark, Leaf, Menu, Palette, Pencil, Search, Shapes, ShieldCheck, Shirt, Sparkles, UploadCloud, UserRound, X } from 'lucide-react';
import type { EmailOtpType } from '@supabase/supabase-js';
import { api, ApiError, type Artwork, type Report } from './lib/api';
import { getPublicProfile, getSession, supabase, supabaseConfigured, type Session } from './lib/supabase';

const rules = 'AI-generated artwork only. Nudity, sex acts, pornography, minors or ambiguous-age subjects, nonconsensual sexual imagery, real-person sexual deepfakes, unlawful material, and work without publishing rights are prohibited.';
const categories = [{id:'general-illustration',label:'General Illustration'},{id:'festival-celebration',label:'Festival & Celebration'},{id:'nature-wildlife',label:'Nature & Wildlife'},{id:'fantasy-mythology',label:'Fantasy & Mythology'},{id:'portrait-character',label:'Portrait & Character'},{id:'fashion-editorial',label:'Fashion & Editorial'},{id:'architecture-places',label:'Architecture & Places'},{id:'abstract-experimental',label:'Abstract & Experimental'},{id:'indian-folk-traditional',label:'Indian Folk & Traditional'}];
const indianStyles = [{id:'madhubani',label:'Madhubani / Mithila'},{id:'warli',label:'Warli'},{id:'gond',label:'Gond'},{id:'odisha-pattachitra',label:'Odisha Pattachitra'},{id:'rajasthani-phad',label:'Rajasthani Phad'},{id:'kalamkari-srikalahasti',label:'Kalamkari — Srikalahasti (freehand)'},{id:'kalamkari-machilipatnam-pedana',label:'Kalamkari — Machilipatnam / Pedana (block print)'},{id:'cheriyal',label:'Cheriyal'},{id:'thanjavur-tanjore',label:'Thanjavur / Tanjore'}];
const categoryIcons = {
  'general-illustration': Pencil,
  'festival-celebration': CalendarDays,
  'nature-wildlife': Leaf,
  'fantasy-mythology': Sparkles,
  'portrait-character': UserRound,
  'fashion-editorial': Shirt,
  'architecture-places': Landmark,
  'abstract-experimental': Shapes,
  'indian-folk-traditional': Flower2,
} as const;
const categoryLabels = Object.fromEntries(categories.map(item=>[item.id,item.label]));
const styleLabels = Object.fromEntries(indianStyles.map(item=>[item.id,item.label]));
const categoryLabel = (id:string) => categoryLabels[id] || (id==='adult-fashion-swimwear'?'18+ Fashion & Swimwear':id);
const styleLabel = (id:string|null|undefined) => id ? styleLabels[id] || id : '';
const adultRules = 'Only fictional, clearly adult-looking subjects in non-nude fashion and opaque swimwear. Nudity, sex acts, pornographic content, minors or ambiguous-age subjects, nonconsensual sexual imagery, and real-person sexual deepfakes are prohibited.';
const reportCategories = [
  ['prohibited-sexual-content', 'Prohibited sexual or nude content'],
  ['minor-or-ambiguous-age', 'Minor or ambiguous-age subject'],
  ['non-consensual-or-deepfake', 'Non-consensual imagery or real-person deepfake'],
  ['copyright-rights', 'Copyright / rights concern'],
  ['unlawful-content', 'Unlawful content'],
  ['other', 'Other rules concern'],
] as const;

function errorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  if (error && typeof error === 'object') {
    const candidate = error as Record<string, unknown>;
    for (const key of ['message', 'error', 'msg']) {
      if (typeof candidate[key] === 'string' && candidate[key]) return candidate[key] as string;
    }
  }
  return fallback;
}

function Rules() {
  return <div className="safety-strip" role="note"><ShieldCheck size={15}/><div><strong>Non-explicit beta only.</strong> {rules}</div></div>;
}

function Header({ session, onAuth }: { session: Session | null; onAuth: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return <>
    <div className="announcement">Kamna public beta <b>·</b> Non-explicit AI artwork only</div>
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark"/><span className="brand-name">kamna</span></Link>
      <nav className="nav-links"><Link to="/">Explore</Link><Link to="/18-plus">18+ Fashion & Swimwear</Link><Link to="/rules">Community rules</Link><Link to="/report">Report / takedown</Link></nav>
      <div className="nav-right">
        {session ? <><Link to="/account">My account</Link><button className="button-quiet" onClick={() => { void supabase?.auth.signOut(); }}>Sign out</button></> : <button className="button-quiet" onClick={onAuth}>Sign in</button>}
        <Link className="upload-nav" to="/upload">Submit artwork <ArrowRight size={13}/></Link>
        <button id="mobile-menu-button" className="mobile-menu-button" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-nav" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X size={18} aria-hidden="true"/> : <Menu size={18} aria-hidden="true"/>}</button>
      </div>
      <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation" hidden={!menuOpen} onKeyDown={event => { if (event.key === 'Escape') { closeMenu(); document.getElementById('mobile-menu-button')?.focus(); } }}>
        <Link to="/" onClick={closeMenu}>Explore</Link>
        <Link to="/18-plus" onClick={closeMenu}>18+ Fashion & Swimwear</Link>
        <Link to="/rules" onClick={closeMenu}>Community rules</Link>
        <Link to="/report" onClick={closeMenu}>Report / takedown</Link>
        {session ? <><Link to="/account" onClick={closeMenu}>My account</Link><button className="mobile-nav-action" type="button" onClick={() => { void supabase?.auth.signOut(); closeMenu(); }}>Sign out</button></> : <button className="mobile-nav-action" type="button" onClick={() => { closeMenu(); onAuth(); }}>Sign in</button>}
        <Link to="/upload" onClick={closeMenu}>Submit artwork</Link>
      </nav>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer"><div><div className="footer-brand"><span className="brand-mark"/>kamna</div><p className="footer-note">A moderated beta for AI-generated artwork. Submissions are reviewed before they can appear publicly.</p></div><nav className="footer-links"><Link to="/rules">Community rules</Link><Link to="/privacy">Privacy notice</Link><Link to="/terms">Terms & download rights</Link><Link to="/report">Report / takedown</Link><Link to="/signin">Sign in</Link></nav></footer>;
}

function Setup() {
  return <div className="notice-banner" role="status"><strong>Account services are temporarily unavailable.</strong> Please try again later. No account has been created.</div>;
}

function Page({ title, children }: { title: string; children: ReactNode }) {
  return <main className="main-content"><div className="page-intro"><div className="eyebrow">Kamna · non-explicit beta</div><h1>{title}</h1></div>{children}</main>;
}

function passwordStrength(password: string): string {
  if (!password) return '';
  if (password.length < 12) return 'Use at least 12 characters for a stronger passphrase.';
  if (password.length < 15) return 'Good length. A longer passphrase is stronger.';
  return 'Strong passphrase length.';
}

const AUTH_NOTICE_KEY = 'kamna.auth.notice';
const AUTH_CHANNEL = 'kamna-auth-events';

function publishAuthNotice(message: string) {
  if (typeof window === 'undefined') return;
  const payload = JSON.stringify({ message, at: Date.now() });
  window.localStorage.setItem(AUTH_NOTICE_KEY, payload);
  window.dispatchEvent(new CustomEvent('kamna-auth-notice', { detail: payload }));
  try {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage(payload);
    channel.close();
  } catch {
    // BroadcastChannel is optional; Supabase's session storage event remains the fallback.
  }
}

function SignIn({ onClose }: { onClose?: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [resending, setResending] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const onCloseRef = useRef(onClose);
  const fieldPrefix = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let active = true;
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
    const recoveryRequested = searchParams.get('mode') === 'reset' || hashParams.get('type') === 'recovery';
    if (recoveryRequested) setMode('reset');
    if (searchParams.get('confirmed') === '1') setMessage('Confirmation link opened. We are checking your account session.');
    if (searchParams.get('updated') === '1') setMessage('Password update completed. We are checking your account session.');
    async function completeConfirmation() {
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const tokenType = searchParams.get('type') as EmailOtpType | null;
      const redirectError = searchParams.get('error_description') || searchParams.get('error');
      if (redirectError) {
        setMessage(redirectError.replace(/\+/g, ' '));
        return;
      }
      if (!code && !(tokenHash && (tokenType === 'email' || tokenType === 'signup' || tokenType === 'recovery'))) return;
      setBusy(true);
      try {
        const result = code
          ? await client!.auth.exchangeCodeForSession(code)
          : await client!.auth.verifyOtp({ token_hash: tokenHash!, type: tokenType! });
        const { data, error } = result;
        if (!active) return;
        if (error) {
          setMessage(errorMessage(error, 'The confirmation link is invalid or has expired. Request a new confirmation email.'));
          setShowResend(true);
        } else if (data.session) {
          if (recoveryRequested) {
            setMode('reset');
            setMessage('Password reset link verified. Choose a new password below.');
            publishAuthNotice('Password reset link verified. Choose a new password in the open Kamna tab.');
            navigate('/signin?mode=reset', { replace: true });
          } else {
            setMessage('Email confirmed. You are signed in.');
            publishAuthNotice('Email confirmed. Your Kamna account is ready.');
            onCloseRef.current?.();
            navigate('/account', { replace: true });
          }
        }
      } catch (error) {
        if (active) {
          setMessage(errorMessage(error, 'We could not verify this link. Request a new email and try again.'));
          setShowResend(true);
        }
      } finally {
        if (active) setBusy(false);
      }
    }
    void completeConfirmation();
    return () => { active = false; };
  }, [navigate]);

  function switchMode(next: 'signin' | 'signup' | 'forgot' | 'reset') {
    setMode(next);
    setMessage('');
    setShowResend(false);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  async function resendConfirmation() {
    if (!supabase || !email.trim()) {
      setMessage('Enter the same email address used for signup first.');
      return;
    }
    setResending(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: `${location.origin}/signin?confirmed=1` } });
      if (error) throw error;
      setMessage('If this account needs confirmation, a new email was requested. Check Inbox and Spam.');
      setShowResend(false);
    } catch (error) {
      setMessage(errorMessage(error, 'Could not resend the confirmation email. Please wait and try again.'));
    } finally { setResending(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setMessage('Account services are temporarily unavailable. Please try again later.'); return; }
    setBusy(true);
    setMessage('');
    try {
      if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${location.origin}/signin?mode=reset` });
        if (error) throw error;
        setMessage('If an account uses this email, a password-reset link was requested. Check Inbox and Spam.');
        setMode('signin');
      } else if (mode === 'reset') {
        if (password !== confirmPassword) { setMessage('Passwords do not match.'); return; }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        const successMessage = 'Password updated successfully. Your open Kamna tab is now up to date.';
        setMessage(successMessage);
        publishAuthNotice(successMessage);
        onCloseRef.current?.();
        navigate('/account?updated=1', { replace: true });
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${location.origin}/signin?confirmed=1` } });
        if (error) throw error;
        const hasNewIdentity = Boolean(data.user?.identities?.length);
        setShowResend(!data.session && hasNewIdentity);
        if (data.session) {
          setMessage('Welcome to Kamna. Your account is ready and you are signed in.');
        } else if (hasNewIdentity) {
          setMessage('Welcome to Kamna. We sent a confirmation link to your email. Open it to finish setting up your account, then you will be signed in automatically.');
        } else {
          setMessage('This email may already have a Kamna account. Please sign in, or use Forgot password if you need a new password.');
        }
        if (data.session) { publishAuthNotice('Account created. You are signed in.'); onCloseRef.current?.(); navigate('/account'); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          const code = (error as { code?: string }).code;
          setShowResend(code === 'email_not_confirmed' || /confirm|verify|not active/i.test(error.message));
          throw error;
        }
        onCloseRef.current?.();
        navigate('/account');
      }
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to complete account request.'));
    } finally { setBusy(false); }
  }

  const title = mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create an account' : mode === 'forgot' ? 'Reset your password' : 'Choose a new password';
  const needsPassword = mode === 'signin' || mode === 'signup' || mode === 'reset';
  const storyTitle = mode === 'reset' ? 'A fresh key for your creative space.' : mode === 'signup' ? 'Make your mark in the archive.' : 'Your place in the archive.';
  const storyCopy = mode === 'reset' ? 'Your reset link is verified. Choose a new passphrase and return to your submissions.' : 'A considered home for AI-generated work, with human review before anything becomes public.';
  return <div className="auth-page"><div className="auth-shell">
    <aside className="auth-story"><div className="auth-story-top"><span className="auth-wordmark"><span className="brand-mark"/>kamna</span><span className="auth-live"><span/>SECURE ACCESS</span></div><div className="auth-story-body"><span className="auth-kicker">KAMNA / ACCOUNT {mode === 'reset' ? '· RECOVERY' : '· 01'}</span><h1>{storyTitle}</h1><p>{storyCopy}</p><div className="auth-proof"><div><strong>01</strong><span>Human-reviewed<br/>before public display</span></div><div><strong>02</strong><span>Private by default<br/>from first upload</span></div></div><div className="auth-steps"><span className={mode === 'signin' ? 'active' : ''}>Access</span><i/><span className={mode === 'signup' ? 'active' : ''}>Create</span><i/><span className={mode === 'reset' ? 'active' : ''}>Recover</span></div></div><div className="auth-story-foot"><ShieldCheck size={14}/><span>Non-explicit AI artwork only · 18+ collection closed</span></div></aside>
    <section className="auth-panel" aria-labelledby="auth-title"><div className="auth-panel-top"><span className="auth-panel-kicker">{mode === 'reset' ? 'RECOVERY / VERIFIED LINK' : mode === 'forgot' ? 'ACCOUNT / RECOVERY' : 'WELCOME TO KAMNA'}</span><span className="auth-index">{mode === 'reset' ? '04' : mode === 'forgot' ? '03' : mode === 'signup' ? '02' : '01'} / 04</span></div><div className="auth-panel-head"><h2 id="auth-title">{title}</h2><p>{mode === 'forgot' ? 'Enter your email and we will send a secure reset link. The same response is shown whether or not an account exists.' : mode === 'reset' ? 'Choose a new password for your Kamna account.' : 'Use email and password. New accounts require email confirmation.'}</p></div>
      {!supabaseConfigured && <Setup/>}
      <form onSubmit={submit}>
        <div className="field"><label htmlFor={`${fieldPrefix}-email`}>Email address</label><input id={`${fieldPrefix}-email`} type="email" required={mode !== 'reset'} autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)}/></div>
        {needsPassword && <div className="field"><div className="auth-label-row"><label htmlFor={`${fieldPrefix}-password`}>{mode === 'reset' ? 'New password' : 'Password'}</label>{mode === 'signin' && <button type="button" className="auth-inline-link" onClick={() => switchMode('forgot')}>Forgot password?</button>}</div><div className="auth-password-wrap"><input id={`${fieldPrefix}-password`} type={showPassword ? 'text' : 'password'} required minLength={mode === 'signin' ? 1 : 12} maxLength={128} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder={mode === 'signin' ? 'Enter your password' : '12+ character passphrase'} value={password} onChange={event => setPassword(event.target.value)}/><button type="button" className="auth-show-button" onClick={() => setShowPassword(value => !value)} aria-pressed={showPassword}>{showPassword ? 'Hide' : 'Show'}</button></div>{mode !== 'signin' && password && <small className="auth-helper">{passwordStrength(password)}</small>}</div>}
        {mode === 'reset' && <div className="field"><label htmlFor={`${fieldPrefix}-confirm-password`}>Confirm new password</label><div className="auth-password-wrap"><input id={`${fieldPrefix}-confirm-password`} type={showConfirmPassword ? 'text' : 'password'} required minLength={12} maxLength={128} autoComplete="new-password" placeholder="Repeat your new password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}/><button type="button" className="auth-show-button" onClick={() => setShowConfirmPassword(value => !value)} aria-pressed={showConfirmPassword}>{showConfirmPassword ? 'Hide' : 'Show'}</button></div></div>}
        {message && <p role="status" className="auth-message">{message}</p>}
        {showResend && <button type="button" className="button-secondary auth-secondary-button" disabled={resending || busy} onClick={() => void resendConfirmation()}>{resending ? 'Sending…' : 'Resend confirmation email'}</button>}
        <button className="button-primary auth-submit" disabled={busy || !supabase}>{busy ? 'Please wait…' : mode === 'signin' ? 'Continue to Kamna' : mode === 'signup' ? 'Create your account' : mode === 'forgot' ? 'Send secure reset link' : 'Update password'}</button>
      </form>
      <div className="auth-switches">{mode === 'signin' && <button className="button-quiet" onClick={() => switchMode('signup')}>New to Kamna? <u>Create an account</u></button>}{mode === 'signup' && <button className="button-quiet" onClick={() => switchMode('signin')}>Already registered? <u>Sign in</u></button>}{mode === 'forgot' && <button className="button-quiet" onClick={() => switchMode('signin')}>Remembered your password? <u>Back to sign in</u></button>}</div><p className="auth-panel-foot"><ShieldCheck size={13}/> Your account remains private until you choose to submit work.</p>
    </section>
  </div></div>;
}

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Artwork[]>([]); const [offset, setOffset] = useState(0); const [next, setNext] = useState<number|null>(null);
  const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const search=searchParams.get('q')||'', tag=searchParams.get('tag')||'', category=searchParams.get('category')||'', style=searchParams.get('style')||'';
  const [draftSearch, setDraftSearch] = useState(search);
  const searchId = useId();
  const requestId = useRef(0);
  useEffect(() => { setDraftSearch(search); }, [search]);
  const load = useCallback(async (reset: boolean) => {
    const request = ++requestId.current;
    setLoading(true);
    setError('');
    if (reset) { setItems([]); setOffset(0); setNext(null); }
    try {
      const params = new URLSearchParams({ offset: String(reset ? 0 : offset), limit: '24', rating: 'general' });
      if (search) params.set('search', search);
      if (tag) params.set('tag', tag);
      if (category) params.set('category', category);
      if (style) params.set('style', style);
      const result = await api<{ items: Artwork[]; total: number; offset: number; limit: number }>(`gallery?${params}`);
      if (request !== requestId.current) return;
      setItems(current => reset ? result.items : [...current, ...result.items]);
      const loaded = result.offset + result.items.length;
      setOffset(loaded);
      setNext(loaded < result.total ? loaded : null);
    } catch {
      if (request === requestId.current) setError('load-failed');
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [search, tag, category, style, offset]);
  useEffect(()=>{void load(true);},[search,tag,category,style]);
  function setParam(k:string,v:string){const p=new URLSearchParams(searchParams);if(v)p.set(k,v);else p.delete(k);if(k==='category')p.delete('style');setSearchParams(p);}
  function scrollTo(id: string) {
    const target = document.getElementById(id);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }
  function chooseCategory(id: string) {
    setParam('category', category === id ? '' : id);
    window.requestAnimationFrame(() => scrollTo('gallery'));
  }
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setParam('q', draftSearch.trim());
    window.requestAnimationFrame(() => scrollTo('gallery'));
  }
  function clearFilters() {
    setDraftSearch('');
    setSearchParams({});
  }
  const hasFilters = Boolean(search || tag || category || style);
  return <main className="main-content">
    <section className="hero hero-compact" aria-labelledby="home-heading">
      <div className="eyebrow">A considered art space</div>
      <h1 id="home-heading">Art beyond the <em>ordinary.</em></h1>
      <p className="hero-copy">Discover AI-generated work across nine thoughtful collections. Every public artwork is reviewed before it appears.</p>
      <form className="home-search" role="search" onSubmit={submitSearch}>
        <Search size={18} aria-hidden="true"/>
        <label className="sr-only" htmlFor={searchId}>Search approved artwork, creators, or tags</label>
        <input id={searchId} type="search" maxLength={120} autoComplete="off" value={draftSearch} onChange={event => setDraftSearch(event.target.value)} placeholder="Search artwork, creators, or tags"/>
        <button className="home-search-submit" type="submit">Search <ArrowRight size={14}/></button>
      </form>
      <div className="hero-actions"><Link className="button-primary" to="/upload">Submit AI artwork <ArrowRight size={14}/></Link><span className="hero-note"><ShieldCheck size={13}/> Human review before public display</span></div>
    </section>
    <Rules/>
    <section className="category-discovery" id="collections" aria-labelledby="collections-heading">
      <div className="section-head category-section-head"><div><div className="section-kicker">Browse by collection</div><h2 id="collections-heading">Find your visual language.</h2></div><button type="button" className="all-categories-button" aria-pressed={!category && !style} onClick={() => setParam('category', '')}>All general art</button></div>
      <div className="category-grid" role="group" aria-label="Nine general-audience collections">
        {categories.map((collection, index) => {
          const Icon = categoryIcons[collection.id as keyof typeof categoryIcons];
          return <button type="button" key={collection.id} className={`category-tile${category === collection.id ? ' is-active' : ''}`} aria-pressed={category === collection.id} onClick={() => chooseCategory(collection.id)}>
            <span className="category-tile-top"><Icon size={19} strokeWidth={1.6} aria-hidden="true"/><span className="category-index">{String(index + 1).padStart(2, '0')}</span></span>
            <span className="category-label">{collection.label}</span>
          </button>;
        })}
      </div>
      <p className="helper-note">Indian Folk & Traditional works are AI-inspired interpretations, not traditional or community-created works. Each tradition is named distinctly and respectfully.</p>
      {category === 'indian-folk-traditional' && <div className="style-chips" aria-label="Indian tradition filters">{indianStyles.map(item => <button type="button" key={item.id} className={style === item.id ? 'filter-chip active' : 'filter-chip'} aria-pressed={style === item.id} onClick={() => setParam('style', style === item.id ? '' : item.id)}>{item.label}</button>)}</div>}
    </section>
    <section className="featured-collection" aria-labelledby="featured-title">
      <div className="featured-collection-icon" aria-hidden="true"><Flower2 size={28} strokeWidth={1.3}/></div>
      <div className="featured-collection-copy"><div className="section-kicker">Featured collection · AI-inspired</div><h2 id="featured-title">Indian Folk & Traditional</h2><p>Explore distinct visual traditions through AI-generated interpretations—not traditional or community-created artwork.</p></div>
      <button type="button" className="button-secondary featured-collection-action" onClick={() => chooseCategory('indian-folk-traditional')}>Explore collection <ArrowRight size={14}/></button>
    </section>
    <section id="gallery" className="latest-section" aria-labelledby="latest-heading">
      <div className="section-head"><div><div className="section-kicker">Latest · General audience</div><h2 id="latest-heading">Latest approved works</h2><p>Only human-reviewed general-audience works appear here.</p></div>{category && <span className="current-filter">{categoryLabel(category)}</span>}</div>
      <div className="filters"><label className="search-field"><span>Tag</span><input aria-label="Filter approved works by tag" value={tag} onChange={event => setParam('tag', event.target.value)} placeholder="Any tag"/></label>{tag && <button type="button" className="filter-reset" onClick={() => setParam('tag', '')}>Clear tag</button>}<span className="sort-select">Latest first</span></div>
      {error && items.length > 0 && <div className="gallery-alert" role="alert">Some additional works could not be loaded. <button type="button" className="button-quiet" onClick={() => void load(false)}>Try again</button></div>}
      {loading && !items.length ? <div className="gallery-loading" role="status"><span className="sr-only">Loading approved artwork</span><div className="artwork-grid skeleton-grid" aria-hidden="true">{Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-media"/><div className="skeleton-line"/><div className="skeleton-line short"/></div>)}</div></div>
        : error && !items.length ? <div className="empty-state" role="alert"><div className="empty-state-icon"><ShieldCheck size={22}/></div><div className="section-kicker">A temporary pause</div><h3>We couldn’t load the latest works.</h3><p>Please try again in a moment. Your search and collection choices will stay here.</p><button type="button" className="button-secondary" onClick={() => void load(true)}>Try again</button></div>
        : items.length ? <><div className="artwork-grid">{items.map(art => <article className="artwork-card" key={art.id}><Link className={art.sensitive ? 'artwork-image sensitive-preview' : 'artwork-image'} to={`/artwork/${art.id}`}>{art.image_url ? <img src={art.image_url} alt={art.title} loading="lazy"/> : <span className="image-unavailable">Preview unavailable</span>}{art.sensitive && <span className="sensitive-cover"><span>Sensitive preview · AI-generated</span><small>Open to view</small></span>}<span className="artwork-tag">AI-generated · General</span></Link><div className="card-meta"><div><Link to={`/artwork/${art.id}`} className="card-title">{art.title}</Link><div className="card-creator">by <Link to={`/profile/${art.handle}`}>{art.creator_name}</Link></div></div></div><div className="card-tags">{art.category && <span className="tag">{categoryLabel(art.category)}</span>}{art.style && <span className="tag">{styleLabel(art.style)}</span>}{art.tags?.map(item => <button type="button" className="tag" key={item} onClick={() => setParam('tag', item)}>#{item}</button>)}</div></article>)}</div>{next !== null && <div className="load-more"><button className="button-secondary" disabled={loading} onClick={() => void load(false)}>Load more</button></div>}</>
          : <div className="empty-state" role="status"><div className="empty-state-icon"><Palette size={22}/></div><div className="section-kicker">{hasFilters ? 'A fresh search' : 'A gallery in the making'}</div><h3>{hasFilters ? 'No approved works match those filters yet.' : 'The first approved works will appear here.'}</h3><p>{hasFilters ? 'Try another collection or clear your filters to see all current work.' : 'Submissions are reviewed before they are shared. Browse the nine collections while the gallery grows.'}</p>{hasFilters ? <button type="button" className="button-secondary" onClick={clearFilters}>Clear filters</button> : <button type="button" className="button-secondary" onClick={() => scrollTo('collections')}>Browse all nine collections</button>}</div>}
    </section>
  </main>;
}

function AdultGallery({session}:{session:Session|null}){
 const [attested,setAttested]=useState(false);const [items,setItems]=useState<Artwork[]>([]);const [configured,setConfigured]=useState(false);const [featureEnabled,setFeatureEnabled]=useState(false);const [checked,setChecked]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{api<{configured:boolean}>('adult/status').then(r=>setFeatureEnabled(r.configured===true)).catch(()=>setFeatureEnabled(false));},[]);
 async function unlock(){if(!session){setError('Sign in with a confirmed account before continuing.');return;}if(!featureEnabled){setError('This collection is not open in the public beta.');return;}try{await api('adult/attest',{method:'POST',body:JSON.stringify({confirm:true})});const r=await api<{items:Artwork[];configured?:boolean}>('gallery?rating=adult&offset=0&limit=24');if(r.configured===true){setAttested(true);setConfigured(true);setItems(r.items);}else setConfigured(false);}catch(e){setError(errorMessage(e,'The 18+ collection is unavailable in this beta.'));setConfigured(false);}finally{setChecked(true);}}
 return <Page title="18+ Fashion & Swimwear"><section className="adult-gate"><div className="rating-badge">18+ · ADULT AUDIENCE</div><h2>Separate, self-attested collection</h2><p>This space is limited to fictional, clearly adult-looking subjects in non-nude fashion and opaque swimwear.</p><p><strong>Self-attestation is not identity verification or reliable age verification.</strong> Do not continue unless you are an adult under the rules where you live.</p><p>{adultRules}</p>{!featureEnabled&&<p role="status">This collection is not open in the public beta.</p>}{!session&&<p>A signed-in account is required. <Link to="/signin">Sign in</Link>.</p>}{!attested&&<label className="check-row"><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/>I attest that I am an adult and want to continue.</label>} {!attested&&<button className="button-primary" disabled={!checked||!session||!featureEnabled} onClick={()=>void unlock()}>Continue to 18+ collection</button>}{error&&<p role="alert" className="notice-banner">{error}</p>}{attested&&!configured&&<div className="notice-banner" role="status">{checked?'This collection is not open in the public beta.':'Checking availability…'}</div>}</section>{configured&&<><div className="safety-strip">18+ · Adult audience · {adultRules}</div>{items.length?<div className="artwork-grid">{items.map(art=><article className="artwork-card" key={art.id}><Link className={art.sensitive ? 'artwork-image sensitive-preview' : 'artwork-image'} to={`/artwork/${art.id}`}><img src={art.image_url||''} alt={art.title}/>{art.sensitive&&<span className="sensitive-cover"><span>Sensitive preview · AI-generated · 18+</span><small>Open to view</small></span>}<span className="artwork-tag">AI-generated · 18+</span></Link><Link className="card-title" to={`/artwork/${art.id}`}>{art.title}</Link></article>)}</div>:<div className="empty-results">No approved works are currently listed.</div>}</>}</Page>
}

function Detail() {
  const { id = '' } = useParams();
  const [art, setArt] = useState<Artwork | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  useEffect(() => {
    setLoading(true);
    setError('');
    api<Artwork>(`artworks/${encodeURIComponent(id)}`).then(setArt).catch(error => setError(errorMessage(error, 'Unable to load this artwork.'))).finally(() => setLoading(false));
  }, [id]);
  async function downloadArtwork() {
    setDownloading(true);
    try {
      const result = await api<{ url: string; filename: string }>(`artworks/${encodeURIComponent(id)}/download`);
      window.location.assign(result.url);
    } catch (downloadError) {
      setError(errorMessage(downloadError, 'Unable to create a download link. Please try again.'));
    } finally { setDownloading(false); }
  }
  return <Page title={art?.title || 'Artwork'}>{error ? <div className="notice-banner" role="alert">{error}</div> : art ? <div className="detail-layout">
    {art.image_url && <img className="detail-image" src={art.image_url} alt={art.title}/>}
    <section className="detail-panel"><div className="section-kicker">Approved · AI-generated</div><div className="rating-badge">{art.audience_rating === 'adult' ? '18+ · Adult audience' : 'General audience'}</div><h1>{art.title}</h1><div className="byline">By <Link to={`/profile/${art.handle}`}><u>{art.creator_name}</u></Link></div><p className="description">{art.description || ''}</p>
      <div className="card-tags">{art.category && <span className="tag">{categoryLabel(art.category)}</span>}{art.style && <span className="tag">{styleLabel(art.style)}</span>}{art.tags?.map(item => <Link className="tag" to={`/?tag=${encodeURIComponent(item)}`} key={item}>#{item}</Link>)}</div>
      <dl className="meta-list"><div><dt>Kamna artwork / provenance ID</dt><dd>{art.provenance_id || art.id}</dd></div><div><dt>Model / tool</dt><dd>{[art.ai_model, art.ai_tool].filter(Boolean).join(' / ') || 'Not specified'}</dd></div>{art.created_at && <div><dt>Published</dt><dd>{new Date(art.created_at).toLocaleDateString()}</dd></div>}</dl>
      <p className="notice-small">Images are served from private storage using short-lived links. Free download does not transfer copyright; ask the creator before reuse. The download filename includes this Kamna provenance ID.</p>
      <div className="hero-actions"><button className="button-primary" disabled={downloading} onClick={() => void downloadArtwork()}>{downloading ? 'Preparing download…' : 'Download artwork · Free'}</button><Link className="button-secondary" to={`/report?artworkId=${encodeURIComponent(art.id)}`}>Report / request takedown</Link></div>
    </section>
  </div> : <p role="status" className="empty-results">{loading ? 'Loading artwork…' : 'Artwork not found.'}</p>}</Page>;
}

function Upload({ session }: { session: Session | null }) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [style, setStyle] = useState('');
  const [audienceRating, setAudienceRating] = useState<'general'|'adult'>('general');
  const [tool, setTool] = useState('');
  const [model, setModel] = useState('');
  const [prompt, setPrompt] = useState('');
  const [sensitive, setSensitive] = useState(false);
  const [rights, setRights] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [policyConfirmed, setPolicyConfirmed] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [adultConfigured, setAdultConfigured] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const tagValues = tags.split(',').map(value => value.trim()).filter(Boolean);
  const invalidTags = tagValues.length > 8 || tagValues.some(value => value.length > 30);
  useEffect(() => { api<{configured?:boolean}>('gallery?rating=adult&offset=0&limit=1').then(r => setAdultConfigured(r.configured === true)).catch(() => setAdultConfigured(false)); }, []);
  useEffect(() => {
    if (!file) { setPreviewUrl(''); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!session) { setMessage('Sign in with a confirmed account before submitting artwork.'); return; }
    if (invalidTags) { setMessage('Use at most 8 tags, each no longer than 30 characters.'); return; }
    if (!file || !rights || !confirmed || !policyConfirmed || (audienceRating === 'adult' && !adultConfigured)) return;
    setBusy(true);
    setMessage('');
    try {
      const form = new FormData(); form.append('file', file); form.append('title', title); form.append('description', description); form.append('tags', JSON.stringify(tagValues)); form.append('category', audienceRating === 'adult' ? 'adult-fashion-swimwear' : category); form.append('style', style || 'other'); form.append('rating', audienceRating); form.append('model', model); form.append('tool', tool); form.append('prompt', prompt); form.append('sensitive', String(sensitive)); form.append('rightsConfirmed', String(rights)); form.append('aiGenerated', 'true'); form.append('aiDisclosureConfirmed', String(confirmed)); form.append('contentPolicyConfirmed', String(policyConfirmed));
      const result = await api<{ artwork: Artwork }>('uploads', { method: 'POST', body: form });
      setMessage(`Submission received with status “${result.artwork.status || 'pending'}”. It will not appear publicly unless approved by a moderator.`);
    } catch (error) { setMessage(errorMessage(error, 'Unable to submit. Please try again.')); }
    finally { setBusy(false); }
  }
  const invalidFile = Boolean(file && (file.size > 8 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)));
  return <Page title="Submit a new work"><Rules/>{!supabaseConfigured && <Setup/>}<div className="upload-layout"><form className="form-card" onSubmit={submit}>
    <h2>Artwork details</h2>{!session && <div className="notice-banner">A confirmed sign-in is required. <Link to="/signin"><u>Sign in or create an account</u></Link>.</div>}
    <label className="file-drop"><input aria-label="Artwork image file" type="file" accept="image/jpeg,image/png,image/webp" required onChange={event => setFile(event.target.files?.[0] || null)}/><UploadCloud size={22}/><strong>{file?.name || 'Select a JPG, PNG, or WebP image'}</strong><small>Maximum 8 MiB. Nude or sexual uploads are not permitted.</small></label>
    {previewUrl && <img className="upload-preview" src={previewUrl} alt={file ? `Local preview of ${file.name}` : 'Selected artwork preview'}/>}
    {invalidFile && <p role="alert">Choose JPG, PNG, or WebP up to 8 MiB.</p>}
    <div className="field"><label htmlFor="title">Title</label><input id="title" required maxLength={80} value={title} onChange={event => setTitle(event.target.value)}/></div>
    <div className="field"><label htmlFor="description">Description</label><textarea id="description" maxLength={600} value={description} onChange={event => setDescription(event.target.value)}/></div>
    <div className="field"><label htmlFor="category">Category</label><select id="category" value={category} onChange={e=>setCategory(e.target.value)}>{categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
    {category === 'indian-folk-traditional' && <div className="field"><label htmlFor="style">Tradition / style (distinct labels)</label><select id="style" value={style} onChange={e=>setStyle(e.target.value)}><option value="">Choose a style</option>{indianStyles.map(x=><option key={x.id} value={x.id}>{x.label}</option>)}</select><small>AI-inspired interpretation only; not traditional or community-created work.</small></div>}
    <div className="field"><label htmlFor="rating">Audience rating</label><select id="rating" value={audienceRating} onChange={e=>setAudienceRating(e.target.value as 'general'|'adult')}><option value="general">General audience</option>{adultConfigured&&<option value="adult">18+ Fashion & Swimwear</option>}</select>{!adultConfigured&&<small>18+ submissions are unavailable while this collection remains closed.</small>}</div>
    <div className="field"><label htmlFor="tags">Tags (comma-separated, up to 8; 30 characters each)</label><input id="tags" maxLength={247} value={tags} onChange={event => setTags(event.target.value)}/>{invalidTags && <small role="alert">Use at most 8 tags, each no longer than 30 characters.</small>}</div>
    <div className="field"><label htmlFor="model">AI model</label><input id="model" maxLength={100} value={model} onChange={event => setModel(event.target.value)}/></div>
    <div className="field"><label htmlFor="tool">AI tool</label><input id="tool" maxLength={100} value={tool} onChange={event => setTool(event.target.value)}/></div>
    <div className="field"><label htmlFor="prompt">Prompt / process note</label><textarea id="prompt" maxLength={1000} value={prompt} onChange={event => setPrompt(event.target.value)}/></div>
    <label className="check-row"><input type="checkbox" checked={sensitive} onChange={event => setSensitive(event.target.checked)}/>Mark thumbnail sensitive</label>
    <label className="check-row"><input type="checkbox" checked={rights} onChange={event => setRights(event.target.checked)} required/>I own this work or hold rights to publish it.</label>
    <label className="check-row"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} required/>I explicitly confirm this image is AI-generated.</label>
    <label className="check-row"><input type="checkbox" checked={policyConfirmed} onChange={event => setPolicyConfirmed(event.target.checked)} required/>I confirm this upload follows the content rules above.</label>
    {message && <p role="status" className="notice-banner">{message}</p>}
    <button className="button-primary" disabled={busy || !session || !supabaseConfigured || invalidFile || invalidTags}>{busy ? 'Submitting…' : 'Upload for review'}</button>
  </form><aside className="side-card"><h2>Private review first</h2><p>Images are submitted securely for private review and remain pending. Uploads are never published instantly.</p><p>{rules}</p></aside></div></Page>;
}

function Account() {
  const [items, setItems] = useState<Artwork[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const reload = useCallback(async () => {
    setError('');
    try { const response = await api<{ items: Artwork[] }>('account/artworks'); setItems(response.items); }
    catch (error) {
      setError(error instanceof ApiError && error.status === 503
        ? 'Your sign-in is working, but the account data service is temporarily unavailable. Please retry after the site administrator completes the production server configuration.'
        : errorMessage(error, 'Unable to load your artwork.'));
    }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void reload(); }, [reload]);
  async function remove(art: Artwork) {
    const confirmed = window.confirm(`Remove “${art.title}” from Kamna? This takes effect immediately, unpublishes the artwork, and deletes its stored image object. This cannot be undone.`);
    if (!confirmed) return;
    try {
      await api('account/remove', { method: 'POST', body: JSON.stringify({ artworkId: art.id }) });
      setItems(previous => previous.filter(item => item.id !== art.id));
      setMessage('Artwork removed. It is no longer published and its stored image object has been deleted.');
    } catch (error) { setError(errorMessage(error, 'Could not remove artwork.')); }
  }
  return <Page title="My submissions">{message && <p role="status" className="notice-banner">{message}</p>}{error && <p role="alert" className="notice-banner">{error}<button className="button-quiet" onClick={() => void reload()}>Retry</button></p>}
    {loading ? <p role="status" className="empty-results">Loading your submissions…</p> : items.length ? <div className="moderation-list">{items.map(art => <div className="moderation-item" key={art.id}>{art.image_url && <img className="moderator-preview" src={art.image_url} alt={`Preview of ${art.title}`}/>}<div><strong>{art.title}</strong><br/><small>Status: {art.status || 'pending review'}</small></div><button className="button-secondary" onClick={() => void remove(art)}>Remove my artwork</button></div>)}</div> : !error && <div className="empty-results">No submissions are available yet.</div>}
  </Page>;
}

function Profile() {
  const { handle = '' } = useParams();
  const [items, setItems] = useState<Artwork[]>([]);
  const [profile, setProfile] = useState<{ handle: string; display_name: string | null; bio: string | null } | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api<{ items: Artwork[] }>(`profiles/${encodeURIComponent(handle)}`).then(result => setItems(result.items)).catch(error => setError(errorMessage(error, 'Unable to load creator profile.')));
    getPublicProfile(handle).then(setProfile).catch(() => {});
  }, [handle]);
  return <main className="main-content"><div className="profile-head"><div className="avatar" aria-hidden="true">{(profile?.display_name || handle).slice(0, 1).toUpperCase()}</div><div><h1>{profile?.display_name || handle}</h1><p>@{handle} · Creator profile</p>{profile?.bio && <p>{profile.bio}</p>}</div></div>{error && <div className="notice-banner" role="alert">{error}</div>}<div className="section-head"><h2>Approved works</h2></div>{items.length ? <div className="artwork-grid">{items.map(art => <article className="artwork-card" key={art.id}><Link className={art.sensitive ? 'artwork-image sensitive-preview' : 'artwork-image'} to={`/artwork/${art.id}`}>{art.image_url && <img src={art.image_url} alt={art.title}/>}{art.sensitive&&<span className="sensitive-cover"><span>Sensitive preview · AI-generated</span><small>Open to view</small></span>}</Link><Link className="card-title" to={`/artwork/${art.id}`}>{art.title}</Link></article>)}</div> : <div className="empty-results">No approved works are currently listed for this creator.</div>}</main>;
}

function ReportPage() {
  const [searchParams] = useSearchParams();
  const [artworkId, setArtworkId] = useState(searchParams.get('artworkId') || '');
  const [type, setType] = useState<'content' | 'takedown'>('content');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  function extractArtworkId(value: string): string {
    const input = value.trim();
    try {
      const path = new URL(input, window.location.origin).pathname;
      return path.match(/\/artwork\/([^/]+)\/?$/i)?.[1] || input;
    } catch { return input; }
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage('');
    try {
      const receipt = await api<{ id: string; status: 'open' }>('reports', { method: 'POST', body: JSON.stringify({ artworkId: extractArtworkId(artworkId), category, details, contactEmail: email || undefined, type }) });
      setMessage(`Report submitted. Receipt: ${receipt.id}. Status: ${receipt.status}. Save this receipt to follow up; intake does not mean the artwork has been removed.`);
    } catch (error) { setMessage(errorMessage(error, 'Request could not be submitted.')); }
    finally { setBusy(false); }
  }
  return <Page title="Report or request takedown"><p className="hero-copy">This form is available without signing in. Provide an artwork ID or a full artwork link and a reason. Do not include sensitive information unless necessary.</p><form className="form-card report-form" onSubmit={submit}>
    <div className="field"><label htmlFor="artid">Artwork ID or artwork link</label><input id="artid" required maxLength={2048} value={artworkId} onChange={event => setArtworkId(event.target.value)} placeholder="Paste a Kamna artwork URL or ID"/></div>
    <div className="field"><label htmlFor="request-type">Request type</label><select id="request-type" value={type} onChange={event => setType(event.target.value as 'content' | 'takedown')}><option value="content">Content report</option><option value="takedown">Takedown / rights request</option></select></div>
    <div className="field"><label htmlFor="category">Category</label><select id="category" required value={category} onChange={event => setCategory(event.target.value)}><option value="">Choose a reason</option>{reportCategories.map(([slug, label]) => <option value={slug} key={slug}>{label}</option>)}</select></div>
    <div className="field"><label htmlFor="details">Details (optional)</label><textarea id="details" maxLength={2000} value={details} onChange={event => setDetails(event.target.value)}/></div>
    <p>For a report or takedown contact path, email <a href="mailto:sakhisehat09@gmail.com">sakhisehat09@gmail.com</a>. No response time is guaranteed.</p><div className="field"><label htmlFor="contact">Contact email (optional; kept private)</label><input id="contact" type="email" maxLength={254} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)}/></div>
    {message && <p role="status" className="notice-banner">{message}</p>}<button className="button-primary" disabled={busy}>{busy ? 'Sending…' : 'Submit request'}</button>
  </form></Page>;
}

function Admin() {
  const [data, setData] = useState<{ artworks: Artwork[]; reports: Report[] } | null>(null);
  const [error, setError] = useState('');
  const permissionMessage = 'Your account is not authorized to access the moderator queue. Sign in with an approved moderator account.';
  const reload = () => api<{ artworks: Artwork[]; reports: Report[] }>('admin/queue').then(value => { setData(value); setError(''); }).catch(error => setError(error instanceof ApiError && error.status === 403 ? permissionMessage : errorMessage(error, 'Unable to load moderator queue.')));
  useEffect(() => { void reload(); }, []);
  async function action(body: object) {
    const reason = window.prompt('Optional moderator reason:') || '';
    try { await api('admin/action', { method: 'POST', body: JSON.stringify({ ...body, reason }) }); await reload(); }
    catch (error) { setError(error instanceof ApiError && error.status === 403 ? permissionMessage : errorMessage(error, 'Moderator action failed.')); }
  }
  return <Page title="Moderator queue">{error && <div className="notice-banner" role="alert">{error}</div>}{!data && !error && <p role="status">Loading queue…</p>}{data && <>
    <h2>Artwork</h2><div className="moderation-list">{data.artworks.map(art => <div className="moderation-item" key={art.id}>{art.image_url && <img className="moderator-preview" src={art.image_url} alt={`Preview of ${art.title}`}/>}<div><strong>{art.title}</strong><br/><small>{art.creator_name} (@{art.handle}) · {art.status} · {art.audience_rating === 'adult' ? '18+' : 'General'} · AI-generated</small><p>{art.description}</p><p className="notice-small">{categoryLabel(art.category || '')}{art.style ? ` · ${styleLabel(art.style)}` : ''} · Provenance ID: {art.provenance_id || art.id}{art.ai_tool || art.ai_model ? ` · ${[art.ai_tool, art.ai_model].filter(Boolean).join(' / ')}` : ''}</p>{art.cleanup_status === 'pending' && <p role="status">Stored-image cleanup is pending.</p>}</div><div>{art.cleanup_status === 'pending' ? <button onClick={() => void action({ artworkId: art.id, action: 'retry_cleanup' })}>Retry cleanup</button> : art.status === 'pending' ? <><button onClick={() => void action({ artworkId: art.id, action: 'approve' })}>Approve</button> <button onClick={() => void action({ artworkId: art.id, action: 'reject' })}>Reject</button> <button onClick={() => void action({ artworkId: art.id, action: 'remove' })}>Remove</button></> : art.status === 'approved' && <button onClick={() => void action({ artworkId: art.id, action: 'remove' })}>Remove</button>}</div></div>)}</div>
    <h2>Reports</h2><div className="moderation-list">{data.reports.map(report => <div className="moderation-item" key={report.id}><div><strong>{report.category || 'Report'}</strong> · {report.status}<p>Artwork: {report.artwork_id || report.artworkId || 'Not specified'} · Type: {report.contact_type || report.type || 'Not specified'}</p><p>{report.details || 'No details provided.'}</p>{(report.contact_email || report.contactEmail) && <p>Contact: {report.contact_email || report.contactEmail}</p>}</div><div><button onClick={() => void action({ reportId: report.id, action: 'resolve' })}>Resolve</button> <button onClick={() => void action({ reportId: report.id, action: 'reject' })}>Reject</button></div></div>)}</div>
  </>}</Page>;
}

function RulesPage() {
  return <Page title="Community rules"><section className="content-card"><h2>Non-explicit AI art only</h2><p>{rules}</p><p>Every submission is private and pending review until approved by a moderator. Reporting sends an in-app request; successful receipt does not guarantee immediate removal.</p></section><Link to="/report" className="button-secondary">Report / request takedown</Link></Page>;
}

function PrivacyPage() {
  return <Page title="Privacy notice"><section className="content-card"><h2>What this beta stores</h2><p>When you register, Kamna uses your email address for Supabase Auth and creates a creator profile. When you submit artwork, it stores the image, title, description, tags, category, audience rating, AI tool/model/process details you provide, your AI-generation and rights confirmations, and moderation status.</p><p>Reports may include an artwork ID, reason, optional details and optional private contact email. To limit abuse, Kamna stores a keyed pseudonymous fingerprint derived from the edge-provided network address; the application does not put the raw address in the report record. Cloudflare and Supabase may process technical data under their own policies.</p><h2>Visibility and storage</h2><p>Pending submissions are not public. Approved general-audience works and creator profiles can be viewed publicly. Images are kept in a private Supabase Storage bucket and served with short-lived signed links. Moderation and takedown records are retained for platform safety and are not exposed in public gallery responses.</p><h2>Your choices</h2><p>You can remove your own artwork from your account. Account closure or data-access requests can be sent to the contact below; no automated account-deletion flow is currently provided. Do not submit information you do not have rights to share.</p><p>This is a beta privacy summary, not legal advice. Provider logs and retention are also subject to Cloudflare and Supabase policies.</p><p>Contact: <a href="mailto:sakhisehat09@gmail.com">sakhisehat09@gmail.com</a></p></section></Page>;
}

function TermsPage() {
  return <Page title="Terms & download rights"><section className="content-card"><h2>AI-generated works only</h2><p>Uploads must be AI-generated, lawful, and submitted by someone who has the rights or permission to publish them. Uploaders must disclose available tool/model information and confirm the content rules. Human review is required before public display; confirmation is not automated AI detection.</p><h2>Prohibited content</h2><p>Nudity, sexual acts, pornography or explicit sexual content; minors or ambiguous-age subjects; sexualized minors; non-consensual intimate imagery; real-person sexual deepfakes or unauthorized likenesses; deceptive impersonation; unlawful material; and work without publishing rights are prohibited. The 18+ fashion/swimwear collection, if enabled, is limited to fictional, clearly adult-looking subjects in non-explicit clothing and is not reliable age verification.</p><h2>Downloads and rights</h2><p>Approved artwork can be downloaded free for viewing. A free download does not transfer copyright or grant commercial, derivative, or republication rights. The creator retains applicable rights; ask the creator before reuse. Download filenames include a Kamna provenance ID where available. Do not remove or misrepresent AI-generated labels or provenance.</p><h2>Reports and removals</h2><p>Use the report/takedown form for content, copyright, or rights concerns. A receipt confirms intake only; it does not mean content has already been removed or that a response time is guaranteed. For urgent intimate-image or impersonation concerns, contact <a href="mailto:sakhisehat09@gmail.com">sakhisehat09@gmail.com</a>.</p><p>These beta terms are informational and have not been reviewed by a lawyer. They do not represent a claim of full legal compliance or provider approval.</p></section></Page>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [authModal, setAuthModal] = useState(false);
  const [authNotice, setAuthNotice] = useState('');
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    let alive = true;
    getSession().then(value => { if (alive) setSession(value); }).catch(() => {}).finally(() => { if (alive) setChecking(false); });
    const listener = supabase?.auth.onAuthStateChange((event, value) => {
      setSession(value);
      if (event === 'SIGNED_IN' && location.pathname === '/signin' && !location.search.includes('mode=reset')) {
        publishAuthNotice('Email confirmed. Your account is ready in this tab.');
        navigate('/account', { replace: true });
      }
      if (event === 'PASSWORD_RECOVERY' && location.pathname !== '/signin') {
        navigate('/signin?mode=reset', { replace: true });
      }
      if (event === 'USER_UPDATED') {
        publishAuthNotice('Password updated successfully. All open Kamna tabs are up to date.');
        if (location.pathname === '/signin') navigate('/account?updated=1', { replace: true });
      }
    });
    const receiveNotice = (raw: string) => {
      try {
        const payload = JSON.parse(raw) as { message?: string; at?: number };
        if (payload.message && (!payload.at || Date.now() - payload.at < 60_000)) {
          setAuthNotice(payload.message);
          window.setTimeout(() => setAuthNotice(current => current === payload.message ? '' : current), 6500);
        }
      } catch {
        // Ignore malformed cross-tab notices.
      }
    };
    const onStorage = (event: StorageEvent) => { if (event.key === AUTH_NOTICE_KEY && event.newValue) receiveNotice(event.newValue); };
    const onCustomNotice = (event: Event) => { const detail = (event as CustomEvent<string>).detail; if (detail) receiveNotice(detail); };
    window.addEventListener('storage', onStorage);
    window.addEventListener('kamna-auth-notice', onCustomNotice);
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel(AUTH_CHANNEL);
      channel.onmessage = event => { if (typeof event.data === 'string') receiveNotice(event.data); };
    } catch {
      // Storage and Supabase session events still provide same-browser fallback.
    }
    return () => { alive = false; listener?.data.subscription.unsubscribe(); window.removeEventListener('storage', onStorage); window.removeEventListener('kamna-auth-notice', onCustomNotice); channel?.close(); };
  }, [location.pathname, location.search, navigate]);
  return <div className="site-shell"><Header session={session} onAuth={() => setAuthModal(true)}/>{authNotice && <div className="auth-event-notice" role="status">{authNotice}</div>}{checking ? <main className="main-content"><p role="status" className="empty-results">Checking account session…</p></main> : <Routes>
    <Route path="/" element={<Gallery/>}/><Route path="/18-plus" element={<AdultGallery session={session}/>}/><Route path="/artwork/:id" element={<Detail/>}/><Route path="/signin" element={<SignIn/>}/><Route path="/upload" element={<Upload session={session}/>}/><Route path="/account" element={session ? <Account/> : <SignIn/>}/><Route path="/profile/:handle" element={<Profile/>}/><Route path="/report" element={<ReportPage/>}/><Route path="/moderation" element={<Admin/>}/><Route path="/rules" element={<RulesPage/>}/><Route path="/privacy" element={<PrivacyPage/>}/><Route path="/terms" element={<TermsPage/>}/><Route path="*" element={<Page title="Page not found"><Link to="/" className="button-secondary">Return to gallery</Link></Page>}/>
  </Routes>}
  <Footer/>{authModal && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setAuthModal(false); }}><div className="modal" role="dialog" aria-modal="true" aria-label="Sign in"><button className="modal-close" onClick={() => setAuthModal(false)} aria-label="Close">×</button><SignIn onClose={() => setAuthModal(false)}/></div></div>}</div>;
}
