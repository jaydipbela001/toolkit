import { useState } from 'react';
import './EmiCalculator.css';

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount]     = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure]             = useState('');
  const [tenureUnit, setTenureUnit]     = useState('years');
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState('');

  const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

  const calculateEMI = () => {
    setError('');
    setResult(null);
    const P = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate);
    const rawTenure  = parseFloat(tenure);

    if (!P || P <= 0)                                    { setError('Please enter a valid loan amount.'); return; }
    if (!annualRate || annualRate <= 0 || annualRate > 100) { setError('Please enter a valid interest rate (0–100%).'); return; }
    if (!rawTenure || rawTenure <= 0)                    { setError('Please enter a valid loan tenure.'); return; }

    const N = tenureUnit === 'years' ? rawTenure * 12 : rawTenure;
    const r = annualRate / 12 / 100;

    const emi = r === 0
      ? P / N
      : (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);

    const totalPayment  = emi * N;
    const totalInterest = totalPayment - P;
    const interestPct   = (totalInterest / totalPayment) * 100;
    const principalPct  = 100 - interestPct;

    setResult({ emi, totalPayment, totalInterest, principal: P, interestPct, principalPct, N });
  };

  const RADIUS       = 54;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const interestDash  = result ? (result.interestPct / 100) * CIRCUMFERENCE : 0;

  return (
    <div className="emi-page">
      <div className="emi-container">

        {/* Header */}
        <div className="emi-header">
          <div className="emi-header-icon">💰</div>
          <h1 className="emi-title">EMI Calculator</h1>
          <p className="emi-subtitle">Calculate your monthly loan installment instantly</p>
        </div>

        {/* Input Card */}
        <div className="emi-card">

          {/* Loan Amount */}
          <div className="emi-field">
            <label className="emi-label">
              <span className="emi-label-icon">🏦</span>
              Loan Amount
            </label>
            <div className="emi-input-wrap">
              <span className="emi-badge">₹</span>
              <input
                type="number" className="emi-input"
                placeholder="e.g. 500000"
                value={loanAmount} min="0"
                onChange={e => setLoanAmount(e.target.value)}
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div className="emi-field">
            <label className="emi-label">
              <span className="emi-label-icon">📈</span>
              Interest Rate (% p.a.)
            </label>
            <div className="emi-input-wrap">
              <span className="emi-badge">%</span>
              <input
                type="number" className="emi-input"
                placeholder="e.g. 8.5"
                value={interestRate} min="0" max="100" step="0.1"
                onChange={e => setInterestRate(e.target.value)}
              />
            </div>
          </div>

          {/* Loan Tenure */}
          <div className="emi-field">
            <label className="emi-label">
              <span className="emi-label-icon">📅</span>
              Loan Tenure
            </label>
            <div className="emi-tenure-row">
              <div className="emi-input-wrap emi-tenure-input">
                <span className="emi-badge">⏱</span>
                <input
                  type="number" className="emi-input"
                  placeholder={tenureUnit === 'years' ? 'e.g. 5' : 'e.g. 60'}
                  value={tenure} min="0"
                  onChange={e => setTenure(e.target.value)}
                />
              </div>
              <div className="emi-pill-group">
                <button
                  type="button"
                  className={`emi-pill ${tenureUnit === 'years' ? 'emi-pill-active' : ''}`}
                  onClick={() => setTenureUnit('years')}
                >Years</button>
                <button
                  type="button"
                  className={`emi-pill ${tenureUnit === 'months' ? 'emi-pill-active' : ''}`}
                  onClick={() => setTenureUnit('months')}
                >Months</button>
              </div>
            </div>
          </div>

          {/* Button */}
          <button className="emi-btn" onClick={calculateEMI}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="4" y="2" width="16" height="20" rx="2"/>
              <line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/>
              <line x1="8" y1="14" x2="12" y2="14"/>
            </svg>
            Calculate EMI
          </button>

          {error && (
            <div className="emi-error">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="emi-result">

            {/* Hero card */}
            <div className="emi-hero-card">
              <p className="emi-hero-label">Monthly EMI</p>
              <div className="emi-hero-amount">₹{fmt(result.emi)}</div>
              <p className="emi-hero-sub">for {result.N} months</p>
            </div>

            {/* Donut + breakdown */}
            <div className="emi-visual-row">
              <div className="emi-donut-wrap">
                <svg className="emi-donut-svg" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r={RADIUS} fill="none"
                    stroke="var(--primary-color)" strokeWidth="16" strokeOpacity="0.25"/>
                  <circle cx="64" cy="64" r={RADIUS} fill="none"
                    stroke="url(#emiGrad)" strokeWidth="16"
                    strokeDasharray={`${interestDash} ${CIRCUMFERENCE}`}
                    strokeDashoffset={CIRCUMFERENCE * 0.25}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.8s cubic-bezier(0.4,0,0.2,1)' }}
                  />
                  <defs>
                    <linearGradient id="emiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ec4899"/>
                      <stop offset="100%" stopColor="#8b5cf6"/>
                    </linearGradient>
                  </defs>
                  <text x="64" y="58" textAnchor="middle" fill="var(--text-color)" fontSize="16" fontWeight="800">
                    {result.interestPct.toFixed(1)}%
                  </text>
                  <text x="64" y="74" textAnchor="middle" fill="var(--text-muted)" fontSize="8" fontWeight="600">
                    INTEREST
                  </text>
                </svg>
                <div className="emi-donut-legend">
                  <div className="emi-legend-item">
                    <span className="emi-legend-dot emi-legend-principal"></span>
                    <span>Principal</span>
                    <strong>{result.principalPct.toFixed(1)}%</strong>
                  </div>
                  <div className="emi-legend-item">
                    <span className="emi-legend-dot emi-legend-interest"></span>
                    <span>Interest</span>
                    <strong>{result.interestPct.toFixed(1)}%</strong>
                  </div>
                </div>
              </div>

              <div className="emi-breakdown-grid">
                <div className="emi-breakdown-card emi-bc-blue">
                  <div className="emi-bc-icon">🏠</div>
                  <div>
                    <div className="emi-bc-label">Principal Amount</div>
                    <div className="emi-bc-value">₹{fmt(result.principal)}</div>
                  </div>
                </div>
                <div className="emi-breakdown-card emi-bc-pink">
                  <div className="emi-bc-icon">💸</div>
                  <div>
                    <div className="emi-bc-label">Total Interest</div>
                    <div className="emi-bc-value">₹{fmt(result.totalInterest)}</div>
                  </div>
                </div>
                <div className="emi-breakdown-card emi-bc-purple">
                  <div className="emi-bc-icon">💳</div>
                  <div>
                    <div className="emi-bc-label">Total Payment</div>
                    <div className="emi-bc-value">₹{fmt(result.totalPayment)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="emi-progress-wrap">
              <div className="emi-progress-labels">
                <span>
                  <span className="emi-progress-dot emi-progress-dot-principal"></span>
                  Principal — {result.principalPct.toFixed(1)}%
                </span>
                <span>
                  Interest — {result.interestPct.toFixed(1)}%
                  <span className="emi-progress-dot emi-progress-dot-interest"></span>
                </span>
              </div>
              <div className="emi-progress-bar">
                <div className="emi-progress-fill-principal" style={{ width: `${result.principalPct}%` }}/>
                <div className="emi-progress-fill-interest"  style={{ width: `${result.interestPct}%` }}/>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default EmiCalculator;
