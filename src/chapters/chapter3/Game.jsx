import React,{useEffect,useState} from 'react';
import './Game.css';
const A='/chapter3/';
const GOALS=[['pretty','✿','Make it pretty'],['budget','$','Save money'],['butterflies','♡','Help butterflies']];
const NEW=()=>({step:'explore',seen:[],goal:'',pair:[],checked:[]});
export default function Game({onComplete}){
 const [g,set]=useState(NEW),[message,msg]=useState('Pip: Look, Lily! I designed a beautiful butterfly garden!'),[talking,speaking]=useState(false);
 const food=g.step==='choose'?g.goal==='butterflies':g.step==='explore'?false:g.pair.includes('butterflies');
 const design=g.step==='explore'?'initial':g.step==='choose'?(g.goal||'initial'):food?'butterflies':g.pair.includes('pretty')?'pretty':'budget';
 useEffect(()=>()=>window.speechSynthesis?.cancel(),[]);
 const stage=(step)=>{set(s=>({...s,step,checked:[]}));msg(step==='choose'?'Pip: What should I focus on?':step==='combine'?'Lily: What if we choose TWO important goals?':step==='check'?'Lily: Tap the garden. Did we remember everyone?':'Pip: Our choices change the garden I design!')};
 const clue=(id)=>{
   let text=id==='caterpillar'?(food?'Caterpillar: Yay! I found the milkweed I need!':'Caterpillar: I am hungry! I need milkweed leaves!'):id==='butterfly'?'Butterfly: I can drink nectar from these flowers!':id==='milkweed'?'Milkweed: Monarch caterpillars can eat my leaves!':'Flowers: We can give adult butterflies nectar!';
   msg(text);set(s=>({...s,seen:[...new Set([...s.seen,id])],checked:[...new Set([...s.checked,id])]}));
 };
 const choose=id=>{
   set(s=>({...s,goal:id,seen:[...new Set([...s.seen,'goal-'+id])]}));
   msg(({pretty:'Pip: I made it more colorful! Lily: But where will caterpillars find food?',budget:'Pip: I saved money! Lily: Some butterflies still need more help.',butterflies:'Pip: I thought about butterflies and caterpillars this time!'})[id]);
 };
 const pair=id=>set(s=>{const next=s.pair.includes(id)?s.pair.filter(x=>x!==id):s.pair.length<2?[...s.pair,id]:s.pair;msg(next.length===2?(next.includes('butterflies')?'Pip: I included nectar flowers and host plants!':'Lily: This is pretty, but who did Pip forget?'):'Pip: Choose one more goal!');return {...s,pair:next}});
 const say=()=>{if(!window.speechSynthesis)return;if(talking){window.speechSynthesis.cancel();speaking(false);return}const u=new SpeechSynthesisUtterance(message);u.rate=.88;u.onend=()=>speaking(false);u.onerror=()=>speaking(false);window.speechSynthesis.speak(u);speaking(true)};
 const done=()=>{stage('finished');onComplete?.('chapter3')};
 return <section className="mini-game ch3-garden-game" aria-label="Interactive garden game" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}>
  <div className="ch3-scene" data-design={design}>
   <img className="ch3-bg" src={A+'garden-background.webp'} alt="" draggable="false"/>
   {['pond','pretty-flowers','nectar-flowers','milkweed','butterfly'].map(name=><img key={name} src={A+name+'.png'} alt="" draggable="false" className={'ch3-layer ch3-'+({'pretty-flowers':'pretty','nectar-flowers':'nectar'}[name]||name)+(name==='milkweed'&&food?' is-visible':'')}/>)}
   <img className="ch3-layer ch3-caterpillar" src={A+(food?'caterpillar-happy.png':'caterpillar-hungry.png')} alt="" draggable="false"/>
   <img className="ch3-layer ch3-lily" src={A+'lily.png'} alt="Lily" draggable="false"/>
   <img className="ch3-layer ch3-pip" src={A+'pip.png'} alt="Pip" draggable="false"/>
   <div className="ch3-title">Change Pip's Goals!</div>
   {['explore','check'].includes(g.step)&&<>{[['flowers','flower'],['butterfly','butterfly'],['caterpillar','caterpillar'],...(food?[['milkweed','milkweed']]:[])].map(([id,loc])=><button type="button" key={id} className={'ch3-hotspot ch3-hotspot-'+loc} onClick={()=>clue(id)} aria-label={'Explore '+id}>+</button>)}</>}
   <div className="ch3-dialogue" role="status" aria-live="polite">{message}<button type="button" className="ch3-speak" onClick={say} aria-label={talking?'Stop reading':'Read dialogue aloud'}>{talking?'■':'▶'}</button></div>
   <div className="ch3-controls"><div className="ch3-panel">
    {g.step==='explore'&&<><strong>Tap the glowing garden clues!</strong><span>Can you find what Pip forgot?</span>{g.seen.includes('caterpillar')&&<button className="ch3-next" onClick={()=>stage('choose')}>Help Pip →</button>}</>}
    {g.step==='choose'&&<><strong>What should Pip think about?</strong><div className="ch3-choice-row">{GOALS.map(([id,icon,label])=><button type="button" key={id} className={g.goal===id?'active':''} aria-pressed={g.goal===id} onClick={()=>choose(id)}><b>{icon}</b>{label}</button>)}</div>{g.seen.filter(x=>x.startsWith('goal-')).length>=2&&<button className="ch3-next" onClick={()=>stage('combine')}>Try two goals →</button>}</>}
    {g.step==='combine'&&<><strong>Choose TWO important goals!</strong><div className="ch3-choice-row">{GOALS.map(([id,icon,label])=><button type="button" key={id} className={g.pair.includes(id)?'active':''} aria-pressed={g.pair.includes(id)} onClick={()=>pair(id)}><b>{icon}</b>{label}</button>)}</div><span>{g.pair.length}/2 chosen</span>{g.pair.length===2&&<button className="ch3-next" onClick={()=>stage('check')}>Check the garden →</button>}</>}
    {g.step==='check'&&<><strong>Did we remember everyone?</strong><span>Tap the garden to investigate!</span>{food&&g.checked.includes('caterpillar')&&(g.checked.includes('flowers')||g.checked.includes('milkweed'))?<button className="ch3-next" onClick={done}>Celebrate! →</button>:<button className="ch3-next" onClick={()=>stage('combine')}>Change goals ↻</button>}</>}
    {g.step==='finished'&&<><strong>We made a better garden!</strong><span>AI choices depend on the goals we set. Check who might be missing!</span><button className="ch3-next" onClick={()=>{set(NEW());msg('Pip: Look, Lily! I designed a beautiful butterfly garden!')}}>Play again ↻</button></>}
   </div></div>
  </div>
 </section>;
}
