import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ToolCard from '../components/ToolCard/ToolCard';
import './Home.css';

const Home = () => {
  const heroRef = useRef(null);
  const toolsRef = useRef(null);

  const tools = [
    {
      title: 'Age Calculator',
      description: 'Calculate your exact age in years, months, and days from your date of birth.',
      icon: '🎂',
      path: '/age-calculator',
      color: 'primary',
    },
    {
      title: 'EMI Calculator',
      description: 'Calculate your Equated Monthly Installment for loans with interest rates.',
      icon: '💰',
      path: '/emi-calculator',
      color: 'success',
    },
    {
      title: 'Timezone Converter',
      description: 'Convert time between different timezones worldwide instantly.',
      icon: '🌍',
      path: '/timezone-converter',
      color: 'secondary',
    },
    {
      title: 'Password Generator',
      description: 'Generate secure, strong passwords with customizable options.',
      icon: '🔐',
      path: '/password-generator',
      color: 'warning',
    },
    {
      title: 'JSON Formatter',
      description: 'Format, validate, and beautify your JSON data with ease.',
      icon: '📋',
      path: '/json-formatter',
      color: 'purple',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
      });

      gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.4,
        ease: 'power3.out',
      });

      gsap.fromTo('.tool-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: toolsRef.current,
            start: 'top 80%',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="home">
      <section className="hero" ref={heroRef}>
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
        </div>
        <div className="container hero-content">
          <h1 className="hero-title">
            Essential Tools for
            <span className="text-gradient"> Everyday Tasks</span>
          </h1>
          <p className="hero-subtitle">
            A collection of powerful, easy-to-use online tools designed to simplify your daily calculations and conversions.
          </p>
          <div className="hero-cta">
            <a href="#tools" className="btn">
              Explore Tools
            </a>
          </div>
        </div>
      </section>

      <section id="tools" className="tools-section" ref={toolsRef}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Tools</h2>
            <p className="section-subtitle">
              Choose from our collection of useful utilities
            </p>
          </div>
          <div className="tools-grid">
            {tools.map((tool) => (
              <ToolCard key={tool.path} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose Us?</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Efficient</h3>
              <p>All tools work instantly in your browser with no loading delays.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Privacy First</h3>
              <p>Your data never leaves your device. We value your privacy.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Works perfectly on all devices - desktop, tablet, and mobile.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🆓</div>
              <h3>100% Free</h3>
              <p>No hidden costs, no subscriptions. All tools are completely free.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
