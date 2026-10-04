import React, { useState, useEffect, useRef } from 'react';
import { CLIParser } from '../services/CLIParser';

const TerminalPage = () => {
  const [history, setHistory] = useState([
    { type: 'output', text: 'NEXORA TERMINAL - SIMULATION MODE' },
    { type: 'output', text: "Type 'help' for available commands." }
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!input.trim()) return;

      const newHistory = [...history, { type: 'input', text: `nexora> ${input}` }];
      const output = CLIParser.parse(input);

      if (output === 'CLEAR') {
        setHistory([]);
      } else {
        newHistory.push({ type: 'output', text: output });
        setHistory(newHistory);
      }

      setCmdHistory([...cmdHistory, input]);
      setHistoryIdx(-1);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length > 0) {
        const nextIdx = historyIdx < cmdHistory.length - 1 ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInput(cmdHistory[cmdHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInput('');
      }
    }
  };

  return (
    <div className="terminal-container" style={{ height: 'calc(100vh - 120px)' }}>
      {history.map((line, idx) => (
        <div key={idx} className="terminal-line" style={{ color: line.type === 'input' ? 'var(--text-main)' : 'inherit', whiteSpace: 'pre-wrap' }}>
          {line.text}
        </div>
      ))}
      <div className="flex items-center mt-2">
        <span className="terminal-prompt">nexora&gt;</span>
        <input 
          type="text" 
          className="terminal-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck="false"
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

export default TerminalPage;
