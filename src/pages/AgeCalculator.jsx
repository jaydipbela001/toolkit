import { useState, useRef, useEffect } from 'react';
import './AgeCalculator.css';

// ─── Constants ────────────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa'];

// ─── Custom Calendar Date Picker ──────────────────────────────────────────────
const DatePicker = ({ value, onChange, maxDate }) => {
  const today  = new Date();
  const maxD   = maxDate ? new Date(maxDate) : today;
  const parsed = value ? new Date(value + 'T00:00:00') : null;

  const [viewYear,  setViewYear]  = useState(parsed ? parsed.getFullYear() : today.getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.getMonth()    : today.getMonth());
  const [open,      setOpen]      = useState(false);
  const [mode,      setMode]      = useState('day');
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Sync view when value changes externally
  useEffect(() => {
    if (parsed) { setViewYear(parsed.getFullYear()); setViewMonth(parsed.getMonth()); }
  }, [value]);

  const firstDay    = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => viewMonth === 0  ? (setViewMonth(11), setViewYear(y => y-1)) : setViewMonth(m => m-1);
  const nextMonth = () => viewMonth === 11 ? (setViewMonth(0),  setViewYear(y => y+1)) : setViewMonth(m => m+1);

  const selectDay = (d) => {
    const mm = String(viewMonth + 1).padStart(2,'0');
    const dd = String(d).padStart(2,'0');
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  };

  const isSelected = (d) => parsed && parsed.getFullYear()===viewYear && parsed.getMonth()===viewMonth && parsed.getDate()===d;
  const isDisabled = (d) => new Date(viewYear, viewMonth, d) > maxD;
  const isToday    = (d) => today.getFullYear()===viewYear && today.getMonth()===viewMonth && today.getDate()===d;

  const displayValue = parsed
    ? parsed.toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })
    : 'Pick from calendar';

  const startYear = maxD.getFullYear() - 120;
  const years = Array.from({ length: maxD.getFullYear() - startYear + 1 }, (_,i) => maxD.getFullYear() - i);

  return (
    <div className="dp-wrap" ref={ref}>
      <button type="button" className={`dp-trigger ${open ? 'dp-trigger-open' : ''}`} onClick={() => setOpen(o => !o)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <span className={parsed ? 'dp-value-set' : 'dp-placeholder'}>{displayValue}</span>
        <svg className={`dp-chevron ${open ? 'dp-chevron-up' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="dp-dropdown">
          {mode === 'day' && (
            <>
              <div className="dp-header">
                <button type="button" className="dp-nav" onClick={prevMonth}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div className="dp-header-center">
                  <button type="button" className="dp-month-btn" onClick={() => setMode('month')}>{MONTHS[viewMonth]}</button>
                  <button type="button" className="dp-year-btn"  onClick={() => setMode('year')}>{viewYear}</button>
                </div>
                <button type="button" className="dp-nav" onClick={nextMonth}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              <div className="dp-daynames">{DAYS.map(d => <span key={d}>{d}</span>)}</div>
              <div className="dp-grid">
                {Array.from({ length: firstDay }).map((_,i) => <span key={`e${i}`}/>)}
                {Array.from({ length: daysInMonth }, (_,i) => i+1).map(d => (
                  <button key={d} type="button"
                    className={`dp-day ${isSelected(d)?'dp-day-selected':''} ${isToday(d)&&!isSelected(d)?'dp-day-today':''} ${isDisabled(d)?'dp-day-disabled':''}`}
                    onClick={() => !isDisabled(d) && selectDay(d)} disabled={isDisabled(d)}>
                    {d}
                  </button>
                ))}
              </div>
              <div className="dp-footer">
                <button type="button" className="dp-today-btn" onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>Today</button>
                {parsed && <button type="button" className="dp-clear-btn" onClick={() => { onChange(''); setOpen(false); }}>Clear</button>}
              </div>
            </>
          )}

          {mode === 'month' && (
            <div className="dp-month-grid">
              <div className="dp-picker-header">
                <span>Select Month</span>
                <button type="button" className="dp-back-btn" onClick={() => setMode('day')}>✕</button>
              </div>
              <div className="dp-month-grid-inner">
                {MONTHS.map((m,i) => (
                  <button key={m} type="button"
                    className={`dp-month-item ${viewMonth===i?'dp-month-selected':''}`}
                    onClick={() => { setViewMonth(i); setMode('day'); }}>
                    {m.slice(0,3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode === 'year' && (
            <div className="dp-year-list">
              <div className="dp-picker-header">
                <span>Select Year</span>
                <button type="button" className="dp-back-btn" onClick={() => setMode('day')}>✕</button>
              </div>
              <div className="dp-year-scroll">
                {years.map(y => (
                  <button key={y} type="button"
                    className={`dp-year-item ${viewYear===y?'dp-year-selected':''}`}
                    onClick={() => { setViewYear(y); setMode('month'); }}>
                    {y}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Date Difference Calculator ──────────────────────────────────────────────
const calcDateDiff = (dateA, dateB) => {
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');
  const [start, end] = a <= b ? [a, b] : [b, a];

  let years  = end.getFullYear() - start.getFullYear();
  let months = end.getMonth()    - start.getMonth();
  let days   = end.getDate()     - start.getDate();

  if (days < 0) {
    months--;
    const lastDay = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    days += lastDay;
  }
  if (months < 0) { years--; months += 12; }

  const totalDays  = Math.round(Math.abs(b - a) / 86400000);
  const totalWeeks = Math.floor(totalDays / 7);
  const remDays    = totalDays % 7;

  return { years, months, days, totalDays, totalWeeks, remDays,
           startLabel: start.toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'}),
           endLabel:   end.toLocaleDateString('en-US',{day:'numeric',month:'long',year:'numeric'}) };
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AgeCalculator = () => {
  const [activeTab,   setActiveTab]   = useState('age');  // 'age' | 'diff'
  const [birthDate,   setBirthDate]   = useState('');
  const [manualInput, setManualInput] = useState('');
  const [inputMode,   setInputMode]   = useState('calendar');
  const [age,         setAge]         = useState(null);
  const [error,       setError]       = useState('');

  // Date Difference state
  const [diffDateA,    setDiffDateA]    = useState('');
  const [diffDateB,    setDiffDateB]    = useState('');
  const [diffManualA,  setDiffManualA]  = useState('');
  const [diffManualB,  setDiffManualB]  = useState('');
  const [diffInputMode, setDiffInputMode] = useState('calendar');
  const [diffResult,   setDiffResult]   = useState(null);
  const [diffError,    setDiffError]    = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-format as DD/MM/YYYY while typing
  const handleManualChange = (raw) => {
    setError('');
    setAge(null);

    // Strip everything except digits
    const digits = raw.replace(/\D/g, '').slice(0, 8);

    // Build formatted string with auto-slashes
    let formatted = digits;
    if (digits.length > 2 && digits.length <= 4) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2);
    } else if (digits.length > 4) {
      formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
    }

    setManualInput(formatted);

    // Only parse when we have a full 8-digit date
    if (digits.length === 8) {
      const d = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      const y = digits.slice(4, 8);
      const iso = `${y}-${m}-${d}`;
      const test = new Date(iso + 'T00:00:00');
      if (!isNaN(test.getTime())) {
        setBirthDate(iso);
      } else {
        setBirthDate('');
        setError('Invalid date — check day and month values.');
      }
    } else {
      setBirthDate('');
    }
  };

  // Sync calendar → manual display
  const handleCalendarChange = (val) => {
    setBirthDate(val);
    setError('');
    setAge(null);
    if (val) {
      const [y,m,d] = val.split('-');
      setManualInput(`${d}/${m}/${y}`);
    } else {
      setManualInput('');
    }
  };

  const getZodiac = (month, day) => {
    const signs = [
      { name:'Capricorn',   emoji:'♑', end:[1,19]  },
      { name:'Aquarius',    emoji:'♒', end:[2,18]  },
      { name:'Pisces',      emoji:'♓', end:[3,20]  },
      { name:'Aries',       emoji:'♈', end:[4,19]  },
      { name:'Taurus',      emoji:'♉', end:[5,20]  },
      { name:'Gemini',      emoji:'♊', end:[6,20]  },
      { name:'Cancer',      emoji:'♋', end:[7,22]  },
      { name:'Leo',         emoji:'♌', end:[8,22]  },
      { name:'Virgo',       emoji:'♍', end:[9,22]  },
      { name:'Libra',       emoji:'♎', end:[10,22] },
      { name:'Scorpio',     emoji:'♏', end:[11,21] },
      { name:'Sagittarius', emoji:'♐', end:[12,21] },
      { name:'Capricorn',   emoji:'♑', end:[12,31] },
    ];
    return signs.find(s => month < s.end[0] || (month === s.end[0] && day <= s.end[1]));
  };

  const calculateAge = () => {
    setError('');
    setAge(null);
    if (!birthDate) {
      setError(inputMode === 'manual'
        ? 'Enter date as DD/MM/YYYY or YYYY-MM-DD'
        : 'Please select your date of birth');
      return;
    }
    const birth = new Date(birthDate + 'T00:00:00');
    const today = new Date();
    if (isNaN(birth.getTime())) { setError('Invalid date. Use DD/MM/YYYY format.'); return; }
    if (birth > today)          { setError('Birth date cannot be in the future.'); return; }

    let years  = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth()    - birth.getMonth();
    let days   = today.getDate()     - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) { years--; months += 12; }
    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
      months--;
    }

    const totalDays   = Math.floor((today - birth) / 86400000);
    const totalWeeks  = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours  = totalDays * 24;

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const daysUntilBirthday = Math.ceil((nextBirthday - today) / 86400000);

    const zodiac    = getZodiac(birth.getMonth() + 1, birth.getDate());
    const dayOfWeek = birth.toLocaleDateString('en-US', { weekday: 'long' });

    setAge({ years, months, days, totalDays, totalWeeks, totalMonths, totalHours, daysUntilBirthday, zodiac, dayOfWeek });
  };

  const calculateDiff = () => {
    setDiffError('');
    setDiffResult(null);
    if (!diffDateA) { setDiffError('Please enter or pick the start date.'); return; }
    if (!diffDateB) { setDiffError('Please enter or pick the end date.'); return; }
    if (diffDateA === diffDateB) { setDiffError('Both dates are the same — difference is zero.'); return; }
    setDiffResult(calcDateDiff(diffDateA, diffDateB));
  };

  // Auto-format DD/MM/YYYY for diff manual inputs
  const parseDiffManual = (raw, setIso, setManual, setErr) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    let fmt = digits;
    if (digits.length > 2 && digits.length <= 4) fmt = digits.slice(0,2)+'/'+digits.slice(2);
    else if (digits.length > 4)                  fmt = digits.slice(0,2)+'/'+digits.slice(2,4)+'/'+digits.slice(4);
    setManual(fmt);
    setErr('');
    setDiffResult(null);
    if (digits.length === 8) {
      const d=digits.slice(0,2), m=digits.slice(2,4), y=digits.slice(4,8);
      const iso = `${y}-${m}-${d}`;
      const t = new Date(iso+'T00:00:00');
      if (!isNaN(t.getTime())) setIso(iso);
      else { setIso(''); setErr('Invalid date — check day and month values.'); }
    } else { setIso(''); }
  };

  return (
    <div className="ac-page">
      <div className="ac-container">

        {/* Header */}
        <div className="ac-header">
          <div className="ac-header-icon">🎂</div>
          <h1 className="ac-title">Age Calculator</h1>
          <p className="ac-subtitle">Find your exact age with a detailed breakdown</p>
        </div>

        {/* ── Top tab switcher ── */}
        <div className="ac-top-tabs">
          <button
            type="button"
            className={`ac-top-tab ${activeTab === 'age' ? 'ac-top-tab-active' : ''}`}
            onClick={() => setActiveTab('age')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Age from Birth Date
          </button>
          <button
            type="button"
            className={`ac-top-tab ${activeTab === 'diff' ? 'ac-top-tab-active' : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Date Difference
          </button>
        </div>

        {/* ════════ AGE CALCULATOR ════════ */}
        {activeTab === 'age' && (
          <>
            <div className="ac-card">
              <div className="ac-mode-toggle">
                <button type="button" className={`ac-mode-btn ${inputMode === 'calendar' ? 'ac-mode-active' : ''}`} onClick={() => setInputMode('calendar')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Calendar Picker
                </button>
                <button type="button" className={`ac-mode-btn ${inputMode === 'manual' ? 'ac-mode-active' : ''}`} onClick={() => setInputMode('manual')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Type Manually
                </button>
              </div>

              <div className="ac-input-section">
                <label className="ac-label">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Date of Birth
                </label>
                {inputMode === 'calendar' ? (
                  <DatePicker value={birthDate} onChange={handleCalendarChange} maxDate={todayStr} />
                ) : (
                  <div className="ac-manual-wrap">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    <input type="text" className="ac-manual-input" placeholder="DD/MM/YYYY"
                      value={manualInput} onChange={e => handleManualChange(e.target.value)}
                      maxLength={10} inputMode="numeric" />
                    {birthDate && (
                      <span className="ac-manual-valid">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      </span>
                    )}
                  </div>
                )}
                {inputMode === 'calendar' && birthDate && (
                  <div className="ac-date-preview">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    Selected: {new Date(birthDate + 'T00:00:00').toLocaleDateString('en-US', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
                  </div>
                )}
              </div>

              <button className="ac-btn" onClick={calculateAge}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Calculate Age
              </button>

              {error && (
                <div className="ac-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
              {!age && !error && (
                <div className="ac-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  {inputMode === 'calendar'
                    ? 'Open the calendar above to pick your birth date, then click Calculate.'
                    : 'Type your birth date — slashes are added automatically as you type digits.'}
                </div>
              )}
            </div>

            {age && (
              <div className="ac-result">
                <div className="ac-main-display">
                  <div className="ac-age-big">
                    <span className="ac-age-num">{age.years}</span>
                    <span className="ac-age-unit">years old</span>
                  </div>
                  <div className="ac-age-sub">{age.months} months &amp; {age.days} days</div>
                </div>
                <div className="ac-stats-grid">
                  <div className="ac-stat-card ac-stat-blue">
                    <div className="ac-stat-icon">📅</div>
                    <div className="ac-stat-value">{age.totalDays.toLocaleString()}</div>
                    <div className="ac-stat-label">Total Days</div>
                  </div>
                  <div className="ac-stat-card ac-stat-purple">
                    <div className="ac-stat-icon">📆</div>
                    <div className="ac-stat-value">{age.totalWeeks.toLocaleString()}</div>
                    <div className="ac-stat-label">Total Weeks</div>
                  </div>
                  <div className="ac-stat-card ac-stat-pink">
                    <div className="ac-stat-icon">🗓️</div>
                    <div className="ac-stat-value">{age.totalMonths.toLocaleString()}</div>
                    <div className="ac-stat-label">Total Months</div>
                  </div>
                  <div className="ac-stat-card ac-stat-orange">
                    <div className="ac-stat-icon">⏰</div>
                    <div className="ac-stat-value">{age.totalHours.toLocaleString()}</div>
                    <div className="ac-stat-label">Total Hours</div>
                  </div>
                </div>
                <div className="ac-info-row">
                  <div className="ac-info-item">
                    <span className="ac-info-icon">🎂</span>
                    <div>
                      <div className="ac-info-label">Next Birthday</div>
                      <div className="ac-info-value">{age.daysUntilBirthday === 0 ? '🎉 Today!' : `in ${age.daysUntilBirthday} days`}</div>
                    </div>
                  </div>
                  <div className="ac-info-item">
                    <span className="ac-info-icon">{age.zodiac?.emoji}</span>
                    <div>
                      <div className="ac-info-label">Zodiac Sign</div>
                      <div className="ac-info-value">{age.zodiac?.name}</div>
                    </div>
                  </div>
                  <div className="ac-info-item">
                    <span className="ac-info-icon">🌅</span>
                    <div>
                      <div className="ac-info-label">Born on</div>
                      <div className="ac-info-value">{age.dayOfWeek}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ════════ DATE DIFFERENCE ════════ */}
        {activeTab === 'diff' && (
          <>
            <div className="ac-card">

              {/* Input mode toggle */}
              <div className="ac-mode-toggle">
                <button type="button"
                  className={`ac-mode-btn ${diffInputMode === 'calendar' ? 'ac-mode-active' : ''}`}
                  onClick={() => { setDiffInputMode('calendar'); setDiffResult(null); setDiffError(''); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Calendar Picker
                </button>
                <button type="button"
                  className={`ac-mode-btn ${diffInputMode === 'manual' ? 'ac-mode-active' : ''}`}
                  onClick={() => { setDiffInputMode('manual'); setDiffResult(null); setDiffError(''); }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Type Manually
                </button>
              </div>

              {/* Date inputs */}
              <div className="ac-diff-inputs">

                {/* ── Start Date ── */}
                <div className="ac-diff-field">
                  <label className="ac-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Start Date
                  </label>
                  {diffInputMode === 'calendar' ? (
                    <>
                      <DatePicker value={diffDateA} onChange={v => { setDiffDateA(v); setDiffResult(null); }} />
                      {diffDateA && (
                        <div className="ac-date-preview">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                          {new Date(diffDateA+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="ac-manual-wrap">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      <input type="text" className="ac-manual-input" placeholder="DD/MM/YYYY"
                        value={diffManualA} inputMode="numeric" maxLength={10}
                        onChange={e => parseDiffManual(e.target.value, setDiffDateA, setDiffManualA, setDiffError)} />
                      {diffDateA && (
                        <span className="ac-manual-valid">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow divider */}
                <div className="ac-diff-arrow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>

                {/* ── End Date ── */}
                <div className="ac-diff-field">
                  <label className="ac-label">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    End Date
                  </label>
                  {diffInputMode === 'calendar' ? (
                    <>
                      <DatePicker value={diffDateB} onChange={v => { setDiffDateB(v); setDiffResult(null); }} />
                      {diffDateB && (
                        <div className="ac-date-preview">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                          {new Date(diffDateB+'T00:00:00').toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="ac-manual-wrap">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      <input type="text" className="ac-manual-input" placeholder="DD/MM/YYYY"
                        value={diffManualB} inputMode="numeric" maxLength={10}
                        onChange={e => parseDiffManual(e.target.value, setDiffDateB, setDiffManualB, setDiffError)} />
                      {diffDateB && (
                        <span className="ac-manual-valid">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <button className="ac-btn" onClick={calculateDiff}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Calculate Difference
              </button>

              {diffError && (
                <div className="ac-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {diffError}
                </div>
              )}
              {!diffResult && !diffError && (
                <div className="ac-hint">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  {diffInputMode === 'calendar'
                    ? 'Pick two dates using the calendars above, then click Calculate Difference.'
                    : 'Type both dates in DD/MM/YYYY format — slashes are added automatically.'}
                </div>
              )}
            </div>

            {diffResult && (
              <div className="ac-result">
                <div className="ac-main-display">
                  <div className="ac-diff-summary-row">
                    <span className="ac-diff-date-label">{diffResult.startLabel}</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'var(--primary-color)',flexShrink:0}}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                    <span className="ac-diff-date-label">{diffResult.endLabel}</span>
                  </div>
                  <div className="ac-age-big" style={{marginTop:'0.75rem'}}>
                    <span className="ac-age-num">{diffResult.years}</span>
                    <span className="ac-age-unit">
                      {diffResult.years === 1 ? 'year' : 'years'}
                      {diffResult.months > 0 ? `, ${diffResult.months}mo` : ''}
                      {diffResult.days > 0 ? `, ${diffResult.days}d` : ''}
                    </span>
                  </div>
                </div>
                <div className="ac-stats-grid">
                  <div className="ac-stat-card ac-stat-blue">
                    <div className="ac-stat-icon">📅</div>
                    <div className="ac-stat-value">{diffResult.totalDays.toLocaleString()}</div>
                    <div className="ac-stat-label">Total Days</div>
                  </div>
                  <div className="ac-stat-card ac-stat-purple">
                    <div className="ac-stat-icon">📆</div>
                    <div className="ac-stat-value">{diffResult.totalWeeks.toLocaleString()}</div>
                    <div className="ac-stat-label">Total Weeks</div>
                  </div>
                  <div className="ac-stat-card ac-stat-pink">
                    <div className="ac-stat-icon">🗓️</div>
                    <div className="ac-stat-value">{(diffResult.years * 12 + diffResult.months).toLocaleString()}</div>
                    <div className="ac-stat-label">Total Months</div>
                  </div>
                  <div className="ac-stat-card ac-stat-orange">
                    <div className="ac-stat-icon">⏰</div>
                    <div className="ac-stat-value">{(diffResult.totalDays * 24).toLocaleString()}</div>
                    <div className="ac-stat-label">Total Hours</div>
                  </div>
                </div>
                {diffResult.remDays > 0 && (
                  <div className="ac-date-preview" style={{justifyContent:'center'}}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                    {diffResult.totalWeeks.toLocaleString()} weeks and {diffResult.remDays} remaining days
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};

export default AgeCalculator;
