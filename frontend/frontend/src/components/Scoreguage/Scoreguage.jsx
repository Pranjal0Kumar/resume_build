import React, { useEffect, useRef } from 'react';
import '../Scoreguage/Scoreguage.css';

const ScoreGauge = ({ score }) => {
  const needleRef = useRef(null);
  const fillRef = useRef(null);
  const scoreTextRef = useRef(null);

  useEffect(() => {
    const dash = (score / 100) * 125.6;
    const angle = (score / 100) * 180 - 90;

    if (fillRef.current) {
      fillRef.current.setAttribute("stroke-dasharray", `${dash} 251.2`);
    }

    if (needleRef.current) {
      needleRef.current.setAttribute("transform", `rotate(${angle} 50 50)`);
    }

    if (scoreTextRef.current) {
      scoreTextRef.current.textContent = `${score}%`;
    }
  }, [score]);

  return (
    <div className="gauge">
      <svg viewBox="0 0 100 50" className="gauge-svg">
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#eee" strokeWidth="10"/>
        <path ref={fillRef} d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="#f2d492" strokeWidth="10" strokeDasharray="0 251.2"/>
        <line ref={needleRef} x1="50" y1="50" x2="50" y2="10" stroke="#ff5252" strokeWidth="2" transform="rotate(0 50 50)"/>
      </svg>
      <div className="score-text" ref={scoreTextRef}>0%</div>
    </div>
  );
};

export default ScoreGauge;
