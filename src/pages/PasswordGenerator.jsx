import { useState, useEffect, useCallback } from 'react';
import './PasswordGenerator.css';

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers:   '0123456789',
  symbols:   '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

const getStrength = (pwd, opts) => {
  if (!pwd) return { label: '', level: 0, color: '' };
  let score = 0;
  if (pwd.length >= 8)  score++;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (opts.lowercase)   score++;
  if (opts.uppercase)   score++;
  if (opts.numbers)     score++;
  if (opts.symbols)     score++;
  if (score <= 3)  return { label: 'Weak',    level: 1, color: '#ef4444' };
  if (score <= 5)  return { label: 'Fair',    level: 2, color: '#f59e0b' };
  if (score <= 6)  return { label: 'Strong',  level: 3, color: '#22c55e' };
  return             { label: 'Very Strong', level: 4, color: '#10b981' };
};

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length,   setLength]   = useState(16);
  const [options,  setOptions]  = useState({
    uppercase: true,
    lowercase: true,
    numbers:   true,
    symbols:   true,
  });
  const [copied,   setCopied]   = useState(false);
  const [history,  setHistory]  = useState([]);

  const generate = useCallback(() => {
    let chars = '';
    Object.entries(CHAR_SETS).forEach(([key, val]) => { if (options[key]) chars += val; });
    if (!chars) { setPassword(''); return; }

    const arr = new Uint32Array(length);
    window.crypto.getRandomValues(arr);
    const pwd = Array.from(arr, n => chars[n % chars.length]).join('');
    setPassword(pwd);
    setHistory(h => [pwd, ...h].slice(0, 5));
  }, [length, options]);

  useEffect(() => { generate(); }, [generate]);

  const copy = async (text = password) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const toggle = (key) => setOptions(p => ({ ...p, [key]: !p[key] }));

  const strength = getStrength(password, options);
  const activeCount = Object.values(options).filter(Boolean).length;

  const OPTION_META = [
    { key: 'uppercase', label: 'Uppercase',  sub: 'A – Z',    icon: '🔠' },
    { key: 'lowercase', label: 'Lowercase',  sub: 'a – z',    icon: '🔡' },
    { key: 'numbers',   label: 'Numbers',    sub: '0 – 9',    icon: '🔢' },
    { key: 'symbols',   label: 'Symbols',    sub: '!@#$...',  icon: '🔣' },
  ];

  return (
    <div className="pg-page">
      <div className="pg-container">

        {/* Header */}
        <div className="pg-header">
          <div className="pg-header-icon">🔐</div>
          <h1 className="pg-title">Password Generator</h1>
          <p className="pg-subtitle">Create strong, secure passwords instantly</p>
        </div>

        {/* Main card */}
        <div className="pg-card">

          {/* Password display */}
          <div className="pg-display-wrap">
            <div className="pg-display">
              <span className="pg-password-text">
                {password || <span className="pg-empty">Select at least one option</span>}
              </span>
              <button
                className={`pg-copy-btn ${copied ? 'pg-copy-copied' : ''}`}
                onClick={() => copy()}
                disabled={!password}
                title="Copy password"
              >
                {copied ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Strength bar */}
            {password && (
              <div className="pg-strength">
                <div className="pg-strength-bars">
                  {[1,2,3,4].map(l => (
                    <div
                      key={l}
                      className="pg-strength-bar"
                      style={{ background: l <= strength.level ? strength.color : undefined }}
                    />
                  ))}
                </div>
                <span className="pg-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Length slider */}
          <div className="pg-length-section">
            <div className="pg-length-header">
              <label className="pg-section-label">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 6H3M15 12H3M17 18H3"/>
                </svg>
                Password Length
              </label>
              <span className="pg-length-badge">{length}</span>
            </div>
            <div className="pg-slider-wrap">
              <span className="pg-slider-min">4</span>
              <input
                type="range" min="4" max="64" value={length}
                className="pg-slider"
                style={{ '--pct': `${((length - 4) / 60) * 100}%` }}
                onChange={e => setLength(+e.target.value)}
              />
              <span className="pg-slider-max">64</span>
            </div>
            <div className="pg-length-presets">
              {[8, 12, 16, 24, 32].map(n => (
                <button
                  key={n}
                  type="button"
                  className={`pg-preset ${length === n ? 'pg-preset-active' : ''}`}
                  onClick={() => setLength(n)}
                >{n}</button>
              ))}
            </div>
          </div>

          {/* Character options */}
          <div className="pg-options-section">
            <label className="pg-section-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/>
              </svg>
              Character Types
              <span className="pg-options-count">{activeCount} active</span>
            </label>
            <div className="pg-options-grid">
              {OPTION_META.map(({ key, label, sub, icon }) => (
                <button
                  key={key}
                  type="button"
                  className={`pg-option ${options[key] ? 'pg-option-on' : ''}`}
                  onClick={() => toggle(key)}
                >
                  <span className="pg-option-icon">{icon}</span>
                  <div className="pg-option-text">
                    <span className="pg-option-label">{label}</span>
                    <span className="pg-option-sub">{sub}</span>
                  </div>
                  <div className={`pg-option-check ${options[key] ? 'pg-option-check-on' : ''}`}>
                    {options[key] && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button className="pg-generate-btn" onClick={generate}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Generate New Password
          </button>
        </div>

        {/* History */}
        {history.length > 1 && (
          <div className="pg-history-card">
            <div className="pg-history-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="12 8 12 12 14 14"/>
                <path d="M3.05 11a9 9 0 1 0 .5-4.5"/>
                <polyline points="3 3 3 9 9 9"/>
              </svg>
              Recent Passwords
            </div>
            <div className="pg-history-list">
              {history.slice(1).map((pwd, i) => (
                <div key={i} className="pg-history-item">
                  <span className="pg-history-pwd">{pwd}</span>
                  <button className="pg-history-copy" onClick={() => copy(pwd)} title="Copy">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PasswordGenerator;
