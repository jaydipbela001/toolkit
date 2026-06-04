import { useState, useCallback, useRef, useEffect } from 'react';
import './JsonFormatter.css';

// ─── Diff Engine ─────────────────────────────────────────────────────────────

// LCS-based line diff
// Returns array of { type: 'equal'|'add'|'remove', oldLine, newLine, oldNum, newNum }
const computeSideBySideDiff = (oldText, newText) => {
  const oldLines = oldText === '' ? [] : oldText.split('\n');
  const newLines = newText === '' ? [] : newText.split('\n');
  const m = oldLines.length;
  const n = newLines.length;

  // LCS DP
  const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = oldLines[i-1] === newLines[j-1]
        ? dp[i-1][j-1] + 1
        : Math.max(dp[i-1][j], dp[i][j-1]);

  // Backtrack into raw ops
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldLines[i-1] === newLines[j-1]) {
      ops.unshift({ type: 'equal', old: oldLines[i-1], new: newLines[j-1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) {
      ops.unshift({ type: 'add', old: null, new: newLines[j-1] });
      j--;
    } else {
      ops.unshift({ type: 'remove', old: oldLines[i-1], new: null });
      i--;
    }
  }

  // Pair up consecutive removes+adds as 'change' rows for side-by-side
  const rows = [];
  let k = 0;
  while (k < ops.length) {
    const op = ops[k];
    if (op.type === 'remove') {
      // Collect a block of removes then a block of adds
      const removes = [];
      while (k < ops.length && ops[k].type === 'remove') removes.push(ops[k++].old);
      const adds = [];
      while (k < ops.length && ops[k].type === 'add') adds.push(ops[k++].new);
      const maxLen = Math.max(removes.length, adds.length);
      for (let r = 0; r < maxLen; r++) {
        rows.push({
          type: removes[r] !== undefined && adds[r] !== undefined ? 'change'
              : removes[r] !== undefined ? 'remove' : 'add',
          oldLine: removes[r] ?? null,
          newLine: adds[r] ?? null,
        });
      }
    } else if (op.type === 'add') {
      rows.push({ type: 'add', oldLine: null, newLine: op.new });
      k++;
    } else {
      rows.push({ type: 'equal', oldLine: op.old, newLine: op.new });
      k++;
    }
  }

  // Assign line numbers
  let oldNum = 0, newNum = 0;
  rows.forEach(r => {
    if (r.oldLine !== null) r.oldNum = ++oldNum; else r.oldNum = null;
    if (r.newLine !== null) r.newNum = ++newNum; else r.newNum = null;
  });

  return rows;
};

// Inline word-level diff for a pair of changed lines
const inlineWordDiff = (oldLine, newLine) => {
  if (oldLine === null || newLine === null) return { oldHtml: oldLine ?? '', newHtml: newLine ?? '' };
  const ow = oldLine.split(/(\s+|[^a-zA-Z0-9])/);
  const nw = newLine.split(/(\s+|[^a-zA-Z0-9])/);
  const m = ow.length, n = nw.length;
  const dp = Array.from({ length: m+1 }, () => new Int32Array(n+1));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = ow[i-1] === nw[j-1] ? dp[i-1][j-1]+1 : Math.max(dp[i-1][j], dp[i][j-1]);
  const ops = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && ow[i-1] === nw[j-1]) { ops.unshift({ t:'eq', v:ow[i-1] }); i--; j--; }
    else if (j > 0 && (i === 0 || dp[i][j-1] >= dp[i-1][j])) { ops.unshift({ t:'add', v:nw[j-1] }); j--; }
    else { ops.unshift({ t:'rem', v:ow[i-1] }); i--; }
  }
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  let oldHtml = '', newHtml = '';
  ops.forEach(o => {
    if (o.t === 'eq')  { oldHtml += esc(o.v); newHtml += esc(o.v); }
    else if (o.t === 'rem') oldHtml += `<mark class="diff-inline-rem">${esc(o.v)}</mark>`;
    else newHtml += `<mark class="diff-inline-add">${esc(o.v)}</mark>`;
  });
  return { oldHtml, newHtml };
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatJSON = (raw) => {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed, null, 2);
};

const minifyJSON = (raw) => {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed);
};

const validateJSON = (raw) => {
  JSON.parse(raw); // throws on invalid
  return 'Valid JSON ✓';
};

// Proper token-based XML formatter
const formatXML = (raw) => {
  // Validate first
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw.trim(), 'application/xml');
  const parseErr = doc.querySelector('parsererror');
  if (parseErr) throw new Error(parseErr.textContent.split('\n')[0]);

  // Tokenise: split on every tag boundary, keeping tags
  const tokens = raw.trim().match(/(<[^>]+>|[^<]+)/g) || [];
  const tab = '  ';
  let indent = 0;
  let out = '';

  tokens.forEach((token) => {
    const t = token.trim();
    if (!t) return;

    if (/^<\?/.test(t)) {
      // Processing instruction: <?xml ... ?>
      out += tab.repeat(indent) + t + '\n';
    } else if (/^<!--/.test(t)) {
      // Comment
      out += tab.repeat(indent) + t + '\n';
    } else if (/^<\//.test(t)) {
      // Closing tag — dedent first
      indent = Math.max(0, indent - 1);
      out += tab.repeat(indent) + t + '\n';
    } else if (/\/>$/.test(t)) {
      // Self-closing tag
      out += tab.repeat(indent) + t + '\n';
    } else if (/^<[^/!?]/.test(t)) {
      // Opening tag
      out += tab.repeat(indent) + t + '\n';
      indent++;
    } else {
      // Text content — attach to current indent
      const text = token.trim();
      if (text) out += tab.repeat(indent) + text + '\n';
    }
  });

  // Post-process: collapse <tag>\n  text\n</tag> → <tag>text</tag>
  return out
    .trim()
    .replace(/(<[^/][^>]*>)\n(\s*)([^<\n]+)\n\s*(<\/[^>]+>)/g, '$1$3$4');
};

const minifyXML = (raw) => raw.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();

const validateXML = (raw) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(err.textContent.split('\n')[0]);
  return 'Valid XML ✓';
};

// CSS formatter
const formatCSS = (raw) => {
  return raw
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/;\s*/g, ';\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/  \n}/g, '\n}')
    .trim();
};

const minifyCSS = (raw) =>
  raw.replace(/\s*([{}:;,])\s*/g, '$1').replace(/\s+/g, ' ').trim();

const validateCSS = (raw) => {
  const braces = (raw.match(/{/g) || []).length - (raw.match(/}/g) || []).length;
  if (braces !== 0) throw new Error('Mismatched braces in CSS');
  return 'CSS structure looks valid ✓';
};

// HTML formatter
const formatHTML = (raw) => {
  let formatted = '';
  let indent = 0;
  const tab = '  ';
  const voidTags = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  raw
    .replace(/>\s*</g, '><')
    .split(/(<[^>]+>)/)
    .filter(Boolean)
    .forEach((node) => {
      const trimmed = node.trim();
      if (!trimmed) return;
      if (/^<\//.test(trimmed)) {
        indent = Math.max(0, indent - 1);
        formatted += tab.repeat(indent) + trimmed + '\n';
      } else if (/^<[a-zA-Z]/.test(trimmed)) {
        const tag = (trimmed.match(/^<([a-zA-Z0-9]+)/) || [])[1] || '';
        formatted += tab.repeat(indent) + trimmed + '\n';
        if (!voidTags.has(tag.toLowerCase()) && !/\/>$/.test(trimmed)) indent++;
      } else {
        formatted += tab.repeat(indent) + trimmed + '\n';
      }
    });
  return formatted.trim();
};

const minifyHTML = (raw) => raw.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();

const validateHTML = (raw) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(raw, 'text/html');
  const errs = doc.querySelectorAll('parsererror');
  if (errs.length) throw new Error('HTML parse error detected');
  return 'HTML structure looks valid ✓';
};

// SQL formatter (basic)
const SQL_KEYWORDS = ['SELECT','FROM','WHERE','JOIN','LEFT JOIN','RIGHT JOIN','INNER JOIN','ON','AND','OR','NOT','IN','IS','NULL','ORDER BY','GROUP BY','HAVING','LIMIT','OFFSET','INSERT INTO','VALUES','UPDATE','SET','DELETE FROM','CREATE TABLE','DROP TABLE','ALTER TABLE','AS','DISTINCT','COUNT','SUM','AVG','MIN','MAX','UNION','ALL'];

const formatSQL = (raw) => {
  let result = raw.trim();
  SQL_KEYWORDS.forEach((kw) => {
    const re = new RegExp(`\\b${kw}\\b`, 'gi');
    result = result.replace(re, '\n' + kw.toUpperCase());
  });
  return result
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
};

const minifySQL = (raw) => raw.replace(/\s+/g, ' ').trim();

const validateSQL = (raw) => {
  if (!/SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER/i.test(raw))
    throw new Error('No recognizable SQL statement found');
  return 'SQL statement recognized ✓';
};

// ─── Syntax Highlighters ────────────────────────────────────────────────────

const highlightJSON = (json) => {
  if (!json) return '';
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'hl-number';
      if (/^"/.test(match)) cls = /:$/.test(match) ? 'hl-key' : 'hl-string';
      else if (/true|false/.test(match)) cls = 'hl-bool';
      else if (/null/.test(match)) cls = 'hl-null';
      return `<span class="${cls}">${match}</span>`;
    });
};

const highlightXML = (xml) => {
  if (!xml) return '';
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w:-]+)/g, '$1<span class="hl-key">$2</span>')
    .replace(/([\w:-]+)(=)(".*?")/g, '<span class="hl-attr">$1</span>$2<span class="hl-string">$3</span>');
};

const highlightCSS = (css) => {
  if (!css) return '';
  return css
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/([\w-]+)\s*:/g, '<span class="hl-key">$1</span>:')
    .replace(/:\s*([^;{}\n]+)/g, ': <span class="hl-string">$1</span>');
};

const highlightHTML = (html) => highlightXML(html);

const highlightSQL = (sql) => {
  if (!sql) return '';
  const kws = SQL_KEYWORDS.join('|');
  return sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(new RegExp(`\\b(${kws})\\b`, 'gi'), '<span class="hl-key">$1</span>')
    .replace(/'([^']*)'/g, '<span class="hl-string">\'$1\'</span>')
    .replace(/\b(\d+)\b/g, '<span class="hl-number">$1</span>');
};

// ─── Tab config ─────────────────────────────────────────────────────────────

const DIFF_TAB = { id: 'diff', label: 'Diff Checker', icon: '±', isDiff: true };

const TABS = [
  {
    id: 'json',
    label: 'JSON',
    icon: '{ }',
    placeholder: 'Paste your JSON here...\nExample: {"name":"John","age":30}',
    sample: JSON.stringify({ name: 'John Doe', age: 30, email: 'john@example.com', address: { city: 'New York', country: 'USA' }, hobbies: ['reading', 'coding'] }, null, 2),
    format: formatJSON,
    minify: minifyJSON,
    validate: validateJSON,
    highlight: highlightJSON,
  },
  {
    id: 'xml',
    label: 'XML',
    icon: '</>',
    placeholder: 'Paste your XML here...\nExample: <root><item id="1">Hello</item></root>',
    sample: `<catalog>\n  <book id="1">\n    <title>Learning XML</title>\n    <author>John Doe</author>\n    <price>29.99</price>\n  </book>\n  <book id="2">\n    <title>Advanced XML</title>\n    <author>Jane Smith</author>\n    <price>39.99</price>\n  </book>\n</catalog>`,
    format: formatXML,
    minify: minifyXML,
    validate: validateXML,
    highlight: highlightXML,
  },
  {
    id: 'css',
    label: 'CSS',
    icon: '#{}',
    placeholder: 'Paste your CSS here...\nExample: .btn{color:red;padding:10px}',
    sample: `.container{max-width:1200px;margin:0 auto;padding:0 1.5rem}.btn{display:inline-flex;align-items:center;padding:.875rem 1.75rem;font-size:1rem;font-weight:600;border:none;border-radius:16px;cursor:pointer}`,
    format: formatCSS,
    minify: minifyCSS,
    validate: validateCSS,
    highlight: highlightCSS,
  },
  {
    id: 'html',
    label: 'HTML',
    icon: '<h>',
    placeholder: 'Paste your HTML here...\nExample: <div><p>Hello</p></div>',
    sample: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Sample</title></head><body><div class="container"><h1>Hello World</h1><p>This is a sample HTML document.</p></div></body></html>`,
    format: formatHTML,
    minify: minifyHTML,
    validate: validateHTML,
    highlight: highlightHTML,
  },
  {
    id: 'sql',
    label: 'SQL',
    icon: 'SQL',
    placeholder: 'Paste your SQL here...\nExample: SELECT * FROM users WHERE id=1',
    sample: `SELECT u.id, u.name, u.email, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 GROUP BY u.id ORDER BY order_count DESC LIMIT 10`,
    format: formatSQL,
    minify: minifySQL,
    validate: validateSQL,
    highlight: highlightSQL,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────


const ALL_TABS_LIST = [...TABS, DIFF_TAB];

const JsonFormatter = () => {
  const [activeTab, setActiveTab] = useState('json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);
  const [lineCount, setLineCount] = useState({ input: 0, output: 0 });

  // Diff state
  const [diffLeft, setDiffLeft]     = useState('');
  const [diffRight, setDiffRight]   = useState('');
  const [diffResult, setDiffResult] = useState(null);
  const [diffIgnoreCase, setDiffIgnoreCase]   = useState(false);
  const [diffIgnoreSpace, setDiffIgnoreSpace] = useState(false);
  const [copiedLeft,  setCopiedLeft]  = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [copiedResult, setCopiedResult] = useState(false);

  const isDiff = activeTab === 'diff';
  const tab    = TABS.find((t) => t.id === activeTab);

  const updateLineCount = useCallback((inp, out) => {
    setLineCount({
      input:  inp ? inp.split('\n').length : 0,
      output: out ? out.split('\n').length : 0,
    });
  }, []);

  const handleInput = (val) => {
    setInput(val);
    updateLineCount(val, output);
    setStatus(null);
  };

  const run = (action) => {
    setStatus(null);
    setOutput('');
    if (!input.trim()) {
      setStatus({ type: 'error', msg: `Please enter some ${tab.label} to ${action}` });
      return;
    }
    try {
      let result = '';
      if (action === 'format')       result = tab.format(input);
      else if (action === 'minify')  result = tab.minify(input);
      else if (action === 'validate') {
        const msg = tab.validate(input);
        setStatus({ type: 'success', msg });
        return;
      }
      setOutput(result);
      updateLineCount(input, result);
      setStatus({ type: 'info', msg: `${tab.label} ${action}ted successfully` });
    } catch (err) {
      setStatus({ type: 'error', msg: `Invalid ${tab.label}: ${err.message}` });
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  };

  const loadSample = () => {
    setInput(tab.sample);
    setOutput('');
    setStatus(null);
    updateLineCount(tab.sample, '');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setStatus(null);
    setLineCount({ input: 0, output: 0 });
  };

  const switchTab = (id) => {
    setActiveTab(id);
    setInput('');
    setOutput('');
    setStatus(null);
    setLineCount({ input: 0, output: 0 });
    setDiffResult(null);
  };

  // ── Diff handlers ─────────────────────────────────────────────────────────
  const leftScrollRef  = useRef(null);
  const rightScrollRef = useRef(null);
  const syncingRef     = useRef(false);

  const syncScroll = (from, to) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    if (to.current) {
      to.current.scrollTop  = from.current.scrollTop;
      to.current.scrollLeft = from.current.scrollLeft;
    }
    syncingRef.current = false;
  };

  const runDiff = () => {
    let a = diffLeft;
    let b = diffRight;
    if (diffIgnoreCase)  { a = a.toLowerCase(); b = b.toLowerCase(); }
    if (diffIgnoreSpace) {
      a = a.split('\n').map(l => l.trim()).join('\n');
      b = b.split('\n').map(l => l.trim()).join('\n');
    }
    const rows    = computeSideBySideDiff(a, b);
    const added   = rows.filter(r => r.type === 'add'    || r.type === 'change').length;
    const removed = rows.filter(r => r.type === 'remove' || r.type === 'change').length;
    const equal   = rows.filter(r => r.type === 'equal').length;
    setDiffResult({ rows, stats: { added, removed, equal } });
  };

  const clearDiff = () => {
    setDiffLeft('');
    setDiffRight('');
    setDiffResult(null);
  };

  const swapDiff = () => {
    setDiffLeft(diffRight);
    setDiffRight(diffLeft);
    setDiffResult(null);
  };

  const copyDiff = async (text, side) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (side === 'left')   { setCopiedLeft(true);   setTimeout(() => setCopiedLeft(false),   2000); }
      if (side === 'right')  { setCopiedRight(true);  setTimeout(() => setCopiedRight(false),  2000); }
      if (side === 'result') { setCopiedResult(true); setTimeout(() => setCopiedResult(false), 2000); }
    } catch { /* ignore */ }
  };

  // Build plain-text result for copying
  const diffResultText = () => {
    if (!diffResult) return '';
    return diffResult.rows.map(row => {
      const sign = row.type === 'add' || row.type === 'change'
        ? '+ ' : row.type === 'remove' ? '- ' : '  ';
      const left  = row.oldLine !== null ? `${sign}${row.oldLine}` : '';
      const right = row.newLine !== null ? `${row.type === 'add' ? '+ ' : row.type === 'change' ? '+ ' : '  '}${row.newLine}` : '';
      return row.type === 'equal'
        ? `  ${row.oldLine}`
        : [row.oldLine !== null ? `- ${row.oldLine}` : '', row.newLine !== null ? `+ ${row.newLine}` : '']
            .filter(Boolean).join('\n');
    }).join('\n');
  };

  const esc = s => (s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const renderSideBySide = (rows) => {
    return rows.map((row, idx) => {
      let leftCls  = 'sbs-cell';
      let rightCls = 'sbs-cell';
      let leftHtml  = esc(row.oldLine ?? '');
      let rightHtml = esc(row.newLine ?? '');

      if (row.type === 'equal') {
        leftCls  += ' sbs-equal';
        rightCls += ' sbs-equal';
      } else if (row.type === 'remove') {
        leftCls  += ' sbs-remove';
        rightCls += ' sbs-empty';
      } else if (row.type === 'add') {
        leftCls  += ' sbs-empty';
        rightCls += ' sbs-add';
      } else if (row.type === 'change') {
        leftCls  += ' sbs-remove';
        rightCls += ' sbs-add';
        const { oldHtml, newHtml } = inlineWordDiff(row.oldLine, row.newLine);
        leftHtml  = oldHtml;
        rightHtml = newHtml;
      }

      return (
        <div key={idx} className="sbs-row">
          {/* Left side */}
          <div className={leftCls}>
            <span className="sbs-ln">{row.oldNum ?? ''}</span>
            <span className="sbs-sign">
              {row.type === 'remove' || row.type === 'change' ? '−' : row.type === 'equal' ? '' : ''}
            </span>
            <span
              className="sbs-text"
              dangerouslySetInnerHTML={{ __html: leftHtml }}
            />
          </div>
          {/* Right side */}
          <div className={rightCls}>
            <span className="sbs-ln">{row.newNum ?? ''}</span>
            <span className="sbs-sign">
              {row.type === 'add' || row.type === 'change' ? '+' : ''}
            </span>
            <span
              className="sbs-text"
              dangerouslySetInnerHTML={{ __html: rightHtml }}
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fmt-page">

      <div className="fmt-header">
        <h1 className="fmt-title">
          <span className="fmt-title-icon">⚡</span>
          Code Formatter &amp; Validator
        </h1>
        <p className="fmt-subtitle">
          Format · Minify · Validate JSON / XML / CSS / HTML / SQL — and compare any two texts with Diff Checker
        </p>
      </div>

      <div className="fmt-tabs-wrap">
        <div className="fmt-tabs">
          {ALL_TABS_LIST.map((t) => (
            <button
              key={t.id}
              className={`fmt-tab ${activeTab === t.id ? 'active' : ''} ${t.isDiff ? 'fmt-tab-diff' : ''}`}
              onClick={() => switchTab(t.id)}
            >
              <span className="fmt-tab-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {isDiff ? (
        <div className="diff-page">

          {/* Options bar */}
          <div className="diff-options-bar">
            <div className="diff-checkboxes">
              <label className="diff-check">
                <input type="checkbox" checked={diffIgnoreCase}
                  onChange={e => { setDiffIgnoreCase(e.target.checked); setDiffResult(null); }} />
                Ignore case
              </label>
              <label className="diff-check">
                <input type="checkbox" checked={diffIgnoreSpace}
                  onChange={e => { setDiffIgnoreSpace(e.target.checked); setDiffResult(null); }} />
                Ignore leading/trailing spaces
              </label>
            </div>
            <div className="diff-options-right">
              <button className="diff-swap-btn-top" onClick={swapDiff} title="Swap texts">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
                  <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
                </svg>
                Swap
              </button>
              <button className="diff-clear-btn-top" onClick={clearDiff}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                </svg>
                Clear
              </button>
            </div>
          </div>

          {/* Two input panels */}
          <div className="diff-inputs">
            <div className="diff-input-panel">
              <div className="diff-input-header diff-input-header-remove">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Original Text</span>
                <span className="diff-char-count">
                  {diffLeft.length} chars &middot; {diffLeft ? diffLeft.split('\n').length : 0} lines
                </span>
                <button
                  className={`diff-copy-btn ${copiedLeft ? 'diff-copy-ok' : ''}`}
                  onClick={() => copyDiff(diffLeft, 'left')}
                  disabled={!diffLeft}
                  title="Copy original text"
                >
                  {copiedLeft ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  )}
                  {copiedLeft ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                className="fmt-textarea diff-textarea"
                value={diffLeft}
                onChange={e => { setDiffLeft(e.target.value); setDiffResult(null); }}
                placeholder={"Paste your original text, paragraph, code, config...\n\nExample:\nThe quick brown fox\njumps over the lazy dog."}
                spellCheck={false}
              />
            </div>

            <div className="diff-input-panel">
              <div className="diff-input-header diff-input-header-add">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Changed Text</span>
                <span className="diff-char-count">
                  {diffRight.length} chars &middot; {diffRight ? diffRight.split('\n').length : 0} lines
                </span>
                <button
                  className={`diff-copy-btn ${copiedRight ? 'diff-copy-ok' : ''}`}
                  onClick={() => copyDiff(diffRight, 'right')}
                  disabled={!diffRight}
                  title="Copy changed text"
                >
                  {copiedRight ? (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                  )}
                  {copiedRight ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <textarea
                className="fmt-textarea diff-textarea"
                value={diffRight}
                onChange={e => { setDiffRight(e.target.value); setDiffResult(null); }}
                placeholder={"Paste your modified text, paragraph, code, config...\n\nExample:\nThe quick red fox\njumps over the lazy cat."}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Compare button */}
          <div className="diff-actions">
            <button className="diff-compare-btn" onClick={runDiff}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Find Differences
            </button>
          </div>

          {/* ── Side-by-side result ── */}
          {diffResult && (
            <div className="diff-result">

              {/* Stats header */}
              <div className="diff-result-header">
                <div className="diff-result-stats">
                  <span className="diff-stat-pill diff-stat-remove">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {diffResult.stats.removed} removal{diffResult.stats.removed !== 1 ? 's' : ''}
                  </span>
                  <span className="diff-stat-pill diff-stat-add">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    {diffResult.stats.added} addition{diffResult.stats.added !== 1 ? 's' : ''}
                  </span>
                  {diffResult.stats.added === 0 && diffResult.stats.removed === 0 && (
                    <span className="diff-stat-pill diff-stat-same">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                      Identical
                    </span>
                  )}
                </div>
                <div className="diff-result-header-right">
                  <button
                    className={`diff-copy-result-btn ${copiedResult ? 'diff-copy-ok' : ''}`}
                    onClick={() => copyDiff(diffResultText(), 'result')}
                    title="Copy diff as unified text"
                  >
                    {copiedResult ? (
                      <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied!</>
                    ) : (
                      <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy Diff</>
                    )}
                  </button>
                  <div className="diff-result-cols">
                    <div className="diff-col-label diff-col-label-remove">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                      Original
                      <span className="diff-col-lines">{diffLeft.split('\n').length} lines</span>
                    </div>
                    <div className="diff-col-label diff-col-label-add">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                      Changed
                      <span className="diff-col-lines">{diffRight.split('\n').length} lines</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-side view */}
              <div className="sbs-container">
                {renderSideBySide(diffResult.rows)}
              </div>
            </div>
          )}

          {/* Info cards */}
          <div className="fmt-info-row">
            <div className="fmt-info-card">
              <div className="fmt-info-icon">📄</div>
              <div><strong>Any Text</strong><p>Compare paragraphs, code, configs, logs — anything</p></div>
            </div>
            <div className="fmt-info-card">
              <div className="fmt-info-icon">🔴</div>
              <div><strong>Removals</strong><p>Red rows show lines removed from the original</p></div>
            </div>
            <div className="fmt-info-card">
              <div className="fmt-info-icon">🟢</div>
              <div><strong>Additions</strong><p>Green rows show lines added in the changed text</p></div>
            </div>
            <div className="fmt-info-card">
              <div className="fmt-info-icon">✏️</div>
              <div><strong>Inline Changes</strong><p>Modified lines highlight exact word-level differences</p></div>
            </div>
          </div>
        </div>

      ) : (
        <>
          <div className="fmt-workspace">
            <div className="fmt-panel fmt-panel-left">
              <div className="fmt-panel-header">
                <div className="fmt-panel-title">
                  <span className="fmt-dot fmt-dot-blue"></span>
                  Input
                  {lineCount.input > 0 && (
                    <span className="fmt-line-count">{lineCount.input} lines</span>
                  )}
                </div>
                <div className="fmt-panel-actions">
                  <button className="fmt-btn-ghost" onClick={loadSample}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    Sample
                  </button>
                  <button className="fmt-btn-ghost fmt-btn-danger" onClick={clearAll}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                    </svg>
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                className="fmt-textarea"
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                placeholder={tab.placeholder}
                spellCheck={false}
              />
            </div>

            <div className="fmt-controls">
              <button className="fmt-action-btn fmt-action-primary" onClick={() => run('format')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="21" y1="10" x2="7" y2="10"/>
                  <line x1="21" y1="6" x2="3" y2="6"/>
                  <line x1="21" y1="14" x2="3" y2="14"/>
                  <line x1="21" y1="18" x2="7" y2="18"/>
                </svg>
                <span>Format</span>
              </button>
              <button className="fmt-action-btn fmt-action-secondary" onClick={() => run('minify')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/>
                </svg>
                <span>Minify</span>
              </button>
              <button className="fmt-action-btn fmt-action-validate" onClick={() => run('validate')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Validate</span>
              </button>
            </div>

            <div className="fmt-panel fmt-panel-right">
              <div className="fmt-panel-header">
                <div className="fmt-panel-title">
                  <span className="fmt-dot fmt-dot-green"></span>
                  Output
                  {lineCount.output > 0 && (
                    <span className="fmt-line-count">{lineCount.output} lines</span>
                  )}
                </div>
                <div className="fmt-panel-actions">
                  <button
                    className={`fmt-btn-ghost ${copied ? 'fmt-btn-copied' : ''}`}
                    onClick={copyOutput}
                    disabled={!output}
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {status && (
                <div className={`fmt-status fmt-status-${status.type}`}>
                  {status.type === 'error' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                  )}
                  {status.type === 'success' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                  {status.type === 'info' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  )}
                  {status.msg}
                </div>
              )}

              <pre className="fmt-output">
                {output ? (
                  <code dangerouslySetInnerHTML={{ __html: tab.highlight(output) }} />
                ) : (
                  <span className="fmt-output-placeholder">
                    Output will appear here after formatting...
                  </span>
                )}
              </pre>
            </div>
          </div>

          <div className="fmt-info-row">
            <div className="fmt-info-card">
              <div className="fmt-info-icon">🎯</div>
              <div><strong>Format</strong><p>Beautify and indent your code for readability</p></div>
            </div>
            <div className="fmt-info-card">
              <div className="fmt-info-icon">⚡</div>
              <div><strong>Minify</strong><p>Compress code by removing whitespace</p></div>
            </div>
            <div className="fmt-info-card">
              <div className="fmt-info-icon">✅</div>
              <div><strong>Validate</strong><p>Check your code for syntax errors</p></div>
            </div>
            <div className="fmt-info-card">
              <div className="fmt-info-icon">🔒</div>
              <div><strong>Private</strong><p>All processing happens in your browser</p></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default JsonFormatter;
