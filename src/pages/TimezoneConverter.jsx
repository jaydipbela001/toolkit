import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './TimezoneConverter.css';

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'Denver (MST/MDT)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Mumbai/New Delhi (IST)' },
  { value: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Seoul', label: 'Seoul (KST)' },
  { value: 'Asia/Hong_Kong', label: 'Hong Kong (HKT)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Pacific/Auckland', label: 'Auckland (NZST/NZDT)' },
  { value: 'Pacific/Honolulu', label: 'Honolulu (HST)' },
];

const TimezoneConverter = () => {
  const [fromTimezone, setFromTimezone] = useState('UTC');
  const [toTimezone, setToTimezone] = useState('America/New_York');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [convertedTime, setConvertedTime] = useState(null);
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.page-header',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo('.timezone-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    convertTime();
    
    // Update time every second
    const interval = setInterval(() => {
      convertTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [fromTimezone, toTimezone]);

  const convertTime = () => {
    const now = new Date();
    setCurrentTime(now);

    const fromTime = new Date(now.toLocaleString('en-US', { timeZone: fromTimezone }));
    const toTime = new Date(now.toLocaleString('en-US', { timeZone: toTimezone }));

    const offset = (toTime - fromTime) / (1000 * 60 * 60);

    setConvertedTime({
      from: formatTime(fromTime, fromTimezone),
      to: formatTime(toTime, toTimezone),
      offset: offset.toFixed(1),
    });
  };

  const formatTime = (date, timezone) => {
    return {
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: timezone,
      }),
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: timezone,
      }),
      zone: timezone.split('/')[1]?.replace(/_/g, ' ') || timezone,
    };
  };

  const getTimezoneLabel = (value) => {
    return timezones.find((tz) => tz.value === value)?.label || value;
  };

  return (
    <div className="page timezone-converter" ref={pageRef}>
      <div className="container tool-container">
        <div className="page-header">
          <h1>Timezone Converter</h1>
          <p>Convert time between different timezones worldwide</p>
        </div>

        <div className="timezone-card">
          <div className="timezone-selectors">
            <div className="form-group">
              <label htmlFor="fromTimezone">From Timezone</label>
              <select
                id="fromTimezone"
                value={fromTimezone}
                onChange={(e) => setFromTimezone(e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="swap-button"
              onClick={() => {
                setFromTimezone(toTimezone);
                setToTimezone(fromTimezone);
              }}
              aria-label="Swap timezones"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 16V4M7 4L3 8M7 4l4 4M17 8v12m0-12l4 4m-4-4l-4 4"/>
              </svg>
            </button>

            <div className="form-group">
              <label htmlFor="toTimezone">To Timezone</label>
              <select
                id="toTimezone"
                value={toTimezone}
                onChange={(e) => setToTimezone(e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {convertedTime && (
            <div className="timezone-result">
              <div className="time-display from-time">
                <div className="time-label">{getTimezoneLabel(fromTimezone)}</div>
                <div className="time-value">{convertedTime.from.time}</div>
                <div className="time-date">{convertedTime.from.date}</div>
              </div>

              <div className="time-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span className="offset-badge">
                  {convertedTime.offset > 0 ? '+' : ''}{convertedTime.offset}h
                </span>
              </div>

              <div className="time-display to-time">
                <div className="time-label">{getTimezoneLabel(toTimezone)}</div>
                <div className="time-value">{convertedTime.to.time}</div>
                <div className="time-date">{convertedTime.to.date}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimezoneConverter;
