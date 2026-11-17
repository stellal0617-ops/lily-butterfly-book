import React, {useState} from 'react';
const mistakes = [
  {id:'plastic',label:'Plastic flower',icon:'🪴',explanation:'A plastic flower cannot feed butterflies.'},
  {id:'night',label:'Nighttime butterfly',icon:'🌙',explanation:'We should check whether this scene matches our daytime observations.'},
  {id:'nectar',label:'No nectar flowers',icon:'🌱',explanation:'Butterflies need access to nectar-rich flowers.'}
];
export default function Game({onComplete}) {
  const [found,setFound] = useState([]);
  const choose = id => {const next=found.includes(id)?found:[...found,id];setFound(next);if(next.length===mistakes.length)onComplete('chapter1');};
  return <section className="mini-game"><div className="game-label">INTERACTIVE DEMO 01 · MACHINE LEARNING</div><p>Tap the three clues in Pip's garden picture that need checking.</p><div className="choice-grid">{mistakes.map(m=><button key={m.id} className={found.includes(m.id)?'choice-tile found':'choice-tile'} onClick={()=>choose(m.id)}><span className="choice-icon">{m.icon}</span>{m.label} {found.includes(m.id)?'✓':'○'}</button>)}</div><p className="game-feedback" aria-live="polite">{found.length===3?'Great detective work! Examples matter when AI learns. 🌼':`${found.length}/3 clues found. ${found.length?mistakes.find(m=>m.id===found[found.length-1])?.explanation:'Choose a clue to investigate.'}`}</p></section>;
}
