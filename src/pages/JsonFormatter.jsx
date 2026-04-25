import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './JsonFormatter.css';

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo('.json-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const formatJson = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter some JSON to format');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const minifyJson = () => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter some JSON to minify');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const loadSample = () => {
    const sample = {
      name: 'John Doe',
      age: 30,
      email: 'john.doe@example.com',
      address: {
        street: '123 Main St',
        city: 'New York',
        country: 'USA',
      },
      hobbies: ['reading', 'coding', 'gaming'],
    };
    setInput(JSON.stringify(sample));
    setError('');
    setOutput('');
  };

  const syntaxHighlight = (json) => {
    if (!json) return '';
    return json
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(
        /(".*?"):\s*(null|true|false|\d+|".*?"|\[.*?\]|\{.*?\})/g,
        '<span class="json-key">$1</span>: <span class="json-value">$2</span>'
      )
      .replace(/"(.*?)"/g, '<span class="json-string">"$1"</span>')
      .replace(/\b(true|false|null)\b/g, '<span class="json-boolean">$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="json-number">$1</span>');
  };

  return (
    <div className="page json-formatter" ref={pageRef}>
      <div className="container tool-container">
        <div className="page-header">
          <h1>JSON Formatter</h1>
          <p>Format, validate, and beautify your JSON data</p>
        </div>

        <div className="json-card">
          <div className="json-input-section">
            <div className="json-header">
              <label>Input JSON</label>
              <div className="json-actions">
                <button className="btn-small" onClick={loadSample}>
                  Load Sample
                </button>
                <button className="btn-small btn-secondary" onClick={clearAll}>
                  Clear
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste your JSON here...&#10;Example: {"name": "John", "age": 30}'
              rows={10}
            />
          </div>

          <div className="json-buttons">
            <button className="btn" onClick={formatJson}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
              </svg>
              Format
            </button>
            <button className="btn btn-secondary" onClick={minifyJson}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
              </svg>
              Minify
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {output && (
            <div className="json-output-section">
              <div className="json-header">
                <label>Formatted Output</label>
                <button
                  className={`copy-btn ${copied ? 'copied' : ''}`}
                  onClick={copyToClipboard}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="json-output">
                <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(output) }} />
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
