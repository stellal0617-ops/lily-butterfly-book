import React, { useEffect, useRef, useState } from 'react';
import { StoryPage } from './StoryPage.jsx';
const TURN_MS = 650;
export default function Book({ pages, current, setCurrent, completedGames, onComplete }) {
  const [turn, setTurn] = useState(null);
  const busy = useRef(false);
  const go = (direction) => {
    if (busy.current) return;
    const to = current + direction;
    if (to < 0 || to >= pages.length) return;
    busy.current = true;
    setTurn({from:current,to,direction});
    window.setTimeout(() => {setCurrent(to);setTurn(null);busy.current = false;}, TURN_MS);
  };
  useEffect(() => {
    function onKey(e) {
      if (['INPUT','TEXTAREA','BUTTON','SELECT'].includes(document.activeElement?.tagName)) return;
      if(e.key === 'ArrowRight') go(1);
      if(e.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown',onKey);
    return () => window.removeEventListener('keydown',onKey);
  },[current,pages.length]);
  const showPage = i => <StoryPage page={pages[i]} onComplete={onComplete}/>;
  return <section className="book-shell" aria-label="Interactive storybook">
    <div className="book-topline">✳ {pages[current].chapterLabel || 'THE BUTTERFLY MYSTERY'} ✳</div>
    <div className="book-frame"><div className="book-spine"/><div className="book-viewport">
      {!turn ? showPage(current) : <><div className="under-sheet">{showPage(turn.to)}</div><div className={`flipping-sheet ${turn.direction === 1 ? 'flip-next' : 'flip-prev'}`}>{showPage(turn.from)}</div></>}
    </div></div>
    <nav className="book-controls" aria-label="Turn pages">
      <button disabled={current===0 || !!turn} onClick={()=>go(-1)}>← Previous</button>
      <div className="progress-area"><small>PAGE {current+1} OF {pages.length}</small><div className="progress-track"><div style={{width:`${(current+1)/pages.length*100}%`}}/></div></div>
      <button disabled={current===pages.length-1 || !!turn} onClick={()=>go(1)}>Next →</button>
    </nav>
    <p className="navigation-hint">Use the arrows to turn pages. Play the games right inside the book. {completedGames.length}/3 demo games explored.</p>
  </section>;
}
