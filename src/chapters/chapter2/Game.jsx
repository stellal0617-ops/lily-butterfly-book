import React, {useState} from 'react';
import './chapter2.css';

const observations = [
  {id:'wings',icon:'🦋',title:'Unusual wings',detail:'This butterfly has three wings on one side.',fact:'Real butterflies have FOUR wings: two forewings and two hindwings. Their wings come in pairs.',check:'Compare both sides of a real butterfly. Do the wings match?'},
  {id:'antennae',icon:'🦋',title:'Extra antennae',detail:'This butterfly seems to have four antennae.',fact:'A butterfly has TWO antennae on its head, not four. It also has six legs.',check:'Count the antennae in a real butterfly photograph.'},
  {id:'plant',icon:'🌴',title:'Tropical plant',detail:'A coconut palm appears in this Pennsylvania school garden.',fact:'Coconut palms grow in warm tropical climates. They cannot survive a cold Pennsylvania winter outdoors.',check:'Look for plants that can grow in your local weather.'},
];
const clues = [
  {id:'nectar',icon:'🌸',title:'Nectar flowers',fact:'Many adult butterflies drink nectar from flowers for energy.',look:'Are there enough flowers blooming at different times?',example:'Purple coneflower and native asters can provide nectar.'},
  {id:'host',icon:'🌿',title:'Host plants',fact:'Caterpillars need the right plants to eat. Monarch caterpillars need milkweed.',look:'Can you find milkweed or other caterpillar food plants?',example:'Milkweed is a host plant for monarch caterpillars.'},
  {id:'habitat',icon:'🏡',title:'Local habitat',fact:'Butterflies also need suitable weather, shelter, and safe places to grow.',look:'Does this garden fit butterflies that live nearby?',example:'Native plants are adapted to local growing conditions.'},
];

export default function Game({onComplete}) {
  const [stage,setStage] = useState(0);
  const [found,setFound] = useState([]);
  const [selected,setSelected] = useState(null);
  const [opened,setOpened] = useState([]);
  const [evidence,setEvidence] = useState([]);
  const [reason,setReason] = useState('');
  const [submitted,setSubmitted] = useState(false);
  const [finished,setFinished] = useState(false);
  const inspect = id => {setSelected(id);setFound(prev=>prev.includes(id)?prev:[...prev,id]);};
  const openClue = id => {setSelected(id);setOpened(prev=>prev.includes(id)?prev:[...prev,id]);};
  const finish = () => {setFinished(true);onComplete?.('chapter2');};
  const restart = () => {setStage(0);setFound([]);setSelected(null);setOpened([]);setEvidence([]);setReason('');setSubmitted(false);setFinished(false);};
  const currentObservation=observations.find(item=>item.id===selected);
  const currentClue=clues.find(item=>item.id===selected);
  return <section className="mini-game butterfly-detective" aria-label="Butterfly Detective game">
    <div className="detective-top"><span className="detective-tag">🔎 BUTTERFLY DETECTIVE</span><span className="detective-step">Mission {stage+1} of 3</span></div>
    <div className="detective-progress" aria-label={`Mission ${stage+1} of 3`}>{[0,1,2].map(i=><span key={i} className={i<=stage?'lit':''}/>)}</div>
    {stage===0&&<>
      <h3>Spot Pip’s picture mistakes!</h3><p>Tap each suspicious detail in Pip’s garden. Find all three science surprises.</p>
      <div className="detective-scene" aria-label="An illustrated AI garden with three questionable details">
        <div className="scene-sun">☀️</div><div className="scene-cloud">☁️</div>
        <div className="scene-garden">🌼 🌷 🌺 🌸 🌻 🌷 🌼</div>
        <button type="button" className={`scene-object wings ${found.includes('wings')?'discovered':''}`} onClick={()=>inspect('wings')} aria-label="Inspect butterfly with unusual wings"><span className="odd-butterfly">🦋<b>◢</b></span><small>Inspect wings</small></button>
        <button type="button" className={`scene-object antennae ${found.includes('antennae')?'discovered':''}`} onClick={()=>inspect('antennae')} aria-label="Inspect butterfly with extra antennae"><span className="odd-antennae">🦋<b>⌁⌁</b></span><small>Inspect head</small></button>
        <button type="button" className={`scene-object palm ${found.includes('plant')?'discovered':''}`} onClick={()=>inspect('plant')} aria-label="Inspect tropical palm tree"><span>🌴</span><small>Inspect plant</small></button>
      </div>
      <p className="detective-count">{found.length} / 3 details investigated</p>
      {currentObservation&&<div className="detective-card" aria-live="polite"><strong>🔬 Science Observation: {currentObservation.title}</strong><p>{currentObservation.detail}</p><div className="science-fact">✅ SCIENCE CHECK: {currentObservation.fact}</div><p className="science-prompt">Try this: {currentObservation.check}</p></div>}
      <div className="detective-actions"><button type="button" disabled={found.length<3} onClick={()=>{setStage(1);setSelected(null);}}>Find missing clues →</button></div>
    </>}
    {stage===1&&<>
      <h3>Find the missing clues!</h3><p>Even after fixing those mistakes, is Pip’s garden really right for butterflies? Open all three science clue cards.</p>
      <div className="clue-grid">{clues.map(clue=><button type="button" key={clue.id} className={`clue-tile ${opened.includes(clue.id)?'examined':''}`} onClick={()=>openClue(clue.id)}><span>{clue.icon}</span><strong>{clue.title}</strong><small>{opened.includes(clue.id)?'✓ Investigated':'Tap to investigate'}</small></button>)}</div>
      {currentClue&&<div className="detective-card" aria-live="polite"><strong>{currentClue.icon} {currentClue.title}</strong><p>{currentClue.fact}</p><div className="science-fact">🌱 REAL-WORLD EXAMPLE: {currentClue.example}</div><p className="science-prompt">Detective question: {currentClue.look}</p></div>}
      <p className="detective-count">{opened.length} / 3 clue cards opened</p>
      {opened.length===3&&<div className="pip-tip">🤖 Pip: “My picture looks lovely, but I forgot to show whether caterpillars have food!”</div>}
      <div className="detective-actions"><button type="button" className="quiet" onClick={()=>{setStage(0);setSelected(null);}}>← Back</button><button type="button" disabled={opened.length<3} onClick={()=>{setStage(2);setSelected(null);}}>Solve the mystery →</button></div>
    </>}
    {stage===2&&<>
      <h3>Solve the butterfly mystery!</h3><div className="pip-tip">👧🏽 Lily noticed: “Some flowering plants were removed this year. We also saw fewer butterflies.”</div>
      <p>What evidence could help explain the change? Select the clues you would use.</p>
      <div className="evidence-list">{[
        ['flowers','Some flowering plants were removed this year.'],['nectar','Adult butterflies use nectar flowers for food.'],['host','Caterpillars need suitable host plants.'],['picture','Pip made a beautiful computer picture.']
      ].map(([id,label])=><label key={id}><input type="checkbox" checked={evidence.includes(id)} onChange={()=>setEvidence(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])}/><span>{label}</span></label>)}</div>
      <label className="reason-label" htmlFor="butterfly-reason">Finish Lily’s sentence:</label>
      <div className="sentence-input"><span>I think there are fewer butterflies because</span><textarea id="butterfly-reason" rows="2" placeholder="Write your idea here..." value={reason} onChange={e=>{setReason(e.target.value);setSubmitted(false);}}/><span>.</span></div>
      <div className="detective-actions"><button type="button" className="quiet" onClick={()=>setStage(1)}>← Back</button><button type="button" disabled={!reason.trim()||evidence.length===0} onClick={()=>setSubmitted(true)}>Submit my idea</button></div>
      {submitted&&<div className="detective-card final-clue" role="status"><strong>🌟 You made a scientific explanation!</strong><p>That is a possible reason, not yet a proven fact. Scientists look for more evidence.</p><p><strong>Share your investigation with your class!</strong></p><button type="button" onClick={finish}>{finished?'✓ Mission finished':'Finish this game'}</button></div>}
      {finished&&<div className="pip-tip">🤖 Pip: “My picture can help us imagine a garden, but science helps us understand what butterflies need!” 🌼</div>}
    </>}
    <div className="detective-footer"><button type="button" className="reset-link" onClick={restart}>↻ Restart mission</button><span>Turn the book corner anytime to leave this game.</span></div>
  </section>;
}
