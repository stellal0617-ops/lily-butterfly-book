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
{id:'red',label:'Red zinnia',description:'An adult monarch on a red zinnia.',
 photo:'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/0d/Monarch_Butterfly_Red_Zinnia_2050px.jpg/960px-Monarch_Butterfly_Red_Zinnia_2050px.jpg',
 author:'Derek Ramsey'},
{id:'lilac',label:'Purple lilacs',description:'An adult monarch feeding on purple lilacs.',
 photo:'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Monarch_butterfly_%2853782483856%29.jpg/960px-Monarch_butterfly_%2853782483856%29.jpg',
 author:'Courtney Celley / USFWS'},
{id:'spring',label:'Spring flowers',description:'An adult monarch among spring flowers.',
 photo:'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/Monarch_butterfly_in_the_springtime_%28Unsplash%29.jpg/960px-Monarch_butterfly_in_the_springtime_%28Unsplash%29.jpg',
 author:'Aaron Burden'}
];
const SHORT_GOAL_LINES={
  pretty:'I chose lots of colorful flowers to make the garden pretty!',
  budget:'I used fewer plants so the garden would cost less!',
  habitat:'I planted nectar flowers for butterflies and milkweed for caterpillars!'
};
const GOAL_LILY_LINES={
  pretty:"Wow, it's beautiful! But where's the milkweed for the caterpillars?",
  budget:'We saved money! But there are so few flowers. Will the butterflies have enough nectar?',
  habitat:'The butterflies have food now! But the garden looks a little messy, Pip. And what about our budget?'
};
const SHORT_DUAL_LINES={
'budget+pretty':'Colorful flowers on a small budget!',
'habitat+pretty':'Beauty AND food for caterpillars!',
'budget+habitat':'A simple wildlife-friendly garden!'
};
const DEFAULT_BUBBLES={
explore:{lily:'Who can live here?',pip:'I made a beautiful garden!'},
explain:{lily:'Why did Pip choose these flowers?',pip:'I focused on beauty!'},
'bias-intro':{lily:'What examples did Pip use?',pip:'I looked at garden pictures!'},
'bias-cards':{lily:'What do the pictures show?',pip:'I see adult butterflies!'},
'bias-choice':{lily:'Which important example is missing?',pip:'I need to see the whole story!'},
goals:{lily:'What changes with each goal?',pip:'You choose what matters!'},
combine:{lily:'Can we balance two goals?',pip:'Choose two things that matter!'},
check:{lily:'Did we remember everyone?',pip:'Check both monarch life stages!'},
celebrate:{lily:'We checked and improved the garden!',pip:'People help me improve!'}
};
const GOAL_EXPLANATIONS={
  pretty:SHORT_GOAL_LINES.pretty,
  budget:SHORT_GOAL_LINES.budget,
  habitat:SHORT_GOAL_LINES.habitat
};
const DUAL_EXPLANATIONS={
  'budget+pretty':'I made a colorful garden with fewer plants. Let us check whether the monarchs have everything they need.',
  'habitat+pretty':'I made it beautiful AND included nectar flowers and milkweed!',
  'budget+habitat':'I kept the garden simple and made room for nectar flowers and milkweed.'
};
const start=()=>({
  phase:'explore',mode:'read',feedback:null,inline:null,
  explored:[],checked:[],reason:'',biasAdded:false,
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
  return <div className="ch3-example-illustration ch3-example-photo">
    <img className="ch3-example-photo-image" src={example.photo}
      alt={example.description} loading="eager" draggable="false"
      onError={e=>{const img=e.currentTarget;if(!img.dataset.fallback){img.dataset.fallback='yes';img.src=BASE+'butterfly.png';}}}/>
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
      {!message.celebration&&<span className="ch3-reading-kicker">LOOK · THINK · LEARN</span>}
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
      {text:'Pip wanted to make a really pretty garden. It picked lots of bright, colorful flowers!'},
      {text:'But oh no! Pip forgot the milkweed. Now the hungry caterpillar has nothing to eat!'}
    ],button:'Why these flowers?'};
    case 'bias-intro':return {title:'What Examples Did Pip See?',lines:[
      {text:'Pip found three pictures of butterfly gardens.'},
      {text:"Let's take a peek!"}
    ],button:"Show me the pictures!"};
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
    case 'celebrate':return {title:'Hooray! The Garden Is Blooming!',celebration:true,lines:[
      {text:'Butterflies flutter from flower to flower.'},
      {text:'A little caterpillar munches happily on a milkweed leaf.'},
      {text:'The garden is bright, beautiful, and full of life!'}
    ],button:'Play again'};
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
    setG(old=>({...old,phase,mode,feedback:null,inline:null,...changes}));
  }
  function showFeedback(message){
    // Object clicks and choice clicks update small speech bubbles, NEVER the reading modal.
    stopSpeech();
    const title=message.title||'';
    const selectedGoal=GOALS.find(item=>title===item.label+' Garden');
    const byTitle={
      'The Adult Butterfly':{lily:'The butterfly found nectar!',pip:'Adults drink nectar from flowers.'},
      'Milkweed Found!':{lily:'The caterpillar found milkweed!',pip:'Milkweed leaves are its food.'},
      'A Hungry Caterpillar':{lily:'The caterpillar is hungry!',pip:'Monarch caterpillars need milkweed.'},
      'Flowers Are a Clue':{lily:'Pretty flowers! What about young monarchs?',pip:'Adults need nectar; babies need milkweed.'},
      'The Goal Matters!':{lily:'Yes! Pip followed my goal.',pip:'Your goal can change my design!'},
      'Think About Lily’s Request':{lily:'Think about my original request.',pip:'I followed the beauty goal.'},
      'One of Pip’s Examples':{lily:'That photo shows an adult butterfly.',pip:'My examples only showed adults!'},
      'We Already Saw That!':{lily:'We already saw adult butterflies.',pip:'What about a caterpillar?'},
      'A Missing Example!':{lily:'Yes! Add a caterpillar and milkweed!',pip:'My examples missed young monarchs!'}
    };
    const inline=selectedGoal?{
      lily:GOAL_LILY_LINES[selectedGoal.id],
      pip:SHORT_GOAL_LINES[selectedGoal.id]
    }:byTitle[title]||{lily:'Let us check that idea.',pip:'Good thinking!'};
    setG(old=>({...old,mode:'interact',feedback:message,inline}));
  }
  function proceed(){
    if(phase==='celebrate')return change('explore','read',start());
    if(phase==='bias-intro')return change('bias-cards','interact');
    setG(old=>({...old,mode:'interact',feedback:null}));
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
      {speaker:'Lily',text:GOAL_LILY_LINES[id]}
    ],button:'Keep experimenting'});
  }
  function togglePair(id){
    stopSpeech();
    setG(old=>{
      const pair=includes(old.pair,id)?old.pair.filter(item=>item!==id):
        old.pair.length===2?[old.pair[1],id]:[...old.pair,id];
      const pairKey=[...pair].sort().join('+');
      return {...old,pair,feedback:null,mode:'interact',
        inline:{
          lily:pair.length===2?'How well does this design work?':'Choose one more goal!',
          pip:pair.length===2?SHORT_DUAL_LINES[pairKey]:'I can balance two priorities!'
        }};
    });
  }
  function reviewPair(){
    if(g.pair.length!==2)return;
    change('check','interact',{checked:[],inline:{
      lily:'Tap both animals to check the garden.',
      pip:SHORT_DUAL_LINES[key]
    }});
  }
  function celebrate(){
    stopSpeech();
    if(!hasVisiting(g.checked)||!habitat)return;
    change('celebrate');
    onComplete?.('chapter3');
  }

  const text=mode==='read'?stageMessage(phase):null;
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
      <div className="ch3-speech ch3-speech-lily"><Art name="bubble-lily"/><span>{g.inline?.lily||DEFAULT_BUBBLES[phase]?.lily}</span></div>
      <div className="ch3-speech ch3-speech-pip"><Art name="bubble-pip"/><span>{g.inline?.pip||DEFAULT_BUBBLES[phase]?.pip}</span></div>

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
        <h4>Look at Pip's three examples</h4>
        <p>All three photos show adult butterflies. What might be missing?</p>
        <div className="ch3-example-grid">{EXAMPLES.map(example=><div
          className="ch3-example-card ch3-example-static" key={example.id}>
          <ExampleIllustration example={example}/><span>{example.label}</span>
          <small className="ch3-photo-credit">{example.author}</small>
        </div>)}</div>
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
            <div className="ch3-example-illustration ch3-example-photo">
              <img className="ch3-example-photo-image"
                src="https://thumb.wikimedia.org/wikipedia/commons/thumb/9/95/Monarch_Caterpillar_on_Common_Milkweed_%2848472709127%29.jpg/960px-Monarch_Caterpillar_on_Common_Milkweed_%2848472709127%29.jpg"
                alt="Real photograph of a monarch caterpillar on a common milkweed leaf, by Courtney Celley, USFWS"
                loading="eager" draggable="false"
                onError={event=>{const img=event.currentTarget;if(!img.dataset.fallback){img.dataset.fallback='yes';img.src=BASE+'caterpillar-happy.png';}}}/>
            </div><span>Caterpillar + milkweed</span><small className="ch3-photo-credit">Courtney Celley / USFWS</small>
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
          {g.reason==='goal'&&<button type="button" className="ch3-primary" onClick={()=>change('bias-intro')}>See Pip's examples →</button>}
        </div>}
        {phase==='bias-cards'&&<div className="ch3-control-content">
          <strong>What did Pip see?</strong>
          <span className="ch3-dock-hint">Look at all three photos and find the missing part of the story.</span>
          <button type="button" className="ch3-primary" onClick={()=>change('bias-choice','interact')}>What is missing? →</button>
        </div>}
        {phase==='bias-choice'&&<div className="ch3-control-content">
          <strong>Pick the missing example</strong><span className="ch3-dock-hint">{g.biasAdded?'✓ Added a caterpillar + milkweed!':'What helps Pip see the whole monarch life cycle?'}</span>
          {g.biasAdded&&<button type="button" className="ch3-primary" onClick={()=>change('goals','interact')}>Change Pip's Goals →</button>}
        </div>}
        {phase==='goals'&&<div className="ch3-control-content">
          <strong>What should Pip focus on?</strong>
          <GoalOptions selected={[g.goal]} onChoose={selectGoal}/>
          <div className="ch3-dock-actions">
            <span className="ch3-dock-hint">{g.tried.length}/3 goals tried · try at least two</span>
            <button type="button" className="ch3-primary" disabled={g.tried.length<2} onClick={()=>change('combine','interact',{pair:[]})}>Try two goals →</button>
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
            <button type="button" className="ch3-secondary" onClick={()=>change('combine','interact',{checked:[],pair:[]})}>↶ Change goals</button>
            {hasVisiting(g.checked)&&habitat&&<button type="button" className="ch3-primary" onClick={celebrate}>Celebrate! ✦</button>}
            {hasVisiting(g.checked)&&!habitat&&<span className="ch3-dock-hint ch3-try-again">Milkweed is missing. Revise the plan!</span>}
          </div>
        </div>}
      </div>}
      <button className="ch3-read-aloud" type="button" onClick={readAloud} disabled={mode!=='read'}
        aria-label={speaking?'Stop reading aloud':'Read the story aloud'}>{speaking?'■ Stop':'♫ Listen'}</button>

      {mode==='read'&&text&&<ReadingOverlay message={text} onContinue={proceed}/>}
    </div>
  </section>;
}
