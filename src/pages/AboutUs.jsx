import React from 'react';
import './PolicyPages.css';

const tools = [
  {
    icon: '🎂',
    name: 'Age Calculator',
    description: 'Calculate your exact age in years, months, and days from any date.',
  },
  {
    icon: '💰',
    name: 'EMI Calculator',
    description: 'Compute monthly loan installments with amortization breakdown.',
  },
  {
    icon: '🌍',
    name: 'Timezone Converter',
    description: 'Convert times across any timezone instantly — no sign-up needed.',
  },
  {
    icon: '🔐',
    name: 'Password Generator',
    description: 'Generate strong, random passwords with custom length and character sets.',
  },
  {
    icon: '{ }',
    name: 'Code Formatter',
    description: 'Beautify and format code in multiple languages with one click.',
  },
  {
    icon: '⟺',
    name: 'Diff Checker',
    description: 'Compare two blocks of text or code and highlight the differences.',
  },
];

const badges = [
  { icon: '🔒', label: 'Privacy-First' },
  { icon: '⚡', label: 'Instant Results' },
  { icon: '🌐', label: 'Browser-Based' },
  { icon: '💾', label: 'No Data Stored' },
  { icon: '🆓', label: 'Always Free' },
  { icon: '📱', label: 'Mobile Friendly' },
];

const AboutUs = () => {
  return (
    <main className="policy-page">
      <div className="policy-container">

        {/* ── Header ── */}
        <header className="policy-header">
          <h1>About DevToolsHub</h1>
          <p className="policy-subtitle">
            Free, fast, and privacy-respecting tools built for developers and everyday users alike.
          </p>
        </header>

        {/* Who We Are */}
        <section className="policy-section" aria-labelledby="who-heading">
          <h2 className="policy-h2" id="who-heading">Who We Are</h2>
          <p className="policy-p">
            <strong>DevToolsHub</strong> is a collection of free, browser-based utility tools
            designed to make everyday tasks faster and easier — no account, no download, no hassle.
            Whether you're a developer, student, or professional, our tools are built to just work.
          </p>
          <p className="policy-p">
            Every tool on DevToolsHub runs entirely in your browser. That means your data never
            leaves your device. We don't store inputs, we don't log calculations, and we don't
            require you to hand over any personal information to use our tools.
          </p>
          <div className="about-badges">
            {badges.map((b) => (
              <span className="about-badge" key={b.label}>
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        </section>

        {/* Why We Built This */}
        <section className="policy-section" aria-labelledby="why-heading">
          <h2 className="policy-h2" id="why-heading">Why We Built This</h2>
          <p className="policy-p">
            We got tired of searching for simple tools online only to be met with slow, ad-heavy
            pages that demanded sign-ups, sent data to unknown servers, or simply didn't work on
            mobile. So we built DevToolsHub — a clean, fast, and honest alternative.
          </p>
          <p className="policy-p">
            Our philosophy is simple: <strong>tools should serve the user, not the other way
            around.</strong> That means:
          </p>
          <ul className="policy-ul">
            <li className="policy-li">
              <strong>No registration required</strong> — open the page and start using the tool immediately.
            </li>
            <li className="policy-li">
              <strong>No server-side processing of your data</strong> — all computations happen
              locally in your browser using JavaScript.
            </li>
            <li className="policy-li">
              <strong>No dark patterns</strong> — we don't hide features behind paywalls or
              trick you into sharing more than you intend to.
            </li>
            <li className="policy-li">
              <strong>Transparent advertising</strong> — we use Google AdSense to keep the lights
              on, and we're upfront about it in our Privacy Policy.
            </li>
          </ul>
          <p className="policy-p">
            We believe the web should have more tools like this — lightweight, respectful of
            privacy, and genuinely useful. DevToolsHub is our contribution to that vision.
          </p>
        </section>

        {/* Our Tools */}
        <section className="policy-section" aria-labelledby="tools-heading">
          <h2 className="policy-h2" id="tools-heading">Our Tools</h2>
          <p className="policy-p">
            Here's what you can do on DevToolsHub today — and we're always adding more:
          </p>
          <div className="about-tools-grid">
            {tools.map((tool) => (
              <div className="about-tool-card" key={tool.name}>
                <span className="tool-icon">{tool.icon}</span>
                <h3>{tool.name}</h3>
                <p>{tool.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Commitment */}
        <section className="policy-section" aria-labelledby="commitment-heading">
          <h2 className="policy-h2" id="commitment-heading">Our Commitment to You</h2>
          <p className="policy-p">
            DevToolsHub will always be free to use. We are committed to maintaining a
            privacy-first approach and will never sell your data or introduce features that
            compromise your trust.
          </p>
          <p className="policy-p">
            We continuously improve our tools based on user feedback. If you find a bug,
            have a feature request, or just want to say hello, we'd love to hear from you.
          </p>
          <div className="contact-info-row">
            <span className="info-icon">✉️</span>
            <span>
              Reach us at:{' '}
              <a href="mailto:jaydipbela001@gmail.com">jaydipbela001@gmail.com</a>
            </span>
          </div>
        </section>

      </div>
    </main>
  );
};

export default AboutUs;
