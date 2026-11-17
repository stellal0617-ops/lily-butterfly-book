import React from 'react';
import Game from './Game.jsx';

export const chapter2Pages = [
  {id:'ch2-intro',chapterLabel:'CHAPTER TWO · AI LIMITATIONS',theme:'peach',illustration:'🌸',title:'The perfect butterfly garden?',subtitle:'Pip has a beautiful new picture.',Content:()=> <><p>To help Lily solve the mystery, Pip made a colorful picture of a butterfly garden. It was full of flowers, butterflies, and beautiful plants.</p><p className="story-dialogue">“Look, Lily! This is a perfect butterfly garden!” — Pip</p><p>But Lily looked closer. Some details did not match what she had learned in science class.</p></>},
  {id:'ch2-concept',chapterLabel:'CHAPTER TWO · AI LIMITATIONS',theme:'garden',illustration:'🔍',title:'Can we trust every detail?',subtitle:'Beautiful does not always mean accurate.',Content:()=> <><p>“Wait, Pip. Are you sure everything in this picture is correct?” Lily asked.</p><p className="story-dialogue">“I created it using patterns I learned. I might make mistakes or miss important details,” Pip replied.</p><p>Lily invited everyone to become Butterfly Detectives and check Pip’s picture with science evidence.</p><p className="concept-pill">BIG IDEA · AI-generated pictures can be inaccurate or incomplete.</p></>},
  {id:'ch2-game',chapterLabel:'CHAPTER TWO · AI LIMITATIONS',theme:'mint',illustration:'🔎',title:'Butterfly Detective!',subtitle:'Spot, investigate, and explain.',Content:({onComplete})=><Game onComplete={onComplete}/>},
];
