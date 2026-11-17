import React,{useState} from 'react';
const flowers=[{id:'sunflower',icon:'🌻',label:'Sunflowers'},{id:'lavender',icon:'🪻',label:'Lavender'},{id:'milkweed',icon:'🌸',label:'Milkweed'}];
export default function Game({onComplete}) {
 const [selected,setSelected]=useState([]); const add=id=>{const next=selected.includes(id)?selected:[...selected,id];setSelected(next);if(next.length===3)onComplete('chapter3')};
 return <section className="mini-game"><div className="game-label">INTERACTIVE DEMO 03 · BIAS & FAIRNESS</div><p>Pip only learned about sunflowers. Select other flowers it should investigate too.</p><div className="choice-grid">{flowers.map(f=><button className={selected.includes(f.id)?'choice-tile found':'choice-tile'} key={f.id} onClick={()=>add(f.id)}><span className="choice-icon">{f.icon}</span>{f.label} {selected.includes(f.id)?'✓':'+'}</button>)}</div><p className="game-feedback" aria-live="polite">{selected.length===3?'Great! More representative examples can improve recommendations. Fairness also depends on goals and who is affected.':'How might missing examples affect Pip’s suggestions?'}</p></section>;
}
