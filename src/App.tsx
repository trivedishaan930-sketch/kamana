import { useCallback, useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, Route, Routes, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, UploadCloud } from 'lucide-react';
import { api, ApiError, type Artwork, type Report } from './lib/api';
import { getPublicProfile, getSession, supabase, supabaseConfigured, type Session } from './lib/supabase';

const rules = 'AI-generated artwork only. Nudity, sex acts, pornography, minors or ambiguous-age subjects, nonconsensual sexual imagery, real-person sexual deepfakes, unlawful material, and work without publishing rights are prohibited.';
const categories = [{id:'general-illustration',label:'General Illustration'},{id:'festival-celebration',label:'Festival & Celebration'},{id:'nature-wildlife',label:'Nature & Wildlife'},{id:'fantasy-mythology',label:'Fantasy & Mythology'},{id:'portrait-character',label:'Portrait & Character'},{id:'fashion-editorial',label:'Fashion & Editorial'},{id:'architecture-places',label:'Architecture & Places'},{id:'abstract-experimental',label:'Abstract & Experimental'},{id:'indian-folk-traditional',label:'Indian Folk & Traditional'}];
const indianStyles = [{id:'madhubani',label:'Madhubani / Mithila'},{id:'warli',label:'Warli'},{id:'gond',label:'Gond'},{id:'odisha-pattachitra',label:'Odisha Pattachitra'},{id:'rajasthani-phad',label:'Rajasthani Phad'},{id:'kalamkari-srikalahasti',label:'Kalamkari — Srikalahasti (freehand)'},{id:'kalamkari-machilipatnam-pedana',label:'Kalamkari — Machilipatnam / Pedana (block print)'},{id:'cheriyal',label:'Cheriyal'},{id:'thanjavur-tanjore',label:'Thanjavur / Tanjore'}];
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
  return <>
    <div className="announcement">Kamna public beta <b>·</b> Non-explicit AI artwork only</div>
    <header className="topbar">
      <Link className="brand" to="/"><span className="brand-mark"/><span className="brand-name">kamna</span></Link>
      <nav className="nav-links"><Link to="/">Explore</Link><Link to="/18-plus">18+ Fashion & Swimwear</Link><Link to="/rules">Community rules</Link><Link to="/report">Report / takedown</Link></nav>
      <div className="nav-right">
        {session ? <><Link to="/account">My account</Link><button className="button-quiet" onClick={() => { void supabase?.auth.signOut(); }}>Sign out</button></> : <button className="button-quiet" onClick={onAuth}>Sign in</button>}
        <Link className="upload-nav" to="/upload">Submit artwork <ArrowRight size={13}/></Link>
      </div>
    </header>
  </>;
}

function Footer() {
  return <footer className="site-footer"><div><div className="footer-brand"><span className="brand-mark"/>kamna</div><p className="footer-note">A moderated beta for AI-generated artwork. Submissions are reviewed before they can appear publicly.</p></div><nav className="footer-links"><Link to="/rules">Community rules</Link><Link to="/privacy">Privacy notice</Link><Link to="/terms">Terms & download rights</Link><Link to="/report">Report / takedown</Link><Link to="/signin">Sign in</Link></nav></footer>;
}

function Setup() {
  return <div className="notice-banner" role="status"><strong>Account setup required.</strong> Supabase connection settings are not configured, so sign-in and uploads are currently unavailable. No account has been created. Please try again after the site administrator completes setup.</div>;
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

  useEffect(() => {
    const client = supabase;
    if (!client) return;
    let active = true;
    const searchParams = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
    const recoveryRequested = searchParams.get('mode') === 'reset' || hashParams.get('type') === 'recovery';
    if (recoveryRequested) setMode('reset');
    async function completeConfirmation() {
      const code = searchParams.get('code');
      const redirectError = searchParams.get('error_description') || searchParams.get('error');
      if (redirectError) {
        setMessage(decodeURIComponent(redirectError.replace(/\+/g, ' ')));
        return;
      }
      if (!code) return;
      setBusy(true);
      const { data, error } = await client!.auth.exchangeCodeForSession(code);
      if (!active) return;
      if (error) {
        setMessage(errorMessage(error, 'The confirmation link is invalid or has expired. Request a new confirmation email.'));
        setShowResend(true);
      } else if (data.session) {
        if (recoveryRequested) {
          setMode('reset');
          setMessage('Password reset link verified. Choose a new password below.');
          navigate('/signin?mode=reset', { replace: true });
        } else {
          setMessage('Email confirmed. You are signed in.');
          onClose?.();
          navigate('/account', { replace: true });
        }
      }
      setBusy(false);
    }
    void completeConfirmation();
    return () => { active = false; };
  }, [navigate, onClose]);

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
      const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: `${location.origin}/signin` } });
      if (error) throw error;
      setMessage('If this account needs confirmation, a new email was requested. Check Inbox and Spam.');
      setShowResend(false);
    } catch (error) {
      setMessage(errorMessage(error, 'Could not resend the confirmation email. Please wait and try again.'));
    } finally { setResending(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!supabase) { setMessage('Supabase setup is required before accounts can be used.'); return; }
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
        setMessage('Password updated. You are signed in.');
        onClose?.();
        navigate('/account', { replace: true });
      } else if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${location.origin}/signin` } });
        if (error) throw error;
        setShowResend(!data.session);
        setMessage(data.session ? 'Account created and signed in.' : 'If this email is new, a confirmation email was sent. If you already have an account, use Sign in or Forgot password.');
        if (data.session) { onClose?.(); navigate('/account'); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          const code = (error as { code?: string }).code;
          setShowResend(code === 'email_not_confirmed' || /confirm|verify|not active/i.test(error.message));
          throw error;
        }
        onClose?.();
        navigate('/account');
      }
    } catch (error) {
      setMessage(errorMessage(error, 'Unable to complete account request.'));
    } finally { setBusy(false); }
  }

  const title = mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Create an account' : mode === 'forgot' ? 'Reset your password' : 'Choose a new password';
  const needsPassword = mode === 'signin' || mode === 'signup' || mode === 'reset';
  return <Page title={title}><section className="form-card auth-card">
    <p>{mode === 'forgot' ? 'Enter your email and we will send a secure reset link. For privacy, the same message is shown whether or not an account exists.' : mode === 'reset' ? 'Choose a new password for your Kamna account.' : 'Use email and password. New accounts require email confirmation. For privacy, Kamna never reveals whether a particular email is registered.'}</p>
    {!supabaseConfigured && <Setup/>}
    <form onSubmit={submit}>
      <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" required={mode !== 'reset'} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)}/></div>
      {needsPassword && <div className="field"><label htmlFor="password">{mode === 'reset' ? 'New password' : 'Password'}</label><input id="password" type={showPassword ? 'text' : 'password'} required minLength={mode === 'signin' ? 1 : 12} maxLength={128} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} value={password} onChange={event => setPassword(event.target.value)}/><button type="button" className="button-quiet" onClick={() => setShowPassword(value => !value)} aria-pressed={showPassword}>{showPassword ? 'Hide password' : 'Show password'}</button>{mode !== 'signin' && password && <small>{passwordStrength(password)}</small>}</div>}
      {mode === 'reset' && <div className="field"><label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type={showConfirmPassword ? 'text' : 'password'} required minLength={12} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)}/><button type="button" className="button-quiet" onClick={() => setShowConfirmPassword(value => !value)} aria-pressed={showConfirmPassword}>{showConfirmPassword ? 'Hide confirmation' : 'Show confirmation'}</button></div>}
      {message && <p role="status">{message}</p>}
      {showResend && <button type="button" className="button-secondary" disabled={resending || busy} onClick={() => void resendConfirmation()}>{resending ? 'Sending…' : 'Resend confirmation email'}</button>}
      <button className="button-primary" disabled={busy || !supabase}>{busy ? 'Please wait…' : mode === 'signin' ? 'Sign in' : mode === 'signup' ? 'Sign up' : mode === 'forgot' ? 'Send reset link' : 'Update password'}</button>
    </form>
    {mode === 'signin' && <><button className="button-quiet" onClick={() => switchMode('forgot')}>Forgot password?</button><button className="button-quiet" onClick={() => switchMode('signup')}>Need an account? Sign up</button></>}
    {mode === 'signup' && <button className="button-quiet" onClick={() => switchMode('signin')}>Already registered? Sign in</button>}
    {mode === 'forgot' && <button className="button-quiet" onClick={() => switchMode('signin')}>Back to sign in</button>}
  </section><Rules/></Page>;
}

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<Artwork[]>([]); const [offset, setOffset] = useState(0); const [next, setNext] = useState<number|null>(null);
  const [loading,setLoading]=useState(true); const [error,setError]=useState('');
  const search=searchParams.get('q')||'', tag=searchParams.get('tag')||'', category=searchParams.get('category')||'', style=searchParams.get('style')||'';
  const load=useCallback(async(reset:boolean)=>{setLoading(true);setError('');try{const at=reset?0:offset;const params=new URLSearchParams({offset:String(at),limit:'24',rating:'general'});if(search)params.set('search',search);if(tag)params.set('tag',tag);if(category)params.set('category',category);if(style)params.set('style',style);const r=await api<{items:Artwork[];total:number;offset:number;limit:number}>(`gallery?${params}`);setItems(v=>reset?r.items:[...v,...r.items]);const n=r.offset+r.items.length;setOffset(n);setNext(n<r.total?n:null);}catch(e){setError(errorMessage(e,'Could not load gallery.'));}finally{setLoading(false);}},[search,tag,category,style,offset]);
  useEffect(()=>{void load(true);},[search,tag,category,style]);
  function setParam(k:string,v:string){const p=new URLSearchParams(searchParams);if(v)p.set(k,v);else p.delete(k);if(k==='category')p.delete('style');setSearchParams(p);}
  return <main className="main-content"><section className="hero"><div><div className="eyebrow">A considered art space</div><h1>Art beyond<br/>the <em>ordinary.</em></h1><p className="hero-copy">Discover AI-generated art across nine thoughtful collections. Approved works are reviewed before appearing publicly.</p><div className="hero-actions"><Link className="button-primary" to="/upload">Submit artwork <ArrowRight size={14}/></Link><a className="button-secondary" href="#gallery">Explore gallery</a></div></div><div className="hero-art" aria-hidden="true"><span className="hero-art-label">KAMNA · BETA</span><span className="hero-art-orbit"/><span className="hero-art-disc"/><span className="hero-art-stamp">Review before publishing</span></div></section><Rules/>
  <section className="category-discovery" aria-label="Browse collections"><div className="section-head"><div><div className="section-kicker">Browse by collection</div><h2>Find your visual language.</h2></div></div><div className="category-chips"><button className={!category?'filter-chip active':'filter-chip'} onClick={()=>setParam('category','')}>All general art</button>{categories.map(c=><button key={c.id} className={category===c.id?'filter-chip active':'filter-chip'} onClick={()=>setParam('category',c.id)}>{c.label}</button>)}</div><p className="helper-note">Indian Folk & Traditional works are AI-inspired interpretations, not traditional or community-created works. Each tradition is named distinctly and respectfully.</p>{category==='indian-folk-traditional'&&<div className="style-chips" aria-label="Indian tradition filters">{indianStyles.map(v=><button key={v.id} className={style===v.id?'filter-chip active':'filter-chip'} onClick={()=>setParam('style',style===v.id?'':v.id)}>{v.label}</button>)}</div>}</section>
  <section id="gallery"><div className="section-head"><div><div className="section-kicker">Approved works · General audience</div><h2>{categories.find(c=>c.id===category)?.label||'Explore approved works'}</h2></div></div><div className="filters"><label className="search-field"><Search size={14}/><input aria-label="Search title, creator, or tags" value={search} onChange={e=>setParam('q',e.target.value)} placeholder="Search title, creator, tags"/></label><label className="search-field">Tag <input aria-label="Filter by tag" value={tag} onChange={e=>setParam('tag',e.target.value)} placeholder="Any tag"/></label><span className="sort-select">Latest</span></div>
  {loading&&!items.length?<p role="status" className="empty-results">Loading approved artwork…</p>:error?<div className="notice-banner" role="alert">{error}<button className="button-quiet" onClick={()=>void load(true)}>Retry</button></div>:items.length?<><div className="artwork-grid">{items.map(art=><article className="artwork-card" key={art.id}><Link className={art.sensitive ? 'artwork-image sensitive-preview' : 'artwork-image'} to={`/artwork/${art.id}`}>{art.image_url&&<img src={art.image_url} alt={art.title} loading="lazy"/>}{art.sensitive&&<span className="sensitive-cover"><span>Sensitive preview · AI-generated</span><small>Open to view</small></span>}<span className="artwork-tag">AI-generated · General</span></Link><div className="card-meta"><div><Link to={`/artwork/${art.id}`} className="card-title">{art.title}</Link><div className="card-creator">by <Link to={`/profile/${art.handle}`}>{art.creator_name}</Link></div></div></div><div className="card-tags">{art.category&&<span className="tag">{categoryLabel(art.category)}</span>}{art.style&&<span className="tag">{styleLabel(art.style)}</span>}{art.tags?.map(t=><button className="tag" key={t} onClick={()=>setParam('tag',t)}>#{t}</button>)}</div></article>)}</div>{next!==null&&<div className="load-more"><button className="button-secondary" disabled={loading} onClick={()=>void load(false)}>Load more</button></div>}</>:<div className="empty-results">{loading?'Loading approved artwork…':'No approved works found. Try another category or search.'}</div>}</section></main>;
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
    <div className="field"><label htmlFor="rating">Audience rating</label><select id="rating" value={audienceRating} onChange={e=>setAudienceRating(e.target.value as 'general'|'adult')}><option value="general">General audience</option>{adultConfigured&&<option value="adult">18+ Fashion & Swimwear</option>}</select>{!adultConfigured&&<small>18+ submissions are unavailable while this collection is not explicitly enabled by the backend.</small>}</div>
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
  </form><aside className="side-card"><h2>Private review first</h2><p>Images upload same-origin to private Supabase Storage and submissions remain pending. Uploads are never published instantly.</p><p>{rules}</p></aside></div></Page>;
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
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let alive = true;
    getSession().then(value => { if (alive) setSession(value); }).catch(() => {}).finally(() => { if (alive) setChecking(false); });
    const listener = supabase?.auth.onAuthStateChange((_event, value) => setSession(value));
    return () => { alive = false; listener?.data.subscription.unsubscribe(); };
  }, []);
  return <div className="site-shell"><Header session={session} onAuth={() => setAuthModal(true)}/>{!supabaseConfigured && <div className="main-content"><Setup/></div>}{checking ? <main className="main-content"><p role="status" className="empty-results">Checking account session…</p></main> : <Routes>
    <Route path="/" element={<Gallery/>}/><Route path="/18-plus" element={<AdultGallery session={session}/>}/><Route path="/artwork/:id" element={<Detail/>}/><Route path="/signin" element={<SignIn/>}/><Route path="/upload" element={<Upload session={session}/>}/><Route path="/account" element={session ? <Account/> : <SignIn/>}/><Route path="/profile/:handle" element={<Profile/>}/><Route path="/report" element={<ReportPage/>}/><Route path="/moderation" element={<Admin/>}/><Route path="/rules" element={<RulesPage/>}/><Route path="/privacy" element={<PrivacyPage/>}/><Route path="/terms" element={<TermsPage/>}/><Route path="*" element={<Page title="Page not found"><Link to="/" className="button-secondary">Return to gallery</Link></Page>}/>
  </Routes>}
  <Footer/>{authModal && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setAuthModal(false); }}><div className="modal" role="dialog" aria-modal="true" aria-label="Sign in"><button className="modal-close" onClick={() => setAuthModal(false)} aria-label="Close">×</button><SignIn onClose={() => setAuthModal(false)}/></div></div>}</div>;
}
