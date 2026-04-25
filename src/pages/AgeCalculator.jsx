import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './AgeCalculator.css';

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState(null);
  const [error, setError] = useState('');
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo('.age-calculator-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const calculateAge = () => {
    setError('');
    setAge(null);

    if (!birthDate) {
      setError('Please select your date of birth');
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      setError('Birth date cannot be in the future');
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }

    const totalDays = Math.floor((today - birth) / (1000 * 60 * 60 * 24));
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

    setAge({
      years,
      months,
      days,
      totalDays,
      daysUntilBirthday,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calculateAge();
  };

  return (
    <div className="page age-calculator" ref={pageRef}>
      <div className="container tool-container">
        <div className="page-header">
          <h1>Age Calculator</h1>
          <p>Calculate your exact age in years, months, and days</p>
        </div>

        <div className="age-calculator-card">
          <form onSubmit={handleSubmit} className="age-form">
            <div className="form-group">
              <label htmlFor="birthDate">Date of Birth</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <button type="submit" className="btn btn-full">
              Calculate Age
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}

          {age && (
            <div className="age-result">
              <div className="age-main">
                <div className="age-item">
                  <span className="age-number">{age.years}</span>
                  <span className="age-label">Years</span>
                </div>
                <div className="age-item">
                  <span className="age-number">{age.months}</span>
                  <span className="age-label">Months</span>
                </div>
                <div className="age-item">
                  <span className="age-number">{age.days}</span>
                  <span className="age-label">Days</span>
                </div>
              </div>

              <div className="age-details">
                <div className="age-detail-item">
                  <span className="detail-icon">📅</span>
                  <span className="detail-text">
                    <strong>{age.totalDays.toLocaleString()}</strong> total days
                  </span>
                </div>
                <div className="age-detail-item">
                  <span className="detail-icon">🎂</span>
                  <span className="detail-text">
                    Next birthday in <strong>{age.daysUntilBirthday}</strong> days
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgeCalculator;
