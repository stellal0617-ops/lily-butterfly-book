import React,{useMemo,useState} from 'react';
import Book from './components/Book.jsx';
import {chapter1Pages} from './chapters/chapter1/pages.jsx';
import {chapter2Pages} from './chapters/chapter2/pages.jsx';
import {chapter3Pages} from './chapters/chapter3/pages.jsx';
const cover={id:'cover',theme:'cover',chapterLabel:'THE LITTLE GARDEN LIBRARY',illustration:'🦋',title:'Lily and the Mystery of the Missing Butterflies',subtitle:'An interactive AI literacy adventure for curious young detectives',Content:()=> <><p className="cover-lead">A quiet garden. A curious robot. One big question:</p><p className="cover-question">Where did all the butterflies go?</p><div className="cover-credits">3 chapters · 3 mini-games · 1 growing garden</div></>};
const ending={id:'ending',theme:'ending',chapterLabel:'THE SCIENCE FAIR · THE END',illustration:'🌺',title:'The garden grows again',subtitle:'Every good detective keeps learning.',Content:()=> <><p>Lily and Pip learned that examples, feedback and different perspectives can help us make better decisions.</p><p>Now the garden is ready for the science fair!</p><p className="concept-pill">THINK ABOUT IT · How would you check an AI answer?</p></>};
export default function App(){
 const [pageIndex,setPageIndex]=useState(0);
 const [completedGames,setCompletedGames]=useState([]);
 const pages=useMemo(()=>[cover,...chapter1Pages,...chapter2Pages,...chapter3Pages,ending],[]);
 const onComplete=id=>setCompletedGames(prev=>prev.includes(id)?prev:[...prev,id]);
 const jump=id=>setPageIndex(pages.findIndex(p=>p.id===id));
 return <div className="site">
 <header className="site-header"><div className="brand-mark">✿</div><div><strong>THE LITTLE GARDEN LIBRARY</strong><small>Interactive storybook prototype</small></div><div className="header-tag">For grades 2–3 ✦ Made to explore</div></header>
 <div className="site-content"><div className="hero-caption"><div className="eyebrow">A STORY ABOUT AI, CURIOSITY & NATURE</div><h1>Turn the page. <em>Grow an idea.</em></h1><p>Explore Lily and Pip's butterfly mystery, with mini-games inside the book.</p></div>
 <Book pages={pages} current={pageIndex} setCurrent={setPageIndex} completedGames={completedGames} onComplete={onComplete}/>
 <nav className="chapter-links" aria-label="Jump to chapter"><span>JUMP TO A CHAPTER</span><button onClick={()=>jump('ch1-intro')}>01 · Machine Learning</button><button onClick={()=>jump('ch2-intro')}>02 · Feedback</button><button onClick={()=>jump('ch3-intro')}>03 · Fairness</button><button onClick={()=>setPageIndex(0)}>↺ Start over</button></nav></div>
 <footer className="site-footer">A shared foundation for three creative chapter teams • Prototype, not a trained AI model</footer>
 </div>;
}
