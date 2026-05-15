"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    if (isLoginView) {
      const { error } = await signInWithEmail(email, password);
      if (error) setErrorMsg(error.message);
    } else {
      const { error } = await signUpWithEmail(email, password, name);
      if (error) setErrorMsg(error.message);
      else {
        // Automatically switch to login view or show success
        setIsLoginView(true);
        setErrorMsg("Sign up successful! You can now log in.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={closeAuthModal} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex',
      alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(5px)'
    }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{
        background: 'var(--pitch-black)', border: '1px solid var(--gold)',
        padding: '2rem', width: '90%', maxWidth: '400px', position: 'relative'
      }}>
        <button onClick={closeAuthModal} style={{
          position: 'absolute', top: '10px', right: '15px', background: 'transparent',
          border: 'none', color: 'var(--cream)', fontSize: '1.5rem', cursor: 'pointer'
        }}>×</button>
        
        <h2 style={{ fontFamily: 'var(--font-cinzel)', color: 'var(--gold)', marginBottom: '1.5rem', textAlign: 'center' }}>
          {isLoginView ? 'Login to HUNKX' : 'Join HUNKX'}
        </h2>

        {errorMsg && <p style={{ color: errorMsg.includes("successful") ? 'green' : 'red', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{errorMsg}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLoginView && (
            <input 
              type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required
              style={{ padding: '0.75rem', background: 'transparent', border: '1px solid #333', color: 'var(--cream)' }}
            />
          )}
          <input 
            type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required
            style={{ padding: '0.75rem', background: 'transparent', border: '1px solid #333', color: 'var(--cream)' }}
          />
          <input 
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            style={{ padding: '0.75rem', background: 'transparent', border: '1px solid #333', color: 'var(--cream)' }}
          />
          <button type="submit" className="nav-cta" disabled={loading} style={{ background: 'var(--gold)', color: 'var(--pitch-black)', padding: '0.75rem', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Processing...' : (isLoginView ? 'Sign In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', color: '#666' }}>OR</div>

        <button onClick={signInWithGoogle} style={{
          width: '100%', padding: '0.75rem', background: 'white', color: 'black',
          border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold'
        }}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '18px' }}/>
          Continue with Google
        </button>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#aaa' }}>
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLoginView(!isLoginView); setErrorMsg(""); }} style={{ color: 'var(--gold)', cursor: 'pointer', textDecoration: 'underline' }}>
            {isLoginView ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
}
