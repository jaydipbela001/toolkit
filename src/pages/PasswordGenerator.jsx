import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState('');
  const pageRef = useRef(null);

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo('.password-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    generatePassword();
  }, [length, options]);

  const generatePassword = () => {
    let chars = '';
    if (options.uppercase) chars += uppercase;
    if (options.lowercase) chars += lowercase;
    if (options.numbers) chars += numbers;
    if (options.symbols) chars += symbols;

    if (chars === '') {
      setPassword('');
      setStrength('');
      return;
    }

    let result = '';
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);
    calculateStrength(result);
  };

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (pwd.length >= 16) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    if (score <= 3) setStrength('Weak');
    else if (score <= 5) setStrength('Medium');
    else setStrength('Strong');
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleOption = (key) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 'Strong': return '#22c55e';
      case 'Medium': return '#f59e0b';
      case 'Weak': return '#ef4444';
      default: return 'transparent';
    }
  };

  return (
    <div className="page password-generator" ref={pageRef}>
      <div className="container tool-container">
        <div className="page-header">
          <h1>Password Generator</h1>
          <p>Create strong, secure passwords instantly</p>
        </div>

        <div className="password-card">
          <div className="password-display">
            <div className="password-text" title={password}>
              {password || 'Select at least one option'}
            </div>
            <button
              className={`copy-button ${copied ? 'copied' : ''}`}
              onClick={copyToClipboard}
              disabled={!password}
              aria-label="Copy password"
            >
              {copied ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              )}
              <span className="copy-tooltip">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {strength && (
            <div className="strength-indicator">
              <div className="strength-bar">
                <div
                  className="strength-fill"
                  style={{
                    width: strength === 'Strong' ? '100%' : strength === 'Medium' ? '66%' : '33%',
                    backgroundColor: getStrengthColor(),
                  }}
                ></div>
              </div>
              <span className="strength-text" style={{ color: getStrengthColor() }}>
                {strength}
              </span>
            </div>
          )}

          <div className="password-options">
            <div className="length-slider">
              <div className="length-header">
                <label>Password Length</label>
                <span className="length-value">{length}</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="slider"
              />
              <div className="length-labels">
                <span>4</span>
                <span>32</span>
                <span>64</span>
              </div>
            </div>

            <div className="checkbox-options">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={() => toggleOption('uppercase')}
                />
                <span className="checkmark"></span>
                Uppercase (A-Z)
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={() => toggleOption('lowercase')}
                />
                <span className="checkmark"></span>
                Lowercase (a-z)
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={() => toggleOption('numbers')}
                />
                <span className="checkmark"></span>
                Numbers (0-9)
              </label>

              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={() => toggleOption('symbols')}
                />
                <span className="checkmark"></span>
                Symbols (!@#$...)
              </label>
            </div>
          </div>

          <button className="btn btn-full regenerate-btn" onClick={generatePassword}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
            </svg>
            Generate New Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordGenerator;
