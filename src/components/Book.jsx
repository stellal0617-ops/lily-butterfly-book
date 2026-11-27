import React,{useCallback,useEffect,useRef,useState} from 'react';

const TURN_MS=780;
function isInteractive(el){return !!el?.closest?.('button,a,input,textarea,select,[role="button"],.mini-game,.interactive-scene,.narrate-control');}
function StoryContent({item,onComplete}){
 const Content=item.Content;
 return <>
   {item.isChapterOpening&&<span className="chapter-kicker">CHAPTER {item.chapterNumber} · {item.chapterShort}</span>}
   <h2>{item.title}</h2>
   {item.subtitle&&<p className="story-subtitle">{item.subtitle}</p>}
   {item.kind==='bridge'?<p>{item.bridge}</p>:Content?<Content onComplete={onComplete}/>:null}
 </>;
}
function PageArt({item,position}){
 return <div className={`artwork artwork-${item.theme||'garden'}`} aria-hidden="true">
   <div className="art-sun"/><div className="art-hill art-hill-back"/><div className="art-hill art-hill-front"/>
   <span className="leaf leaf-one"/><span className="leaf leaf-two"/><span className="leaf leaf-three"/>
   <span className="art-bloom bloom-one">✿</span><span className="art-bloom bloom-two">✿</span><span className="art-bloom bloom-three">✿</span>
   <div className="art-characters"><span className="art-lily">👧🏽</span><span className="art-pip">🤖</span></div>
   <span className="art-butterfly">{item.illustration||'🦋'}</span>
   {position==='left'&&<span className="floating-sparkle">✦</span>}
 </div>;
}
function OnePage({item,side,onComplete,isMobile,activeSide}){
 const isCover=item.kind==='cover',isEnding=item.kind==='ending',isGame=item.kind==='game';
 const artOnRight=item.id==='ch2-concept'||item.id==='ch3-concept';
 return <section className={`book-page book-page-${side} theme-${item.theme||'garden'} ${isMobile&&activeSide!==side?'mobile-page-off':''}`} aria-label={`${item.title} — ${side} page`}>
   <div className="page-inner">
    <div className="page-cap">{isCover?'ONCE UPON A GARDEN':isEnding?'THE LITTLE GARDEN LIBRARY':item.chapterLabel||'LILY & PIP'} <span>✳</span></div>
    {isCover? (side==='left'?<PageArt item={item} position={side}/>:<div className="cover-title story-copy"><div className="cover-ornament">❋  ✦  ❋</div><h1>{item.title}</h1><p>{item.subtitle}</p><p className="cover-blurb">A quiet garden. A curious robot. One big question: <em>Where did the butterflies go?</em></p></div>) : isEnding ? (side==='left'?<PageArt item={item} position={side}/>:<div className="ending-copy story-copy"><div className="award-mark">🏅</div><h2>You Did It!</h2><p>Lily and Pip found a better way to help their garden: learn from examples, listen to feedback, and check what might be missing.</p><p>Look! The butterflies are visiting again!</p><div className="celebrate-symbols">🦋 ✨ 🌸 ✨ 🦋</div></div>) :isGame ? <div className={`game-ambient ambient-${side}`}><PageArt item={item} position={side}/>{side==='left'&&<p className="game-ambient-copy">Explore the garden with Pip!<br/>Touch a clue to see what happens.</p>}</div> : (side==='left') !== artOnRight ? <PageArt item={item} position={side}/> : <div className="story-copy"><StoryContent item={item} onComplete={onComplete}/></div>}
    <div className="page-bottom"><span>THE BUTTERFLY MYSTERY</span><span>✿</span></div>
   </div>
 </section>;
}
function Spread({item,onComplete,onTurnNext,isMobile,activeSide}){
 const isGame=item.kind==='game'; const Content=item.Content;
 return <div className={`spread theme-${item.theme||'garden'} ${isGame?'spread-is-game':''}`} data-spread-id={item.id}>
   <OnePage item={item} side="left" onComplete={onComplete} isMobile={isMobile} activeSide={activeSide}/>
   <OnePage item={item} side="right" onComplete={onComplete} isMobile={isMobile} activeSide={activeSide}/>
   {isGame&&<div className="spread-game-overlay">
     <div className="game-story-heading"><span>LET'S EXPLORE WITH PIP</span><h2>{item.title}</h2><p>{item.subtitle}</p></div>
     <div className="game-area"><Content onComplete={onComplete} onTurnNext={onTurnNext}/></div>
     <div className="pip-reaction" aria-label="Pip is here to help">🤖 <span>Pip says: “Try it! Each clue teaches us something.”</span></div>
   </div>}
   <div className="center-gutter" aria-hidden="true"/>
 </div>;
}
export default function Book({spreads,onComplete}){
 const [index,setIndex]=useState(0),[side,setSide]=useState('left'),[isMobile,setIsMobile]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width: 680px)').matches);
 const [turn,setTurn]=useState(null),[speaking,setSpeaking]=useState(false);
 const busy=useRef(false),pointer=useRef(null),timer=useRef(null),indexRef=useRef(index),sideRef=useRef(side),mobileRef=useRef(isMobile);
 indexRef.current=index;sideRef.current=side;mobileRef.current=isMobile;
 useEffect(()=>{
  const media=window.matchMedia('(max-width: 680px)');const update=()=>setIsMobile(media.matches);update();media.addEventListener?.('change',update);
  return ()=>media.removeEventListener?.('change',update);
 },[]);
 const stopSpeech=useCallback(()=>{if('speechSynthesis' in window){window.speechSynthesis.cancel()}setSpeaking(false);},[]);
 useEffect(()=>()=>{clearTimeout(timer.current);if('speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
 const go=useCallback((delta,skipMobileSide=false)=>{
   if(busy.current)return;
   const oldIndex=indexRef.current,oldSide=sideRef.current,mobile=mobileRef.current;
   let nextIndex=oldIndex,nextSide=oldSide;
   if(mobile){if(skipMobileSide&&delta>0){nextSide='left';nextIndex++;}else if(delta>0){if(oldSide==='left')nextSide='right';else {nextSide='left';nextIndex++;}}else{if(oldSide==='right')nextSide='left';else{nextSide='right';nextIndex--;}}}
   else nextIndex+=delta;
   if(nextIndex<0||nextIndex>=spreads.length)return;
   stopSpeech();busy.current=true;
   const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
   setTurn({delta,from:oldIndex,to:nextIndex});
   timer.current=window.setTimeout(()=>{indexRef.current=nextIndex;sideRef.current=nextSide;setIndex(nextIndex);setSide(nextSide);setTurn(null);busy.current=false;},reduced?90:TURN_MS);
 },[spreads.length,stopSpeech]);
 useEffect(()=>{
  const onKey=e=>{if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||isInteractive(e.target)||['INPUT','TEXTAREA','SELECT'].includes(e.target?.tagName))return;if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();go(1)}if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(-1)}};
  document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey);
 },[go]);
 const narration=()=>{
  if(!('speechSynthesis'in window))return;
  if(speaking){stopSpeech();return;}
  const visible=document.querySelector(`.spread-holder[data-position="${index}"] .story-copy`);
  const text=visible?.innerText?.trim()||spreads[index].title;
  stopSpeech();const utterance=new SpeechSynthesisUtterance(text);utterance.lang='en-US';utterance.rate=.88;utterance.onend=()=>setSpeaking(false);utterance.onerror=()=>setSpeaking(false);window.speechSynthesis.speak(utterance);setSpeaking(true);
 };
 const pointerDown=e=>{pointer.current=isInteractive(e.target)?null:{x:e.clientX,y:e.clientY,time:Date.now()}};
 const pointerUp=e=>{const p=pointer.current;pointer.current=null;if(!p||isInteractive(e.target))return;const dx=e.clientX-p.x,dy=e.clientY-p.y;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.4&&Date.now()-p.time<1100)go(dx<0?1:-1)};
 const active=spreads[index]; const maxPosition=isMobile?spreads.length*2:spreads.length;const position=isMobile?index*2+(side==='right'?1:0):index;
 return <section className="storybook-reader" aria-label="Lily and Pip interactive storybook">
  <div className="reader-toolbar"><span className="reader-mini-label">✿ &nbsp; A LITTLE BOOK OF BIG IDEAS</span><button className="narrate-control" aria-label={speaking?'Stop reading aloud':'Read this spread aloud'} onClick={narration} title={speaking?'Stop reading':'Read aloud'}>{speaking?'■ Stop reading':'◖)) Read aloud'}</button></div>
  <div className="book-object"><div className="book-viewport" onPointerDown={pointerDown} onPointerUp={pointerUp}>
   {spreads.map((item,i)=><div key={item.id} className={`spread-holder ${i===index?'visible-spread':''}`} data-position={i} aria-hidden={i!==index} style={{display:i===index?'block':'none'}}>
      <Spread item={item} onComplete={onComplete} onTurnNext={()=>go(1,true)} isMobile={isMobile} activeSide={side}/>
    </div>)}
   {turn&&<div className={`paper-turn ${turn.delta>0?'turn-next':'turn-previous'}`} aria-hidden="true"><div className="paper-turn-front"/><div className="paper-turn-back"/></div>}
   <button type="button" className="book-corner book-corner-prev" aria-label="Turn to previous page" onClick={()=>go(-1)} disabled={position===0||!!turn}><span>↶</span></button>
   <button type="button" className="book-corner book-corner-next" aria-label="Turn to next page" onClick={()=>go(1)} disabled={position>=maxPosition-1||!!turn}><span>↷</span></button>
   </div></div>
  <div className="reader-bottom"><span>{active.kind==='cover'?'THE STORY BEGINS':active.kind==='ending'?'THE END':active.chapterLabel}</span><span>{isMobile?'PAGE':'SPREAD'} {position+1} / {maxPosition}</span></div>
  <p className="navigation-hint">Turn the page by tapping a corner or swiping. Use ← → keys on a keyboard. Games stay where you left them during this reading.</p>
 </section>;
}