import React, { useEffect, useState } from 'react';
import './Game.css';

// Chapter 3: a storybook simulation, not a live machine-learning model.
// Reading moments draw attention to large, legible text. Interactive moments
// reveal only the relevant targets and gently animate them.
const BASE='/chapter3/';
const EXTRA=BASE+'extra/';
const GOALS=[
  {id:'pretty',label:'Beautiful',image:'goal-pretty-button.png'},
  {id:'budget',label:'Low-cost',image:'goal-budget-button.png'},
  {id:'habitat',label:'Healthy habitat',image:'goal-butterflies-button.png'}
];
const EXAMPLES=[
  {id:'coral',flower:'pink-flower-bed.png',label:'Pink and coral flowers',description:'An adult butterfly visiting pink and coral flowers.'},
  {id:'lavender',flower:'mixed-flower-bed.png',label:'Purple flower patch',description:'An adult butterfly visiting a purple flower patch.'},
  {id:'meadow',flower:'raised-flower-bed.png',label:'Colorful garden',description:'An adult butterfly flying above a colorful garden.'}
];
const GOAL_EXPLANATIONS={
  pretty:'I focused on colorful flowers and decorations. I still need to check for milkweed.',
  budget:'I focused on using fewer, affordable plants. A small budget does not mean we should forget caterpillars.',
  habitat:'I included nectar flowers for adults and milkweed leaves for monarch caterpillars.'
};
const DUAL_EXPLANATIONS={
  'budget+pretty':'I made a colorful garden with fewer plants. Let us check whether the monarchs have everything they need.',
  'habitat+pretty':'I made it beautiful AND included nectar flowers and milkweed!',
  'budget+habitat':'I kept the garden simple and made room for nectar flowers and milkweed.'
};
const start=()=>({
  phase:'explore',mode:'read',feedback:null,
  explored:[],checked:[],reason:'',biasSeen:[],biasAdded:false,
  goal:'pretty',tried:['pretty'],pair:[]
});
const includes=(arr,item)=>arr.includes(item);

function Art({name,className='',alt=''}) {
  return <img className={'ch3-art '+className}
    src={EXTRA+(name.endsWith('.png')?name:name+'.png')}
    alt={alt} draggable="false" loading="eager"/>;
}
function Sprite({file,className='',alt=''}) {
  return <img className={className} src={BASE+file} alt={alt} draggable="false" loading="eager"/>;
}
function ExampleIllustration({example}) {
  return <div className={'ch3-example-illustration ch3-example-'+example.id}>
    <span className="ch3-example-sun" aria-hidden="true"/>
    <Art name={example.flower} className="ch3-example-plants"/>
    <Sprite file="butterfly.png" className="ch3-example-butterfly"/>
    <span className="ch3-example-sparkle" aria-hidden="true">✦</span>
  </div>;
}
function GoalOptions({selected,multiple,onChoose}) {
  return <div className="ch3-goal-choices" role="group" aria-label={multiple?'Select two garden priorities':'Select one garden priority'}>
    {GOALS.map(goal=><button type="button" key={goal.id}
      className={'ch3-goal-card ch3-attention-target '+(selected.includes(goal.id)?'is-selected':'')}
      aria-pressed={selected.includes(goal.id)} aria-label={goal.label} title={goal.label}
      onClick={()=>onChoose(goal.id)}>
      <Art name={goal.image} alt=""/>
      <span className="ch3-goal-caption">{goal.label}</span>
    </button>)}
  </div>;
}
function ReadingOverlay({message,onContinue,artAdded}) {
  return <div className="ch3-reading-layer">
    <div className="ch3-reading-panel" role="dialog" aria-modal="true" aria-label={message.title}>
      <span className="ch3-reading-kicker">LILY & PIP · LOOK, THINK, LEARN</span>
      <h4>{message.title}</h4>
      {message.lines.map((line,i)=><p className="ch3-reading-line" key={i}>
        {line.speaker&&<strong>{line.speaker}: </strong>}{line.text}
      </p>)}
      {message.note&&<p className="ch3-reading-note">{message.note}</p>}
      {artAdded&&<div className="ch3-added-example">
        <Sprite file="caterpillar-happy.png" alt="Monarch caterpillar"/>
        <Art name="milkweed-bed-sign" alt="Milkweed"/>
        <span>New example added: caterpillar + milkweed!</span>
      </div>}
      <button type="button" className="ch3-primary ch3-reading-continue" onClick={onContinue}>
        {message.button||'Continue'} <span aria-hidden="true">→</span>
      </button>
    </div>
  </div>;
}
function stageMessage(phase) {
  switch(phase){
    case 'explore':return {title:'Who Can Live Here?',lines:[
      {speaker:'Pip',text:'Look, Lily! I made a beautiful butterfly garden!'},
      {speaker:'Lily',text:"It looks lovely. Let's see who can live here!"}
    ],note:'First, explore the garden. Find both visitors.',button:'Explore the garden'};
    case 'explain':return {title:'Why Did Pip Forget?',lines:[
      {speaker:'Lily',text:"Why didn't you plant milkweed, Pip?"},
      {speaker:'Pip',text:'You asked for a beautiful garden, so I focused on colorful flowers!'}
    ],note:"A goal tells AI what to focus on. Let's think about that.",button:"Answer Lily's question"};
    case 'bias-intro':return {title:'What Examples Did Pip See?',lines:[
      {speaker:'Pip',text:'I looked at examples of butterfly gardens!'},
      {speaker:'Lily',text:"Let's look closely. Do the examples show the whole story?"}
    ],note:'In Chapter 1, we learned that AI learns from examples. Which examples are missing?',button:"See Pip's pictures"};
    case 'goals':return {title:"Change Pip's Goals!",lines:[
      {speaker:'Lily',text:"Let's see what happens when we change the goal!"},
      {speaker:'Pip',text:'I make different suggestions when you tell me what matters.'}
    ],note:'Beautiful, low-cost, and healthy habitat are all useful goals. Try at least two.',button:'Try garden goals'};
    case 'combine':return {title:'Two Goals, One Garden!',lines:[
      {speaker:'Lily',text:'Can we think about two important things at once?'},
      {speaker:'Pip',text:'Choose TWO goals, and I will make a new plan.'}
    ],note:'Good design can balance different needs.',button:'Choose two goals'};
    case 'check':return {title:'Check the New Garden!',lines:[
      {speaker:'Lily',text:"Before we finish, let's check the garden again!"},
      {speaker:'Pip',text:'A suggestion is only the beginning. Help me look for what I missed!'}
    ],note:'Check the adult butterfly AND the monarch caterpillar.',button:'Check the animals'};
    case 'celebrate':return {title:'A Garden for Everyone!',lines:[
      {speaker:'Lily',text:'We made a better garden by asking questions and checking the results!'},
      {speaker:'Pip',text:'Thank you! You helped me notice what I missed.'}
    ],note:'GOALS matter · EXAMPLES matter · PEOPLE check the results.',button:'Play again'};
    default:return null;
  }
}
const hasVisiting=(items)=>includes(items,'butterfly')&&includes(items,'caterpillar');

export default function Game({onComplete}) {
  const [g,setG]=useState(start);
  const [speaking,setSpeaking]=useState(false);
  const phase=g.phase,mode=g.mode;
  const paired=['combine','check','celebrate'].includes(phase);
  const active=paired&&g.pair.length?g.pair:[g.goal];
  const habitat=includes(active,'habitat');
  const pretty=includes(active,'pretty');
  const budget=includes(active,'budget');
  const key=[...active].sort().join('+');
  const design=habitat?'habitat':budget?'budget':'pretty';
  const inspectable=mode==='interact'&&['explore','check'].includes(phase);
  const biasScene=phase.startsWith('bias-');

  useEffect(()=>()=>{if(typeof window!=='undefined')window.speechSynthesis?.cancel();},[]);
  function stopSpeech(){if(typeof window!=='undefined')window.speechSynthesis?.cancel();setSpeaking(false);}
  function change(phase,mode='read',changes={}) {
    stopSpeech();
    setG(old=>({...old,phase,mode,feedback:null,...changes}));
  }
  function showFeedback(message){
    stopSpeech();
    setG(old=>({...old,mode:'read',feedback:message}));
  }
  function proceed(){
    if(g.feedback){
      const action=g.feedback.action||'resume';
      if(action==='bias-intro')return change('bias-intro');
      if(action==='goals')return change('goals');
      if(action==='check')return change('check');
      return setG(old=>({...old,mode:'interact',feedback:null}));
    }
    if(phase==='celebrate'){
      change('explore','read',start());
      return;
    }
    if(phase==='bias-intro')return change('bias-cards','interact');
    setG(old=>({...old,mode:'interact'}));
  }
  function readAloud(){
    if(typeof window==='undefined'||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
    if(speaking){stopSpeech();return;}
    const msg=g.feedback||stageMessage(phase);
    const text=msg?[msg.title,...msg.lines.map(line=>(line.speaker?line.speaker+': ':'')+line.text),msg.note||''].join('. '):'';
    const utterance=new window.SpeechSynthesisUtterance(text);
    utterance.lang='en-US';utterance.rate=.86;
    utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>setSpeaking(false);
    window.speechSynthesis.cancel();window.speechSynthesis.speak(utterance);setSpeaking(true);
  }
  function inspect(who){
    if(!inspectable)return;
    stopSpeech();
    const keyName=phase==='explore'?'explored':'checked';
    setG(old=>({...old,[keyName]:[...new Set([...old[keyName],who])]}));
    if(who==='butterfly'){
      showFeedback({title:'The Adult Butterfly',lines:[
        {speaker:'Butterfly',text:'Yum! I found nectar in the flowers!'},
        {speaker:'Lily',text:'Adult monarchs need nectar from flowers.'}
      ],button:'Keep exploring'});
    }else if(who==='caterpillar'){
      showFeedback(habitat?{title:'Milkweed Found!',lines:[
        {speaker:'Caterpillar',text:'Yay! Now I have milkweed leaves to eat!'},
        {speaker:'Pip',text:'Milkweed is food for monarch caterpillars.'}
      ],button:'Keep exploring'}:{title:'A Hungry Caterpillar',lines:[
        {speaker:'Caterpillar',text:"I'm hungry! Where is my milkweed?"},
        {speaker:'Lily',text:'The garden is missing something important.'}
      ],button:'Keep exploring'});
    }else{
      showFeedback({title:'Flowers Are a Clue',lines:[
        {speaker:'Lily',text:'Some flowers provide nectar for adults.'},
        {speaker:'Pip',text:'But monarch caterpillars need milkweed leaves!'}
      ],button:'Look around'});
    }
  }
  function reason(answer){
    setG(old=>({...old,reason:answer}));
    if(answer==='goal'){
      showFeedback({title:'The Goal Matters!',lines:[
        {speaker:'Lily',text:'Pip focused on the goal I gave it.'},
        {speaker:'Pip',text:'Yes! A different goal can change my suggestion.'}
      ],note:'But a missing goal is not the same as missing examples.',button:"See Pip's examples",action:'bias-intro'});
    }else{
      showFeedback({title:'Think About Lily’s Request',lines:[
        {speaker:'Lily',text:'I asked Pip to make the garden beautiful.'},
        {speaker:'Pip',text:'I chose plants to follow that goal, not to be mean.'}
      ],button:'Try the question again'});
    }
  }
  function viewExample(id){
    setG(old=>({...old,biasSeen:[...new Set([...old.biasSeen,id])]}));
    const example=EXAMPLES.find(x=>x.id===id);
    showFeedback({title:'One of Pip’s Examples',lines:[
      {speaker:'Pip',text:example.description},
      {speaker:'Lily',text:'That shows an adult butterfly. What about young monarchs?'}
    ],button:'Look at more pictures'});
  }
  function missingExample(id){
    if(id==='adult'){
      showFeedback({title:'We Already Saw That!',lines:[
        {speaker:'Lily',text:'We already have several pictures of adult butterflies.'},
        {speaker:'Pip',text:'What might a baby monarch need?'}
      ],button:'Try another example'});
    } else {
      setG(old=>({...old,biasAdded:true}));
      showFeedback({title:'A Missing Example!',lines:[
        {speaker:'Lily',text:'A monarch caterpillar eating milkweed belongs in the pictures!'},
        {speaker:'Pip',text:"My first examples didn't show the whole story!"}
      ],note:'If AI learns from incomplete examples, its suggestions may miss important needs. This is a teaching simulation, not real AI training.',button:"Change Pip's goals",action:'goals'});
    }
  }
  function selectGoal(id){
    setG(old=>({...old,goal:id,tried:[...new Set([...old.tried,id])]}));
    showFeedback({title:GOALS.find(item=>item.id===id).label+' Garden',lines:[
      {speaker:'Pip',text:GOAL_EXPLANATIONS[id]},
      {speaker:'Lily',text:id==='habitat'?'Now let's check that both monarch life stages have food.':'Looks different! Could another important need be missing?'}
    ],button:'Keep experimenting'});
  }
  function togglePair(id){
    stopSpeech();
    setG(old=>{
      const newPair=includes(old.pair,id)?old.pair.filter(x=>x!==id):old.pair.length===2?[old.pair[1],id]:[...old.pair,id];
      return {...old,pair:newPair};
    });
  }
  function reviewPair(){
    if(g.pair.length!==2)return;
    showFeedback({title:'Pip’s Two-Goal Plan',lines:[
      {speaker:'Pip',text:DUAL_EXPLANATIONS[key]},
      {speaker:'Lily',text:"Now let's check whether both monarchs have what they need!"}
    ],button:'Check the garden',action:'check'});
  }
  function celebrate(){
    stopSpeech();
    if(!hasVisiting(g.checked)||!habitat)return;
    change('celebrate');
    onComplete?.('chapter3');
  }

  const text=mode==='read'?(g.feedback||stageMessage(phase)):null;
  return <section className="mini-game ch3-garden-game" aria-label="Chapter 3: a garden for everyone"
    onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}>
    <div className="ch3-stage" data-mode={mode} data-step={phase} data-bias={biasScene?'yes':'no'}
      data-garden={design} data-dual={g.pair.length===2?key:'none'} data-pretty={pretty?'yes':'no'}>
      <Sprite file="garden-background.webp" className="ch3-background"/>
      <div className="ch3-garden-scenery" aria-hidden="true">
        <Art name="trellis" className="ch3-trellis"/>
        <Art name="stone-pond" className="ch3-pond"/>
        <Art name="garden-bench" className="ch3-bench"/>
        <Art name="garden-sign" className="ch3-wood-sign"/>
        <Art name="stepping-stones" className="ch3-stones"/>
        <Art name="water-can" className="ch3-watering-can"/>
        <Art name="mixed-flower-bed" className="ch3-border-flowers ch3-border-flowers-right"/>
        <Art name="garden-pretty-bed" className="ch3-main-bed ch3-bed-pretty"/>
        <Art name="garden-budget-bed" className="ch3-main-bed ch3-bed-budget"/>
        <Art name="garden-habitat-bed" className="ch3-main-bed ch3-bed-habitat"/>
        <Art name="pink-flower-bed" className="ch3-goal-accent ch3-goal-accent-pretty"/>
        <Art name="raised-flower-bed" className="ch3-goal-accent ch3-goal-accent-budget"/>
        <Art name="pink-flower-bed" className="ch3-beauty-decoration ch3-beauty-decoration-a"/>
        <Art name="mixed-flower-bed" className="ch3-beauty-decoration ch3-beauty-decoration-b"/>
        <Art name="pink-flower-bed" className="ch3-beauty-decoration ch3-beauty-decoration-c"/>
        <Art name="milkweed-bed-sign" className="ch3-plant-sign ch3-milkweed-sign"/>
        <Art name="nectar-bed-sign" className="ch3-plant-sign ch3-nectar-sign"/>
      </div>
      <div className="ch3-heading"><span className="ch3-eyebrow">CHAPTER THREE · HUMAN VALUES & FAIRNESS</span>
        <h3>{phase.startsWith('bias')?'What Examples Did Pip See?':phase==='explore'?'Who Can Live Here?':phase==='explain'?'Why Did Pip Forget?':phase==='goals'?"Change Pip's Goals!":phase==='combine'?'Two Goals, One Garden!':phase==='check'?'Check the Garden!':'A Garden for Everyone!'}</h3>
      </div>
      <Sprite file="lily.png" className="ch3-character ch3-character-lily" alt="Lily"/>
      <Sprite file="pip.png" className="ch3-character ch3-character-pip" alt="Pip"/>
      <div className="ch3-speech ch3-speech-lily"><Art name="bubble-lily"/><span>{phase==='explore'?'Who can live here?':phase==='explain'?'Why did Pip choose these flowers?':biasScene?'What is missing?':phase==='goals'?'What changes with each goal?':phase==='combine'?'Can we balance two goals?':phase==='check'?'Did we remember everyone?':'We checked and improved it!'}</span></div>
      <div className="ch3-speech ch3-speech-pip"><Art name="bubble-pip"/><span>{phase==='explore'?'I made a beautiful garden!':phase==='explain'?'I focused on beauty!':biasScene?'I learned from some examples!':phase==='goals'?GOAL_EXPLANATIONS[g.goal]:phase==='combine'&&g.pair.length===2?DUAL_EXPLANATIONS[key]:phase==='check'?'Let us check my suggestion.':'People help me improve!'}</span></div>

      {inspectable&&<div className="ch3-inspection-group">
        <button type="button" className="ch3-visitor ch3-visitor-butterfly ch3-attention-target"
          onClick={()=>inspect('butterfly')} aria-label="Inspect the adult monarch butterfly">
          <Sprite file="butterfly.png" className="ch3-art" alt=""/><span className="ch3-tap-spark">✦</span>
        </button>
        <button type="button" className="ch3-visitor ch3-visitor-caterpillar ch3-attention-target"
          onClick={()=>inspect('caterpillar')} aria-label="Inspect the monarch caterpillar">
          <Sprite file={habitat?'caterpillar-happy.png':'caterpillar-hungry.png'} className="ch3-art" alt=""/><span className="ch3-tap-spark">✦</span>
        </button>
        {phase==='explore'&&<button type="button" className="ch3-clue ch3-clue-flower ch3-attention-target"
          onClick={()=>inspect('flowers')} aria-label="Examine the flowers">✦</button>}
      </div>}
      {mode==='interact'&&phase==='bias-cards'&&<div className="ch3-example-board">
        <h4>Look at Pip's three examples</h4><p>Tap each picture. What do they have in common?</p>
        <div className="ch3-example-grid">{EXAMPLES.map(example=><button type="button" key={example.id}
          className={'ch3-example-card ch3-attention-target '+(includes(g.biasSeen,example.id)?'is-seen':'')}
          onClick={()=>viewExample(example.id)} aria-label={'Inspect picture: '+example.label}>
          <ExampleIllustration example={example}/><span>{example.label}</span>
          {includes(g.biasSeen,example.id)&&<b className="ch3-seen-check">✓</b>}
        </button>)}</div>
      </div>}
      {mode==='interact'&&phase==='bias-choice'&&<div className="ch3-example-board ch3-compare-board">
        <h4>Which example should Pip add?</h4><p>Choose the picture that shows a missing need.</p>
        <div className="ch3-example-grid ch3-compare-grid">
          <button type="button" className="ch3-example-card ch3-attention-target"
            onClick={()=>missingExample('adult')}>
            <ExampleIllustration example={EXAMPLES[0]}/><span>Another adult butterfly</span>
          </button>
          <button type="button" className="ch3-example-card ch3-attention-target"
            onClick={()=>missingExample('caterpillar')}>
            <div className="ch3-example-illustration ch3-example-young">
              <Art name="milkweed-bed-sign" className="ch3-example-plants"/>
              <Sprite file="caterpillar-happy.png" className="ch3-example-caterpillar"/>
            </div><span>Caterpillar + milkweed</span>
          </button>
        </div>
      </div>}

      {mode==='interact'&&<div className="ch3-control-dock" aria-label="Current game activity">
        {phase==='explore'&&<div className="ch3-control-content">
          <strong>Garden detective</strong><span className="ch3-dock-hint">Tap the two glowing animals · {['butterfly','caterpillar'].filter(x=>includes(g.explored,x)).length}/2 checked</span>
          <button className="ch3-primary" type="button" disabled={!hasVisiting(g.explored)}
            onClick={()=>change('explain')}>Why did Pip forget? →</button>
        </div>}
        {phase==='explain'&&<div className="ch3-control-content">
          <strong>Why did Pip choose these flowers?</strong>
          <div className="ch3-answer-list">
            <button type="button" className="ch3-answer-card ch3-attention-target" onClick={()=>reason('random')}>Pip picked randomly.</button>
            <button type="button" className="ch3-answer-card ch3-attention-target" onClick={()=>reason('goal')}>Pip focused on Lily's goal.</button>
            <button type="button" className="ch3-answer-card ch3-attention-target" onClick={()=>reason('mean')}>Pip wanted to be unkind.</button>
          </div>
        </div>}
        {phase==='bias-cards'&&<div className="ch3-control-content">
          <strong>What did Pip see?</strong><span className="ch3-dock-hint">{g.biasSeen.length}/3 example pictures explored</span>
          <button type="button" className="ch3-primary" disabled={g.biasSeen.length<3} onClick={()=>change('bias-choice','interact')}>What is missing? →</button>
        </div>}
        {phase==='bias-choice'&&<div className="ch3-control-content">
          <strong>Pick the missing example</strong><span className="ch3-dock-hint">What would help Pip see the WHOLE monarch life cycle?</span>
        </div>}
        {phase==='goals'&&<div className="ch3-control-content">
          <strong>What should Pip focus on?</strong>
          <GoalOptions selected={[g.goal]} onChoose={selectGoal}/>
          <div className="ch3-dock-actions">
            <span className="ch3-dock-hint">{g.tried.length}/3 goals tried · try at least two</span>
            <button type="button" className="ch3-primary" disabled={g.tried.length<2} onClick={()=>change('combine','read',{pair:[]})}>Try two goals →</button>
          </div>
        </div>}
        {phase==='combine'&&<div className="ch3-control-content">
          <strong>Choose TWO priorities</strong>
          <GoalOptions selected={g.pair} multiple onChoose={togglePair}/>
          <div className="ch3-dock-actions">
            <span className="ch3-dock-hint">{g.pair.length}/2 selected</span>
            <button type="button" className="ch3-primary" disabled={g.pair.length!==2} onClick={reviewPair}>See Pip's plan →</button>
          </div>
        </div>}
        {phase==='check'&&<div className="ch3-control-content">
          <strong>Check both garden visitors</strong>
          <span className="ch3-dock-hint">{['butterfly','caterpillar'].filter(x=>includes(g.checked,x)).length}/2 checked</span>
          <div className="ch3-dock-actions">
            <button type="button" className="ch3-secondary" onClick={()=>change('combine','read',{checked:[]})}>↶ Change goals</button>
            {hasVisiting(g.checked)&&habitat&&<button type="button" className="ch3-primary" onClick={celebrate}>Celebrate! ✦</button>}
            {hasVisiting(g.checked)&&!habitat&&<span className="ch3-dock-hint ch3-try-again">Milkweed is missing. Revise the plan!</span>}
          </div>
        </div>}
      </div>}
      <button className="ch3-read-aloud" type="button" onClick={readAloud} disabled={mode!=='read'}
        aria-label={speaking?'Stop reading aloud':'Read the story aloud'}>{speaking?'■ Stop':'♫ Listen'}</button>

      {mode==='read'&&text&&<ReadingOverlay message={text} onContinue={proceed}
        artAdded={g.biasAdded&&phase==='bias-choice'&&g.feedback?.action==='goals'}/>}
    </div>
  </section>;
}
