import { Link } from 'react-router-dom';
import './Home.css';

const TOOLS = [
  {
    icon: '⚡',
    title: 'Code Formatter & Validator',
    description: 'Format, minify, and validate JSON and CSS code instantly. Paste messy code and get beautifully indented output with syntax highlighting. Perfect for debugging API responses, config files, and data structures.',
    path: '/json-formatter',
    badge: 'JSON · CSS · SQL',
    color: '#06b6d4',
  },
  {
    icon: '🎂',
    title: 'Age Calculator',
    description: 'Calculate your exact age in years, months, days, hours, and even minutes from your date of birth. Find your zodiac sign, day of the week you were born, and how many days until your next birthday.',
    path: '/age-calculator',
    badge: 'Years · Months · Days',
    color: '#f59e0b',
  },
  {
    icon: '💰',
    title: 'EMI Calculator',
    description: 'Calculate your Equated Monthly Installment for home loans, car loans, and personal loans. View a full breakdown of principal amount, total interest payable, and total payment with a visual chart.',
    path: '/emi-calculator',
    badge: 'Loans · Interest · Charts',
    color: '#10b981',
  },
  {
    icon: '🌍',
    title: 'Timezone Converter',
    description: 'Convert time between any two timezones worldwide with live clocks. Schedule meetings across continents, plan international calls, or track business hours in different cities — all in real time.',
    path: '/timezone-converter',
    badge: '24 Timezones · Live Clocks',
    color: '#8b5cf6',
  },
  {
    icon: '🔐',
    title: 'Password Generator',
    description: 'Generate cryptographically secure, random passwords instantly. Choose length, character types (uppercase, lowercase, numbers, symbols), and see real-time strength analysis. Your passwords never leave your device.',
    path: '/password-generator',
    badge: 'Secure · Random · Fast',
    color: '#ec4899',
  },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Results', text: 'Every tool processes data directly in your browser with zero server round-trips. Results appear as fast as you can type.' },
  { icon: '🔒', title: 'Privacy First', text: 'Your data never leaves your device. No accounts, no tracking of your inputs, no data sent to any server. What you type stays private.' },
  { icon: '📱', title: 'Works Everywhere', text: 'Fully responsive on desktop, tablet, and mobile. Dark and light themes. No app download required — just open and use.' },
  { icon: '🆓', title: '100% Free Forever', text: 'Every tool on DevToolsHub is free with no hidden paywalls, no subscription tiers, and no feature limits. Always.' },
];

const FAQS = [
  {
    q: 'Is DevToolsHub really free?',
    a: 'Yes, completely free. All tools are available without registration, subscription, or payment of any kind. We are supported by non-intrusive advertising.',
  },
  {
    q: 'Is my data safe when I use these tools?',
    a: 'Absolutely. Every calculation and conversion happens entirely in your browser using JavaScript. Nothing you enter is transmitted to our servers. We do not store or log any of your inputs.',
  },
  {
    q: 'What is a JSON formatter used for?',
    a: 'A JSON formatter takes minified or badly indented JSON text and makes it readable by adding proper indentation and line breaks. It also validates whether your JSON is syntactically correct, which is helpful when debugging API responses.',
  },
  {
    q: 'How is EMI calculated?',
    a: 'EMI (Equated Monthly Installment) is calculated using the formula: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1], where P is the principal loan amount, r is the monthly interest rate, and n is the number of monthly installments.',
  },
  {
    q: 'Can I use DevToolsHub on my phone?',
    a: 'Yes. DevToolsHub is fully responsive and designed to work well on all screen sizes. All tools are accessible and usable on smartphones and tablets without needing to install an app.',
  },
  {
    q: 'How does the password generator ensure security?',
    a: 'Our password generator uses the browser\'s built-in Web Crypto API (window.crypto.getRandomValues) to generate cryptographically random passwords. This is the same standard used by security professionals.',
  },
];

const Home = () => {
  return (
    <div className="home-page">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="home-hero">
        <div className="container">
          <div className="home-hero-badge">Free · No Sign-up · Browser-Based</div>
          <h1 className="home-hero-title">
            Free Online Developer &amp; Productivity Tools
          </h1>
          <p className="home-hero-subtitle">
            DevToolsHub gives you a collection of fast, reliable, and privacy-respecting utility tools
            — right in your browser. Format code, calculate loans, convert timezones, generate
            passwords, and more. No account required. No data stored.
          </p>
          <div className="home-hero-actions">
            <Link to="/json-formatter" className="btn">Try Code Formatter</Link>
            <Link to="/age-calculator" className="btn btn-secondary">Age Calculator</Link>
          </div>
        </div>
      </section>

      {/* ── Tools grid ───────────────────────────────────────── */}
      <section className="home-tools-section">
        <div className="container">
          <div className="home-section-header">
            <h2>Our Tools</h2>
            <p>Five free utilities built for developers, students, and everyday users.</p>
          </div>
          <div className="home-tools-grid">
            {TOOLS.map(tool => (
              <Link key={tool.path} to={tool.path} className="home-tool-card">
                <div className="home-tool-icon" style={{ background: `${tool.color}18`, color: tool.color }}>
                  {tool.icon}
                </div>
                <div className="home-tool-body">
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  <span className="home-tool-badge" style={{ color: tool.color, background: `${tool.color}15` }}>
                    {tool.badge}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="home-features-section">
        <div className="container">
          <div className="home-section-header">
            <h2>Why Use DevToolsHub?</h2>
            <p>We built these tools because we were tired of slow, ad-heavy, data-hungry alternatives.</p>
          </div>
          <div className="home-features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="home-feature-card">
                <span className="home-feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About content ────────────────────────────────────── */}
      <section className="home-about-section">
        <div className="container">
          <div className="home-about-grid">
            <div className="home-about-text">
              <h2>Built for Developers and Everyday Users</h2>
              <p>
                DevToolsHub started as a personal project — a collection of small utilities that we kept
                needing but couldn't find in a clean, fast, and trustworthy form. Every tool we looked at
                was either bloated with advertisements, required creating an account, or processed data on
                a remote server.
              </p>
              <p>
                We built DevToolsHub on a simple principle: <strong>tools should serve the user, not harvest their data</strong>.
                Every calculation, format operation, and conversion happens entirely in your browser using
                standard JavaScript APIs. There is no backend, no database of your inputs, and no analytics
                on what you type.
              </p>
              <p>
                Whether you are a developer formatting a JSON API response, a student calculating loan EMIs,
                or a professional scheduling a meeting across timezones — DevToolsHub has a tool that works
                instantly, without fuss.
              </p>
              <Link to="/about" className="btn btn-secondary">Learn More About Us</Link>
            </div>
            <div className="home-about-stats">
              <div className="home-stat">
                <span className="home-stat-num">5+</span>
                <span className="home-stat-label">Free Tools</span>
              </div>
              <div className="home-stat">
                <span className="home-stat-num">0</span>
                <span className="home-stat-label">Data Stored</span>
              </div>
              <div className="home-stat">
                <span className="home-stat-num">100%</span>
                <span className="home-stat-label">Browser-Based</span>
              </div>
              <div className="home-stat">
                <span className="home-stat-num">Free</span>
                <span className="home-stat-label">Always &amp; Forever</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="home-faq-section">
        <div className="container">
          <div className="home-section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about DevToolsHub.</p>
          </div>
          <div className="home-faq-list">
            {FAQS.map(faq => (
              <div key={faq.q} className="home-faq-item">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="home-cta-section">
        <div className="container">
          <h2>Start Using DevToolsHub Today</h2>
          <p>No sign-up. No downloads. Just open a tool and get to work.</p>
          <div className="home-cta-links">
            <Link to="/json-formatter" className="btn">Code Formatter</Link>
            <Link to="/age-calculator" className="btn btn-secondary">Age Calculator</Link>
            <Link to="/emi-calculator" className="btn btn-secondary">EMI Calculator</Link>
            <Link to="/timezone-converter" className="btn btn-secondary">Timezone Converter</Link>
            <Link to="/password-generator" className="btn btn-secondary">Password Generator</Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
