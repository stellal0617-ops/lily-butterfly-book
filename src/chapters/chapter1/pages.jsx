import React from 'react';
import Game from './Game.jsx';
export const chapter1Pages=[
{id:'ch1-intro',chapterLabel:'CHAPTER ONE · MACHINE LEARNING',theme:'garden',illustration:'🦋',title:'The garden is quiet',subtitle:'A mystery begins among the flowers.',Content:()=> <><p>Every spring, Lily counted butterflies in the school garden. But this year, there were hardly any.</p><p>“Where did they all go?” she wondered. Pip, her curious robot friend, blinked awake.</p><p className="story-dialogue">“Maybe we can look for clues together!” — Pip</p></>},
{id:'ch1-concept',chapterLabel:'CHAPTER ONE · MACHINE LEARNING',theme:'peach',illustration:'🤖',title:'How does Pip learn?',subtitle:'Learning from examples',Content:()=> <><p>Pip studies pictures of gardens. Some show healthy flowers and happy butterflies. Others show gardens that need help.</p><p>“I look for patterns in examples,” Pip said. “But I can still make mistakes.”</p><p className="concept-pill">BIG IDEA · Machine learning uses examples to discover patterns.</p></>},
{id:'ch1-game',chapterLabel:'CHAPTER ONE · MACHINE LEARNING',theme:'mint',illustration:'🔎',title:'Spot Pip’s mistakes!',subtitle:'Help Pip check its garden picture.',Content:({onComplete})=><Game onComplete={onComplete}/>},
];
