import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './PolicyPages.css';

// ─── EmailJS config — loaded from .env ───────────────────────────────────────
// Fill in your .env file:
//   VITE_EMAILJS_SERVICE_ID=service_abc123
//   VITE_EMAILJS_TEMPLATE_ID=template_xyz789
//   VITE_EMAILJS_PUBLIC_KEY=your_public_key
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const CONTACT_EMAIL = 'jaydipbela@gmail.com';

// ─── Status types ─────────────────────────────────────────────────────────────
const STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

const ContactUs = () => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors,   setErrors]   = useState({});
  const [status,   setStatus]   = useState(STATUS.IDLE);

  // ── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.name.trim())    e.name    = 'Name is required.';
    if (!formData.email.trim())   e.email   = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                  e.email   = 'Enter a valid email address.';
    if (!formData.message.trim()) e.message = 'Message is required.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  // ── Submit via EmailJS ───────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus(STATUS.SENDING);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:    formData.name,
          from_email:   formData.email,
          subject:      formData.subject || 'DevToolsHub Contact Form',
          message:      formData.message,
          reply_to:     formData.email,
          to_email:     CONTACT_EMAIL,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus(STATUS.SUCCESS);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('EmailJS error:', err);
      setStatus(STATUS.ERROR);
    }
  };

  const resetForm = () => {
    setStatus(STATUS.IDLE);
    setErrors({});
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <main className="policy-page">
      <div className="policy-container">

        {/* Header */}
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
            Fill in the form and hit <strong>Send Message</strong> — your message goes directly
            to <strong>{CONTACT_EMAIL}</strong>. No email client needed.
          </p>

          {/* ── Success state ── */}
          {status === STATUS.SUCCESS && (
            <div className="contact-success" role="alert">
              <span className="contact-status-icon">✅</span>
              <div>
                <strong>Message sent successfully!</strong>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', fontWeight: 400 }}>
                  We'll get back to you at <strong>{formData.email || 'your email'}</strong> within 1–3 business days.
                </p>
              </div>
              <button className="contact-reset-btn" onClick={resetForm}>Send another</button>
            </div>
          )}

          {/* ── Error state ── */}
          {status === STATUS.ERROR && (
            <div className="contact-error-banner" role="alert">
              <span>⚠️</span>
              <div>
                <strong>Failed to send.</strong> Please try emailing us directly at{' '}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </div>
              <button className="contact-reset-btn contact-reset-btn-err" onClick={resetForm}>Try again</button>
            </div>
          )}

          {/* ── Form ── */}
          {(status === STATUS.IDLE || status === STATUS.SENDING) && (
            <form ref={formRef} className="contact-form" onSubmit={handleSubmit} noValidate>

              {/* Name + Email row */}
              <div className="contact-row">
                <div className="contact-form-group">
                  <label htmlFor="contact-name">Your Name <span className="contact-required">*</span></label>
                  <input
                    id="contact-name"
                    className={`contact-input ${errors.name ? 'contact-input-error' : ''}`}
                    type="text"
                    name="name"
                    placeholder="Jaydip Bela"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    disabled={status === STATUS.SENDING}
                  />
                  {errors.name && <span className="contact-field-error" role="alert">{errors.name}</span>}
                </div>

                <div className="contact-form-group">
                  <label htmlFor="contact-email">Your Email <span className="contact-required">*</span></label>
                  <input
                    id="contact-email"
                    className={`contact-input ${errors.email ? 'contact-input-error' : ''}`}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    disabled={status === STATUS.SENDING}
                  />
                  {errors.email && <span className="contact-field-error" role="alert">{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="contact-form-group">
                <label htmlFor="contact-subject">Subject</label>
                <input
                  id="contact-subject"
                  className="contact-input"
                  type="text"
                  name="subject"
                  placeholder="Bug report / Feature request / General feedback"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={status === STATUS.SENDING}
                />
              </div>

              {/* Message */}
              <div className="contact-form-group">
                <label htmlFor="contact-message">Message <span className="contact-required">*</span></label>
                <textarea
                  id="contact-message"
                  className={`contact-textarea ${errors.message ? 'contact-input-error' : ''}`}
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={status === STATUS.SENDING}
                />
                {errors.message && <span className="contact-field-error" role="alert">{errors.message}</span>}
              </div>

              <button
                type="submit"
                className="contact-btn"
                disabled={status === STATUS.SENDING}
              >
                {status === STATUS.SENDING ? (
                  <>
                    <span className="contact-spinner" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </section>

        {/* Direct contact */}
        <section className="policy-section" aria-labelledby="direct-heading">
          <h2 className="policy-h2" id="direct-heading">Reach Us Directly</h2>
          <p className="policy-p">Prefer to write your own email? Reach us at:</p>
          <div className="contact-info-row">
            <span className="info-icon">✉️</span>
            <span>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </span>
          </div>
          <p className="policy-p" style={{ marginTop: '1rem' }}>
            We typically respond within 1–3 business days.
          </p>
        </section>

        {/* Topics */}
        <section className="policy-section" aria-labelledby="topics-heading">
          <h2 className="policy-h2" id="topics-heading">What Can You Contact Us About?</h2>
          <ul className="policy-ul">
            <li className="policy-li"><strong>Bug Reports:</strong> Found something broken? Tell us which tool and what happened.</li>
            <li className="policy-li"><strong>Feature Requests:</strong> Have an idea for a new tool or improvement?</li>
            <li className="policy-li"><strong>Privacy &amp; Data Questions:</strong> Questions about our Privacy Policy.</li>
            <li className="policy-li"><strong>Advertising Inquiries:</strong> Questions about advertising on DevToolsHub.</li>
            <li className="policy-li"><strong>General Feedback:</strong> Anything else — we're always happy to chat.</li>
          </ul>
        </section>

      </div>
    </main>
  );
};

export default ContactUs;
