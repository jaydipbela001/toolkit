import { Link } from 'react-router-dom';
import './Home.css';

const TOOLS = [
  {
    icon: '⚡',
    title: 'Code Formatter',
    subtitle: 'Format, minify & validate',
    description: 'Format and validate JSON, CSS, and SQL instantly. Syntax highlighting, diff checker, and minification — all in one place.',
    path: '/json-formatter',
    tags: ['JSON', 'CSS', 'SQL', 'Diff'],
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9)',
  },
  {
    icon: '🎂',
    title: 'Age Calculator',
    subtitle: 'Exact age breakdown',
    description: 'Get your precise age in years, months, days, and hours. Discover your zodiac sign and count down to your next birthday.',
    path: '/age-calculator',
    tags: ['Years', 'Zodiac', 'Birthday'],
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    icon: '💰',
    title: 'EMI Calculator',
    subtitle: 'Loan installment planner',
    description: 'Calculate monthly EMI for any loan with a visual principal vs interest breakdown. Supports yearly and monthly tenure.',
    path: '/emi-calculator',
    tags: ['Loans', 'Interest', 'Charts'],
    color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: '🌍',
    title: 'Timezone Converter',
    subtitle: 'Live world clocks',
    description: 'Convert time between 24 timezones with live ticking clocks. Enter a custom time in 12h or 24h format and convert instantly.',
    path: '/timezone-converter',
    tags: ['Live Clocks', '12h/24h', 'Global'],
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  },
  {
    icon: '🔐',
    title: 'Password Generator',
    subtitle: 'Cryptographically secure',
    description: 'Generate secure random passwords using Web Crypto API. Custom length, character sets, strength meter, and history log.',
    path: '/password-generator',
    tags: ['Secure', 'Custom', 'Strong'],
    color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #be185d)',
  },
];

const STATS = [
  { num: '5', label: 'Free Tools', icon: '🛠️' },
  { num: '0', label: 'Data Stored', icon: '🔒' },
  { num: '100%', label: 'Browser-Based', icon: '⚡' },
  { num: '∞', label: 'Always Free', icon: '🆓' },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Results',
    text: 'Every tool processes data directly in your browser — zero server round-trips. Results appear as fast as you can type.',
    color: '#f59e0b',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    text: "Your data never leaves your device. No accounts, no tracking, no server logs. What you type stays private — always.",
    color: '#10b981',
  },
  {
    icon: '📱',
    title: 'Works Everywhere',
    text: 'Fully responsive on desktop, tablet, and mobile. Dark and light themes. No app download needed.',
    color: '#06b6d4',
  },
  {
    icon: '🆓',
    title: '100% Free Forever',
    text: 'Every tool on DevToolsHub is free with no paywalls, no subscription tiers, and no feature limits.',
    color: '#8b5cf6',
  },
];

const FAQS = [
  {
    q: 'Is DevToolsHub really free?',
    a: 'Yes — completely free. All tools work without registration or payment. We are supported by non-intrusive advertising.',
  },
  {
    q: 'Is my data safe?',
    a: 'Absolutely. Every calculation happens entirely in your browser. Nothing you enter is transmitted to any server. We do not store your inputs.',
  },
  {
    q: 'What is a JSON formatter?',
    a: 'It takes minified or poorly indented JSON and makes it readable. It also validates syntax — useful when debugging API responses or config files.',
  },
  {
    q: 'How is EMI calculated?',
    a: 'Using the formula: EMI = [P × r × (1+r)ⁿ] / [(1+r)ⁿ - 1], where P is the principal, r is the monthly rate, and n is the number of installments.',
  },
  {
    q: 'Does it work on mobile?',
    a: 'Yes. DevToolsHub is fully responsive and designed for all screen sizes — smartphones, tablets, and desktops.',
  },
  {
    q: 'How secure is the password generator?',
    a: "It uses the browser's built-in Web Crypto API (window.crypto.getRandomValues) — the same cryptographic standard used by security professionals.",
  },
];

const Home = () => (
  <div className="home-page">

    {/* ══════════════ HERO ══════════════ */}
    <section className="home-hero">
      {/* Background grid + orbs */}
      <div className="home-hero-bg">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-grid" />
      </div>

      <div className="container home-hero-inner">
        <div className="home-hero-pill">
          <span className="hero-pill-dot" />
          Free · No Sign-up · Browser-Based · Privacy-First
        </div>

        <h1 className="home-hero-title">
          Free Online Developer<br />
          <span className="home-hero-highlight">&amp; Productivity Tools</span>
        </h1>

        <p className="home-hero-sub">
          Format code, calculate loans, convert timezones, generate secure
          passwords — all in your browser. No account. No data stored.
        </p>

        <div className="home-hero-actions">
          <Link to="/json-formatter" className="hero-btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            Try Code Formatter
          </Link>
          <Link to="/age-calculator" className="hero-btn-ghost">
            Explore All Tools
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        {/* Mini stats row */}
        <div className="home-hero-stats">
          {STATS.map(s => (
            <div key={s.label} className="hero-stat">
              <span className="hero-stat-icon">{s.icon}</span>
              <span className="hero-stat-num">{s.num}</span>
              <span className="hero-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════ TOOLS ══════════════ */}
    <section className="home-tools-section">
      <div className="container">
        <div className="home-section-header">
          <span className="section-eyebrow">What we offer</span>
          <h2>Five Powerful Free Tools</h2>
          <p>Built for developers, students, and everyday users. No install, no sign-up.</p>
        </div>

        <div className="home-tools-grid">
          {TOOLS.map((tool, i) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="home-tool-card"
              style={{ '--tool-color': tool.color, animationDelay: `${i * 0.07}s` }}
            >
              {/* Top accent line */}
              <div className="tool-card-accent" style={{ background: tool.gradient }} />

              <div className="tool-card-top">
                <div className="tool-card-icon" style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}30` }}>
                  <span>{tool.icon}</span>
                </div>
                <div className="tool-card-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7v10"/>
                  </svg>
                </div>
              </div>

              <div className="tool-card-body">
                <p className="tool-card-subtitle" style={{ color: tool.color }}>{tool.subtitle}</p>
                <h3 className="tool-card-title">{tool.title}</h3>
                <p className="tool-card-desc">{tool.description}</p>
              </div>

              <div className="tool-card-tags">
                {tool.tags.map(tag => (
                  <span key={tag} className="tool-tag" style={{ color: tool.color, background: `${tool.color}12` }}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════ FEATURES ══════════════ */}
    <section className="home-features-section">
      <div className="container">
        <div className="home-section-header">
          <span className="section-eyebrow">Why DevToolsHub</span>
          <h2>Designed Around You</h2>
          <p>We were tired of slow, bloated, data-hungry tool sites — so we built the alternative.</p>
        </div>

        <div className="home-features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="home-feature-card" style={{ '--feature-color': f.color }}>
              <div className="feature-icon-wrap" style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}>
                <span>{f.icon}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════ ABOUT ══════════════ */}
    <section className="home-about-section">
      <div className="container">
        <div className="home-about-grid">
          <div className="home-about-text">
            <span className="section-eyebrow">Our story</span>
            <h2>Built for Developers<br />and Everyday Users</h2>
            <p>
              DevToolsHub started as a personal project — a collection of utilities we kept
              needing but couldn't find in a clean, fast, trustworthy form. Every tool we found
              required an account, sent data to a server, or was buried under advertisements.
            </p>
            <p>
              We built DevToolsHub on one principle:{' '}
              <strong>tools should serve the user, not harvest their data.</strong>{' '}
              Every calculation and conversion happens entirely in your browser. No backend.
              No database. No analytics on what you type.
            </p>
            <div className="about-cta-row">
              <Link to="/about" className="hero-btn-ghost">
                Learn More
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link to="/contact" className="hero-btn-ghost">
                Contact Us
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
          </div>

          <div className="home-about-right">
            <div className="home-stats-grid">
              {STATS.map(s => (
                <div key={s.label} className="home-stat-card">
                  <span className="home-stat-icon">{s.icon}</span>
                  <span className="home-stat-num">{s.num}</span>
                  <span className="home-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ══════════════ FAQ ══════════════ */}
    <section className="home-faq-section">
      <div className="container">
        <div className="home-section-header">
          <span className="section-eyebrow">Got questions?</span>
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about DevToolsHub.</p>
        </div>

        <div className="home-faq-grid">
          {FAQS.map((faq, i) => (
            <div key={i} className="home-faq-item">
              <div className="faq-q-row">
                <span className="faq-num">0{i + 1}</span>
                <h3>{faq.q}</h3>
              </div>
              <p>{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ══════════════ CTA ══════════════ */}
    <section className="home-cta-section">
      <div className="container">
        <div className="home-cta-inner">
          <div className="cta-orb cta-orb-1" />
          <div className="cta-orb cta-orb-2" />
          <span className="section-eyebrow">Ready?</span>
          <h2>Start Using DevToolsHub Today</h2>
          <p>No sign-up. No downloads. Just open a tool and get to work.</p>
          <div className="home-cta-links">
            <Link to="/json-formatter" className="hero-btn-primary">Code Formatter</Link>
            <Link to="/age-calculator" className="hero-btn-ghost">Age Calculator</Link>
            <Link to="/emi-calculator" className="hero-btn-ghost">EMI Calculator</Link>
            <Link to="/timezone-converter" className="hero-btn-ghost">Timezone</Link>
            <Link to="/password-generator" className="hero-btn-ghost">Password</Link>
          </div>
        </div>
      </div>
    </section>

  </div>
);

export default Home;
