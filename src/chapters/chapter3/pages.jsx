import React from 'react';
import Game from './Game.jsx';
export const chapter3Pages=[
{id:'ch3-intro',chapterLabel:'CHAPTER THREE · AI BIAS & FAIRNESS',theme:'garden',illustration:'🌻',title:'Pip picks only sunflowers',subtitle:'Something is missing from the recommendations.',Content:()=> <><p>Pip keeps suggesting sunflowers. But Lily remembers that butterflies visit many kinds of flowers.</p><p>“Did you learn about all the plants in our garden?” she asks.</p><p className="story-dialogue">“I mostly saw sunflowers,” Pip admits.</p></>},
{id:'ch3-concept',chapterLabel:'CHAPTER THREE · AI BIAS & FAIRNESS',theme:'peach',illustration:'🌎',title:'Whose examples are missing?',subtitle:'Data affects what AI recommends.',Content:()=> <><p>If Pip learns from a narrow set of examples, it might miss flowers important to the garden.</p><p>Lily wants to look at more plants and consider what the butterflies really need.</p><p className="concept-pill">BIG IDEA · AI recommendations depend on data and goals.</p></>},
{id:'ch3-game',chapterLabel:'CHAPTER THREE · AI BIAS & FAIRNESS',theme:'mint',illustration:'🪻',title:'Help Pip see more choices',subtitle:'Explore the missing examples.',Content:({onComplete})=><Game onComplete={onComplete}/>},
];
