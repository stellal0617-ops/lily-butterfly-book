import React, {useMemo, useState} from 'react';
import Book from './components/Book.jsx';
import {chapter1Pages} from './chapters/chapter1/pages.jsx';
import {chapter2Pages} from './chapters/chapter2/pages.jsx';
import {chapter3Pages} from './chapters/chapter3/pages.jsx';

const cover={id:'cover',theme:'cover',kind:'cover',chapterLabel:'THE LITTLE GARDEN LIBRARY',title:'Lily and the Mystery of the Missing Butterflies',subtitle:'An interactive adventure about curiosity, gardens & AI',illustration:'🦋'};
const ending={id:'celebration',theme:'ending',kind:'ending',chapterLabel:'THE END · OUR GARDEN ADVENTURE',title:'You Did It!',subtitle:'Lily and Pip solved the garden mystery together.',illustration:'🦋'};
const chapters=[
 {id:'chapter1',number:'01',name:'The Butterfly Detective',short:'Learning from examples',pages:chapter1Pages,bridge:'Lily and Pip wrote down what they noticed. One picture was never enough to tell the whole story. They would need more clues from the real garden.',next:'Then Lily noticed something else: fewer flowers were blooming this year.',emoji:'🦋'},
 {id:'chapter2',number:'02',name:'Teaching Pip to Learn',short:'Learning from feedback',pages:chapter2Pages,bridge:'Pip tried again, using Lily’s feedback to choose ways to help the flowers. Slowly, the garden began to change. But Pip kept recommending the same plant.',next:'“What about all the other flowers?” Lily wondered.',emoji:'🌱'},
 {id:'chapter3',number:'03',name:'A Garden for Everyone',short:'Checking for bias and fairness',pages:chapter3Pages,bridge:'Lily and Pip looked again at the whole garden. They checked their examples, tested helpful actions, and made room for different flowers. The garden was ready for butterflies to visit!',next:'Together, they shared their discoveries at the school science fair.',emoji:'🌼'}
];
function makeSpreads(){
 const result=[cover];
 chapters.forEach(ch=>{
  // Four spreads per chapter for this demo. Existing chapter components are unchanged.
  ch.pages.forEach((page,index)=>result.push({...page,kind:page.id.endsWith('-game')?'game':'story',chapterId:ch.id,chapterNumber:ch.number,chapterName:ch.name,chapterShort:ch.short,isChapterOpening:index===0,spreadKey:page.id}));
  result.push({id:`${ch.id}-bridge`,kind:'bridge',theme:'garden',chapterId:ch.id,chapterLabel:ch.pages[0].chapterLabel,chapterNumber:ch.number,chapterName:ch.name,title:'One clue leads to another',subtitle:ch.next,illustration:ch.emoji,bridge:ch.bridge});
 });
 result.push(ending);
 return result;
}
export default function App(){
 const spreads=useMemo(makeSpreads,[]);
 const [completedGames,setCompletedGames]=useState([]);
 const onComplete=id=>setCompletedGames(prev=>prev.includes(id)?prev:[...prev,id]);
 return <div className="site">
   <main className="reader-stage">
     <header className="reader-heading"><span className="library-crest">✳</span><span>THE LITTLE GARDEN LIBRARY</span><span className="reader-subhead">A story about curiosity, butterflies & AI</span></header>
     <Book spreads={spreads} completedGames={completedGames} onComplete={onComplete}/>
     <p className="reader-footnote">An interactive storybook demo for Grades 2–3 · The AI learning games are rule-based demonstrations.</p>
   </main>
 </div>;
}