import React, { useState, useEffect, useRef } from 'react';
import './TimezoneConverter.css';

// ─── Data ─────────────────────────────────────────────────────────────────────
const TIMEZONES = [
  { value: 'UTC',                 label: 'UTC',         city: 'Coordinated Universal Time', flag: '🌐' },
  { value: 'America/New_York',    label: 'EST / EDT',   city: 'New York',        flag: '🇺🇸' },
  { value: 'America/Los_Angeles', label: 'PST / PDT',   city: 'Los Angeles',     flag: '🇺🇸' },
  { value: 'America/Chicago',     label: 'CST / CDT',   city: 'Chicago',         flag: '🇺🇸' },
  { value: 'America/Denver',      label: 'MST / MDT',   city: 'Denver',          flag: '🇺🇸' },
  { value: 'America/Sao_Paulo',   label: 'BRT',         city: 'São Paulo',       flag: '🇧🇷' },
  { value: 'Europe/London',       label: 'GMT / BST',   city: 'London',          flag: '🇬🇧' },
  { value: 'Europe/Paris',        label: 'CET / CEST',  city: 'Paris',           flag: '🇫🇷' },
  { value: 'Europe/Berlin',       label: 'CET / CEST',  city: 'Berlin',          flag: '🇩🇪' },
  { value: 'Europe/Moscow',       label: 'MSK',         city: 'Moscow',          flag: '🇷🇺' },
  { value: 'Africa/Cairo',        label: 'EET',         city: 'Cairo',           flag: '🇪🇬' },
  { value: 'Asia/Dubai',          label: 'GST',         city: 'Dubai',           flag: '🇦🇪' },
  { value: 'Asia/Kolkata',        label: 'IST',         city: 'Mumbai / Delhi',  flag: '🇮🇳' },
  { value: 'Asia/Dhaka',          label: 'BST',         city: 'Dhaka',           flag: '🇧🇩' },
  { value: 'Asia/Bangkok',        label: 'ICT',         city: 'Bangkok',         flag: '🇹🇭' },
  { value: 'Asia/Singapore',      label: 'SGT',         city: 'Singapore',       flag: '🇸🇬' },
  { value: 'Asia/Hong_Kong',      label: 'HKT',         city: 'Hong Kong',       flag: '🇭🇰' },
  { value: 'Asia/Shanghai',       label: 'CST',         city: 'Shanghai',        flag: '🇨🇳' },
  { value: 'Asia/Tokyo',          label: 'JST',         city: 'Tokyo',           flag: '🇯🇵' },
  { value: 'Asia/Seoul',          label: 'KST',         city: 'Seoul',           flag: '🇰🇷' },
  { value: 'Australia/Sydney',    label: 'AEST / AEDT', city: 'Sydney',          flag: '🇦🇺' },
  { value: 'Pacific/Auckland',    label: 'NZST / NZDT', city: 'Auckland',        flag: '🇳🇿' },
  { value: 'Pacific/Honolulu',    label: 'HST',         city: 'Honolulu',        flag: '🇺🇸' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
// Get UTC offset in hours for a timezone at the current moment
const getUtcOffset = (tz) => {
  const now = new Date();
  // Use Intl to get the offset reliably
  const formatter = new Intl.DateTimeFormat('en', {
    timeZone: tz,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value || 'UTC+0';
  // offsetPart looks like "GMT+5:30", "GMT-4", "GMT+0"
  const match = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === '+' ? 1 : -1;
  const h    = parseInt(match[2], 10);
  const m    = parseInt(match[3] || '0', 10);
  return sign * (h + m / 60);
};

const formatOffset = (tz) => {
  const diff = getUtcOffset(tz);
  const sign = diff >= 0 ? '+' : '-';
  const abs  = Math.abs(diff);
  const h    = Math.floor(abs);
  const m    = Math.round((abs - h) * 60);
  return `UTC${sign}${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
};

const formatLiveClock = (tz) => {
  const now = new Date();
  return {
    h12:  now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true,  timeZone:tz }),
    h24:  now.toLocaleTimeString('en-GB', { hour:'2-digit', minute:'2-digit', second:'2-digit', timeZone:tz }),
    date: now.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric', timeZone:tz }),
    offset: formatOffset(tz),
  };
};

// Convert a specific time (24h HH:MM) from one tz to another
const convertSpecificTime = (hour24, min, fromTz, toTz) => {
  // Get today's date in the fromTz
  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-CA', { timeZone: fromTz }); // YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);

  // Get the UTC offset for fromTz (in minutes) at this moment
  const fromOffHours = getUtcOffset(fromTz);
  const fromOffMins  = Math.round(fromOffHours * 60);

  // Convert the local time to UTC: UTC = local - offset
  const localTotalMins = hour24 * 60 + min;
  const utcTotalMins   = localTotalMins - fromOffMins;

  // Build a UTC Date from the date + utcTotalMins
  const utcDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  utcDate.setUTCMinutes(utcDate.getUTCMinutes() + utcTotalMins);

  if (isNaN(utcDate.getTime())) return null;

  // Format output in toTz
  const raw12 = utcDate.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', hour12: true, timeZone: toTz,
  });
  const h24out = utcDate.toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: toTz,
  });
  const dateOut = utcDate.toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', timeZone: toTz,
  });

  // Parse AM/PM robustly — handle narrow no-break space (U+202F) before AM/PM
  const ampmMatch = raw12.match(/(\d{1,2}:\d{2})[\s\u202f]*(AM|PM)/i);
  const timePart  = ampmMatch
    ? ampmMatch[1].padStart(5, '0')
    : raw12.replace(/[\s\u202f]*(AM|PM)/i, '').trim();
  const ampm = ampmMatch ? ampmMatch[2].toUpperCase() : 'AM';

  // Day difference between fromTz date and toTz date
  const fromDateStr = now.toLocaleDateString('en-CA', { timeZone: fromTz });
  const toDateStr   = utcDate.toLocaleDateString('en-CA', { timeZone: toTz });
  const dayDiff = Math.round(
    (new Date(toDateStr + 'T00:00:00Z') - new Date(fromDateStr + 'T00:00:00Z')) / 86400000
  );

  return { timePart, ampm, h24: h24out, dateOut, dayDiff };
};

// ─── TzSelect Component ───────────────────────────────────────────────────────
const TzSelect = ({ value, onChange, label }) => {
  const [open,   setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const ref      = useRef(null);
  const selected = TIMEZONES.find(t => t.value === value);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = TIMEZONES.filter(t =>
    t.city.toLowerCase().includes(search.toLowerCase()) ||
    t.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="tz-select-wrap" ref={ref} style={{ zIndex: open ? 9998 : 1 }}>
      {label && <div className="tz-select-label">{label}</div>}
      <button
        type="button"
        className={`tz-trigger ${open ? 'tz-trigger-open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <span className="tz-flag">{selected?.flag}</span>
        <div className="tz-trigger-info">
          <span className="tz-trigger-city">{selected?.city}</span>
          <span className="tz-trigger-abbr">{selected?.label} · {formatOffset(value)}</span>
        </div>
        <svg className={`tz-chevron ${open ? 'tz-chevron-up' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div className="tz-dropdown">
          <div className="tz-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="tz-search"
              placeholder="Search city or timezone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className="tz-list">
            {filtered.map(tz => (
              <button
                key={tz.value}
                type="button"
                className={`tz-option ${tz.value === value ? 'tz-option-active' : ''}`}
                onClick={() => { onChange(tz.value); setOpen(false); setSearch(''); }}
              >
                <span className="tz-flag">{tz.flag}</span>
                <div className="tz-option-info">
                  <span className="tz-option-city">{tz.city}</span>
                  <span className="tz-option-abbr">{tz.label} · {formatOffset(tz.value)}</span>
                </div>
                {tz.value === value && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
            {filtered.length === 0 && <div className="tz-no-results">No results found</div>}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TimezoneConverter = () => {
  // Live clock state
  const [from, setFrom] = useState('UTC');
  const [to,   setTo]   = useState('Asia/Kolkata');
  const [,     setTick] = useState(0);

  // Custom time converter state
  const [ctFrom,    setCtFrom]    = useState('UTC');
  const [ctTo,      setCtTo]      = useState('Asia/Kolkata');
  const [ctMode,    setCtMode]    = useState('24'); // '12' | '24'
  const [ctHour,    setCtHour]    = useState('');   // 1-12 or 0-23
  const [ctMin,     setCtMin]     = useState('');   // 0-59
  const [ctAmPm,    setCtAmPm]    = useState('AM'); // 'AM' | 'PM'
  const [ctResult,  setCtResult]  = useState(null);
  const [ctError,   setCtError]   = useState('');

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Live clock data
  const fromData = formatLiveClock(from);
  const toData   = formatLiveClock(to);

  const now    = new Date();
  const fromMs = new Date(now.toLocaleString('en-US', { timeZone: from })).getTime();
  const toMs   = new Date(now.toLocaleString('en-US', { timeZone: to   })).getTime();
  const diffH  = (toMs - fromMs) / 3600000;
  const diffLabel = `${diffH >= 0 ? '+' : ''}${diffH % 1 === 0 ? diffH : diffH.toFixed(1)}h`;

  const fromTz = TIMEZONES.find(t => t.value === from);
  const toTz   = TIMEZONES.find(t => t.value === to);

  const swap     = () => { setFrom(to);   setTo(from);   };
  const ctSwap   = () => { setCtFrom(ctTo); setCtTo(ctFrom); setCtResult(null); };

  const handleConvert = () => {
    setCtError('');
    setCtResult(null);

    const h = parseInt(ctHour, 10);
    const m = parseInt(ctMin || '0', 10);

    if (ctHour === '' || isNaN(h)) { setCtError('Please enter the hour.'); return; }
    if (isNaN(m) || m < 0 || m > 59) { setCtError('Minutes must be 0–59.'); return; }

    let hour24 = h;
    if (ctMode === '12') {
      if (h < 1 || h > 12) { setCtError('Hour must be 1–12 in 12-hour mode.'); return; }
      if (ctAmPm === 'AM') hour24 = h === 12 ? 0  : h;
      else                 hour24 = h === 12 ? 12 : h + 12;
    } else {
      if (h < 0 || h > 23) { setCtError('Hour must be 0–23 in 24-hour mode.'); return; }
    }

    const result = convertSpecificTime(hour24, m, ctFrom, ctTo);
    if (!result) { setCtError('Conversion failed. Check your inputs.'); return; }
    setCtResult(result);
  };

  // Display the entered time nicely in the result summary
  const enteredDisplay = (() => {
    const h = parseInt(ctHour || '0', 10);
    const m = parseInt(ctMin  || '0', 10);
    const mm = String(m).padStart(2, '0');
    if (ctMode === '12') return `${String(h).padStart(2,'0')}:${mm} ${ctAmPm}`;
    return `${String(h).padStart(2,'0')}:${mm}`;
  })();

  const ctFromTz = TIMEZONES.find(t => t.value === ctFrom);
  const ctToTz   = TIMEZONES.find(t => t.value === ctTo);

  return (
    <div className="tz-page">
      <div className="tz-container">

        {/* ── Header ── */}
        <div className="tz-header">
          <div className="tz-header-icon">🌍</div>
          <h1 className="tz-title">Timezone Converter</h1>
          <p className="tz-subtitle">Live clocks · Convert any specific time between timezones</p>
        </div>

        {/* ── Live clock selector ── */}
        <div className="tz-selector-card">
          <TzSelect value={from} onChange={setFrom} label="From" />
          <button className="tz-swap-btn" onClick={swap} title="Swap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
          </button>
          <TzSelect value={to} onChange={setTo} label="To" />
        </div>

        {/* ── Live clocks ── */}
        <div className="tz-clocks">
          <div className="tz-clock-card tz-clock-from">
            <div className="tz-clock-header">
              <span className="tz-clock-flag">{fromTz?.flag}</span>
              <div>
                <div className="tz-clock-city">{fromTz?.city}</div>
                <div className="tz-clock-offset">{fromData.offset} · {fromTz?.label}</div>
              </div>
            </div>
            <div className="tz-clock-time">{fromData.h12}</div>
            <div className="tz-clock-time24">{fromData.h24}</div>
            <div className="tz-clock-date">{fromData.date}</div>
          </div>

          <div className="tz-diff-col">
            <div className="tz-diff-arrow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
            <div className="tz-diff-badge">{diffLabel}</div>
          </div>

          <div className="tz-clock-card tz-clock-to">
            <div className="tz-clock-header">
              <span className="tz-clock-flag">{toTz?.flag}</span>
              <div>
                <div className="tz-clock-city">{toTz?.city}</div>
                <div className="tz-clock-offset">{toData.offset} · {toTz?.label}</div>
              </div>
            </div>
            <div className="tz-clock-time tz-clock-time-to">{toData.h12}</div>
            <div className="tz-clock-time24">{toData.h24}</div>
            <div className="tz-clock-date">{toData.date}</div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            CUSTOM TIME CONVERTER
        ══════════════════════════════════════════════════════ */}
        <div className="ct-card">
          <div className="ct-card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>Convert a Specific Time</span>
            <span className="ct-badge">12h &amp; 24h</span>
          </div>

          {/* ── Input format toggle ── */}
          <div className="ct-format-row">
            <span className="ct-format-label">Input Format:</span>
            <div className="ct-format-toggle">
              <button
                type="button"
                className={`ct-fmt-btn ${ctMode === '12' ? 'ct-fmt-active' : ''}`}
                onClick={() => { setCtMode('12'); setCtHour(''); setCtMin(''); setCtResult(null); setCtError(''); }}
              >
                12-Hour
              </button>
              <button
                type="button"
                className={`ct-fmt-btn ${ctMode === '24' ? 'ct-fmt-active' : ''}`}
                onClick={() => { setCtMode('24'); setCtHour(''); setCtMin(''); setCtResult(null); setCtError(''); }}
              >
                24-Hour
              </button>
            </div>
          </div>

          {/* ── From TZ + time input ── */}
          <div className="ct-row">
            <div className="ct-tz-col">
              <TzSelect value={ctFrom} onChange={(v) => { setCtFrom(v); setCtResult(null); }} label="From Timezone" />
            </div>

            <div className="ct-time-col">
              <div className="ct-time-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                Enter Time ({ctMode === '12' ? '1–12' : '0–23'} : 00–59)
              </div>

              <div className="ct-time-fields">
                {/* Hour */}
                <input
                  type="text"
                  inputMode="numeric"
                  className="ct-num-input"
                  placeholder="HH"
                  maxLength={2}
                  value={ctHour}
                  ref={el => { if (el) el._isHour = true; }}
                  id="ct-hour-input"
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setCtHour(raw);
                    setCtResult(null);
                    setCtError('');
                    // Auto-advance to minutes after 2 digits
                    if (raw.length === 2) {
                      document.getElementById('ct-min-input')?.focus();
                    }
                  }}
                />
                <span className="ct-colon">:</span>
                {/* Minute */}
                <input
                  type="text"
                  inputMode="numeric"
                  className="ct-num-input"
                  placeholder="MM"
                  maxLength={2}
                  id="ct-min-input"
                  value={ctMin}
                  onChange={e => {
                    const raw = e.target.value.replace(/\D/g, '').slice(0, 2);
                    setCtMin(raw);
                    setCtResult(null);
                    setCtError('');
                  }}
                />
                {/* AM/PM toggle — only in 12h mode */}
                {ctMode === '12' && (
                  <div className="ct-ampm-toggle">
                    <button
                      type="button"
                      className={`ct-ampm-btn ${ctAmPm === 'AM' ? 'ct-ampm-active' : ''}`}
                      onClick={() => { setCtAmPm('AM'); setCtResult(null); }}
                    >AM</button>
                    <button
                      type="button"
                      className={`ct-ampm-btn ${ctAmPm === 'PM' ? 'ct-ampm-active' : ''}`}
                      onClick={() => { setCtAmPm('PM'); setCtResult(null); }}
                    >PM</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Swap ── */}
          <div className="ct-middle-row">
            <button className="ct-swap-btn" onClick={ctSwap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
              Swap
            </button>
          </div>

          {/* ── To TZ ── */}
          <div className="ct-row">
            <div className="ct-tz-col">
              <TzSelect value={ctTo} onChange={(v) => { setCtTo(v); setCtResult(null); }} label="To Timezone" />
            </div>
            <div className="ct-time-col" />
          </div>

          {/* ── Convert button ── */}
          <button className="ct-convert-btn" onClick={handleConvert}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
            Convert Time
          </button>

          {/* ── Error ── */}
          {ctError && (
            <div className="ct-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {ctError}
            </div>
          )}

          {/* ── Result ── */}
          {ctResult && (
            <div className="ct-result">

              {/* Summary row */}
              <div className="ct-result-from">
                <span className="ct-result-flag">{ctFromTz?.flag}</span>
                <div className="ct-result-from-info">
                  <span className="ct-result-city">{ctFromTz?.city}</span>
                  <span className="ct-result-time-input">{enteredDisplay}</span>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ct-result-arrow">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span className="ct-result-flag">{ctToTz?.flag}</span>
                <div className="ct-result-from-info">
                  <span className="ct-result-city">{ctToTz?.city}</span>
                </div>
              </div>

              {/* Two output boxes */}
              <div className="ct-result-times">

                {/* 12-Hour */}
                <div className="ct-result-box ct-result-12h">
                  <div className="ct-result-format-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    12-Hour Format
                  </div>
                  <div className="ct-result-time-value">
                    {ctResult.timePart}
                    <span className="ct-result-ampm">{ctResult.ampm}</span>
                  </div>
                  <div className="ct-result-date">{ctResult.dateOut}</div>
                </div>

                {/* 24-Hour */}
                <div className="ct-result-box ct-result-24h">
                  <div className="ct-result-format-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    24-Hour Format
                  </div>
                  <div className="ct-result-time-value">{ctResult.h24}</div>
                  <div className="ct-result-date">{ctResult.dateOut}</div>
                </div>
              </div>

              {/* Day difference */}
              {ctResult.dayDiff !== 0 && (
                <div className="ct-result-daynote">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {ctResult.dayDiff > 0
                    ? `+${ctResult.dayDiff} day${ctResult.dayDiff > 1 ? 's' : ''} ahead (next day)`
                    : `${ctResult.dayDiff} day${ctResult.dayDiff < -1 ? 's' : ''} behind (previous day)`}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── World clocks ── */}
        <div className="tz-world-section">
          <div className="tz-world-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/>
            </svg>
            World Clocks
          </div>
          <div className="tz-world-grid">
            {['America/New_York','Europe/London','Asia/Dubai','Asia/Kolkata','Asia/Tokyo','Australia/Sydney'].map(tz => {
              const d = formatLiveClock(tz);
              const t = TIMEZONES.find(x => x.value === tz);
              return (
                <button
                  key={tz}
                  className={`tz-world-item ${tz === from || tz === to ? 'tz-world-active' : ''}`}
                  onClick={() => setTo(tz)}
                >
                  <span className="tz-world-flag">{t?.flag}</span>
                  <div className="tz-world-info">
                    <span className="tz-world-city">{t?.city.split('/')[0].trim()}</span>
                    <span className="tz-world-time">{d.h12.replace(':00 ',' ')}</span>
                    <span className="tz-world-time24">{d.h24}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TimezoneConverter;
