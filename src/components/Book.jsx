import React, {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import HTMLFlipBook from 'react-pageflip';

// StPageFlip owns the leaf turn. Games are mounted outside its animated leaves,
// so interactive controls remain clickable and their state survives page turns.
const FlipLeaf=forwardRef(function FlipLeaf({item,side},ref){
 const Content=item.Content;
 const cover=item.kind==='cover',ending=item.kind==='ending',game=item.kind==='game';
 const illustrationFirst=!(item.id==='ch2-concept'||item.id==='ch3-concept');
 const artSide=cover||ending?side==='left':(side==='left')===illustrationFirst;
 return <div className="st-flip-leaf" ref={ref} data-leaf-id={item.id} data-leaf-side={side}>
  <div className={`book-page book-page-${side} theme-${item.theme||'garden'}`}>
   <div className="page-inner">
    <div className="page-cap">{cover?'ONCE UPON A GARDEN':ending?'THE LITTLE GARDEN LIBRARY':item.chapterLabel||'LILY & PIP'}<span>✳</span></div>
    {artSide||game?<div className={`artwork artwork-${item.theme||'garden'}`} aria-hidden="true">
      <div className="art-sun"/><div className="art-hill art-hill-back"/><div className="art-hill art-hill-front"/>
      <span className="leaf leaf-one"/><span className="leaf leaf-two"/><span className="leaf leaf-three"/>
      <span className="art-bloom bloom-one">✿</span><span className="art-bloom bloom-two">✿</span><span className="art-bloom bloom-three">✿</span>
      <div className="art-characters"><span className="art-lily">👧🏽</span><span className="art-pip">🤖</span></div>
      <span className="art-butterfly">{item.illustration||'🦋'}</span>
    </div>:<div className="story-copy">
      {cover?<><div className="cover-ornament">❋ ✦ ❋</div><h1>{item.title}</h1><p>{item.subtitle}</p><p className="cover-blurb">A quiet garden. A curious robot. Where did all the butterflies go?</p></>:
      ending?<><div className="award-mark">🏅</div><h2>You Did It!</h2><p>Lily and Pip found ways to help the garden by learning from examples, listening to feedback, and checking what might be missing.</p><p>The butterflies can visit again! 🦋</p></>:
      <>{item.isChapterOpening&&<span className="chapter-kicker">CHAPTER {item.chapterNumber} · {item.chapterShort}</span>}<h2>{item.title}</h2>{item.subtitle&&<p className="story-subtitle">{item.subtitle}</p>}{item.kind==='bridge'?<p>{item.bridge}</p>:Content?<Content onComplete={()=>{}}/>:null}</>}
    </div>}
    <div className="page-bottom"><span>THE BUTTERFLY MYSTERY</span><span>✿</span></div>
   </div>
  </div>
 </div>;
});

function ActiveGame({item,onComplete}){
 const Content=item.Content;
 return <div className="st-game-card" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()}>
   <div className="game-story-heading"><span>EXPLORE WITH PIP</span><h2>{item.title}</h2><p>{item.subtitle}</p></div>
   <div className="game-area"><Content onComplete={onComplete}/></div>
   <div className="pip-reaction">🤖 Pip says: “Tap a clue to see what happens!”</div>
 </div>;
}

export default function Book({spreads,onComplete}){
 const bookRef=useRef(null);
 const [leafIndex,setLeafIndex]=useState(0);
 const [orientation,setOrientation]=useState('landscape');
 const [speaking,setSpeaking]=useState(false);
 const leaves=useMemo(()=>spreads.flatMap(item=>[{item,side:'left'},{item,side:'right'}]),[spreads]);
 const spreadIndex=Math.floor(leafIndex/2);
 const active=spreads[Math.min(spreadIndex,spreads.length-1)];
 const stopSpeech=useCallback(()=>{if(typeof window!=='undefined'&&'speechSynthesis' in window)window.speechSynthesis.cancel();setSpeaking(false);},[]);
 useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},[]);
 const turn=useCallback(direction=>{
   const api=bookRef.current?.pageFlip?.();
   if(!api)return;
   stopSpeech();
   if(direction>0)api.flipNext('bottom');else api.flipPrev('bottom');
 },[stopSpeech]);
 const handleFlip=useCallback(e=>{setLeafIndex(e.data);stopSpeech();},[stopSpeech]);
 const handleOrientation=useCallback(e=>setOrientation(e.data),[]);
 useEffect(()=>{
   const onKey=e=>{
    const target=e.target;
    if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(target?.tagName)||target?.closest?.('.mini-game'))return;
    if(e.key==='ArrowRight'||e.key==='PageDown'){e.preventDefault();turn(1)}
    if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();turn(-1)}
   };
   window.addEventListener('keydown',onKey);
   return()=>window.removeEventListener('keydown',onKey);
 },[turn]);
 const speak=()=>{
  if(!('speechSynthesis' in window))return;
  if(speaking){stopSpeech();return;}
  const currentLeaf=leaves[leafIndex];
  const textNode=document.querySelector(`[data-leaf-id="${currentLeaf.item.id}"][data-leaf-side="${currentLeaf.side}"] .story-copy`);
  const text=textNode?.textContent?.trim()||active.title;
  stopSpeech();
  const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=.9;u.onend=()=>setSpeaking(false);u.onerror=()=>setSpeaking(false);
  window.speechSynthesis.speak(u);setSpeaking(true);
 };
 return <section className="storybook-reader stpageflip-demo" aria-label="Interactive paper-curl storybook">
   <div className="reader-toolbar"><span className="reader-mini-label">✿ &nbsp; STPAGEFLIP · PAPER CURL DEMO</span>
     <button className="narrate-control" type="button" onClick={speak}>{speaking?'■ Stop reading':'◖)) Read aloud'}</button>
   </div>
   <div className="st-book-stage">
    <HTMLFlipBook ref={bookRef}
      width={500} height={625} size="stretch"
      minWidth={260} maxWidth={540} minHeight={325} maxHeight={675}
      drawShadow={true} maxShadowOpacity={0.48} flippingTime={950}
      usePortrait={true} showCover={false} mobileScrollSupport={true}
      swipeDistance={40} clickEventForward={true} useMouseEvents={true}
      disableFlipByClick={true} autoSize={false}
      renderOnlyPageLengthChange={true}
      onFlip={handleFlip} onChangeOrientation={handleOrientation}
      className="st-flipbook">
      {leaves.map(({item,side})=><FlipLeaf key={item.id+'-'+side} item={item} side={side}/>)}
    </HTMLFlipBook>
    {spreads.filter(s=>s.kind==='game').map(item=><div key={item.id} className="st-game-layer" style={{display:active.id===item.id?'flex':'none'}} aria-hidden={active.id!==item.id}>
      <ActiveGame item={item} onComplete={onComplete}/>
    </div>)}
    <button type="button" className="st-corner st-corner-prev" aria-label="Turn back one page" onClick={()=>turn(-1)} disabled={leafIndex===0}>↶</button>
    <button type="button" className="st-corner st-corner-next" aria-label="Turn forward one page" onClick={()=>turn(1)} disabled={leafIndex>=leaves.length-(orientation==='landscape'?2:1)}>↷</button>
   </div>
   <div className="reader-bottom"><span>{active.kind==='cover'?'THE STORY BEGINS':active.kind==='ending'?'THE END':active.chapterLabel}</span><span>{orientation==='portrait'?'PAGE':'SPREAD'} {orientation==='portrait'?leafIndex+1:spreadIndex+1} / {orientation==='portrait'?leaves.length:spreads.length}</span></div>
   <p className="navigation-hint">Try dragging a page corner. You can also tap a corner or use the ← → keys. Games preserve progress during this reading.</p>
 </section>;
}