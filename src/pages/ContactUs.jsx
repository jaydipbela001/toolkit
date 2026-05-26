import React, { useState } from 'react';
import './PolicyPages.css';

const CONTACT_EMAIL = 'contact@devtoolshub.com';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required.';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    // Validate before allowing mailto to fire
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      e.preventDefault();
      setErrors(validationErrors);
      return;
    }
    // mailto: will open the user's email client — no backend needed
    setSubmitted(true);
  };

  const mailtoHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    `DevToolsHub Contact: ${formData.name}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <main className="policy-page">
      <div className="policy-container">

        {/* ── Header ── */}
        <header className="policy-header">
          <h1>Contact Us</h1>
          <p className="policy-subtitle">
            Have a question, suggestion, or found a bug? We'd love to hear from you.
          </p>
        </header>

        {/* Contact Form */}
        <section className="policy-section" aria-labelledby="form-heading">
          <h2 className="policy-h2" id="form-heading">Send Us a Message</h2>
          <p className="policy-p">
            Fill in the form below and click "Send Message" — it will open your email client
            with everything pre-filled so you can send it directly.
          </p>

          {submitted ? (
            <div className="contact-success" role="alert">
              <span>✅</span>
              <span>
                Your email client should have opened with your message ready to send. If it
                didn't, you can email us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </span>
            </div>
          ) : (
            <form
              className="contact-form"
              action={mailtoHref}
              method="get"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Name */}
              <div className="contact-form-group">
                <label htmlFor="contact-name">Your Name</label>
                <input
                  id="contact-name"
                  className="contact-input"
                  type="text"
                  name="name"
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  aria-invalid={!!errors.name}
                />
                {errors.name && (
                  <span
                    id="name-error"
                    style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.2rem' }}
                    role="alert"
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="contact-form-group">
                <label htmlFor="contact-email">Your Email</label>
                <input
                  id="contact-email"
                  className="contact-input"
                  type="email"
                  name="email"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <span
                    id="email-error"
                    style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.2rem' }}
                    role="alert"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Message */}
              <div className="contact-form-group">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className="contact-textarea"
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={handleChange}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  aria-invalid={!!errors.message}
                />
                {errors.message && (
                  <span
                    id="message-error"
                    style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.2rem' }}
                    role="alert"
                  >
                    {errors.message}
                  </span>
                )}
              </div>

              <button type="submit" className="contact-btn">
                ✉️ Send Message
              </button>
            </form>
          )}
        </section>

        {/* Direct Contact */}
        <section className="policy-section" aria-labelledby="direct-heading">
          <h2 className="policy-h2" id="direct-heading">Reach Us Directly</h2>
          <p className="policy-p">
            Prefer to write your own email? No problem — reach us directly at:
          </p>
          <div className="contact-info-row">
            <span className="info-icon">✉️</span>
            <span>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </span>
          </div>
          <p className="policy-p" style={{ marginTop: '1rem' }}>
            We typically respond within 1–3 business days. We read every message and appreciate
            your feedback — it helps us make DevToolsHub better for everyone.
          </p>
        </section>

        {/* What to Contact Us About */}
        <section className="policy-section" aria-labelledby="topics-heading">
          <h2 className="policy-h2" id="topics-heading">What Can You Contact Us About?</h2>
          <ul className="policy-ul">
            <li className="policy-li">
              <strong>Bug Reports:</strong> Found something broken? Let us know which tool and
              what happened.
            </li>
            <li className="policy-li">
              <strong>Feature Requests:</strong> Have an idea for a new tool or improvement?
              We'd love to hear it.
            </li>
            <li className="policy-li">
              <strong>Privacy &amp; Data Questions:</strong> Questions about our Privacy Policy
              or how we handle data.
            </li>
            <li className="policy-li">
              <strong>Advertising Inquiries:</strong> Questions about advertising on DevToolsHub.
            </li>
            <li className="policy-li">
              <strong>General Feedback:</strong> Anything else — we're always happy to chat.
            </li>
          </ul>
        </section>

      </div>
    </main>
  );
};

export default ContactUs;
