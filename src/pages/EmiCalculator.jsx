import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './EmiCalculator.css';

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTenure, setLoanTenure] = useState('');
  const [tenureType, setTenureType] = useState('years');
  const [emi, setEmi] = useState(null);
  const [error, setError] = useState('');
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo('.emi-calculator-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const calculateEMI = () => {
    setError('');
    setEmi(null);

    if (!loanAmount || !interestRate || !loanTenure) {
      setError('Please fill in all fields');
      return;
    }

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const tenure = parseFloat(loanTenure);

    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      setError('All values must be greater than 0');
      return;
    }

    const months = tenureType === 'years' ? tenure * 12 : tenure;
    const monthlyRate = rate / (12 * 100);

    const emiValue =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayment = emiValue * months;
    const totalInterest = totalPayment - principal;

    setEmi({
      emi: Math.round(emiValue),
      totalPayment: Math.round(totalPayment),
      totalInterest: Math.round(totalInterest),
      principal: Math.round(principal),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateEMI();
  };

  return (
    <div className="page emi-calculator" ref={pageRef}>
      <div className="container tool-container">
        <div className="page-header">
          <h1>EMI Calculator</h1>
          <p>Calculate your Equated Monthly Installment for loans</p>
        </div>

        <div className="emi-calculator-card">
          <form onSubmit={handleSubmit} className="emi-form">
            <div className="form-group">
              <label htmlFor="loanAmount">Loan Amount (₹)</label>
              <input
                type="number"
                id="loanAmount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                placeholder="e.g., 500000"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="interestRate">Interest Rate (% per annum)</label>
              <input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 8.5"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group form-group-flex">
                <label htmlFor="loanTenure">Loan Tenure</label>
                <input
                  type="number"
                  id="loanTenure"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                  placeholder="e.g., 5"
                  min="1"
                  required
                />
              </div>

              <div className="form-group form-group-select">
                <label>&nbsp;</label>
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value)}
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-full">
              Calculate EMI
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {emi && (
            <div className="emi-result">
              <div className="emi-main">
                <div className="emi-label">Monthly EMI</div>
                <div className="emi-value">₹{emi.emi.toLocaleString()}</div>
              </div>

              <div className="emi-breakdown">
                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="dot dot-principal"></span>
                    Principal Amount
                  </div>
                  <div className="breakdown-value">₹{emi.principal.toLocaleString()}</div>
                </div>

                <div className="breakdown-item">
                  <div className="breakdown-label">
                    <span className="dot dot-interest"></span>
                    Total Interest
                  </div>
                  <div className="breakdown-value">₹{emi.totalInterest.toLocaleString()}</div>
                </div>

                <div className="breakdown-item total">
                  <div className="breakdown-label">Total Payment</div>
                  <div className="breakdown-value">₹{emi.totalPayment.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmiCalculator;
