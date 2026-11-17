import React from 'react';
import Game from './Game.jsx';
export const chapter1Pages=[
{id:'ch1-intro',chapterLabel:'CHAPTER ONE · MACHINE LEARNING',theme:'garden',illustration:'🌸',title:'Where are the butterflies?',subtitle:'Lily notices something strange in her school garden.',Content:()=> <><p>Every spring, Lily saw lots of colorful butterflies in her school garden. But today, she could only find a few.</p><p>“Where did all the butterflies go?” Lily wondered. She called her little robot friend, Pip, for help.</p><p className="story-dialogue">“Of course, Lily! Let’s look for butterflies together!” — Pip</p></>},
{id:'ch1-concept',chapterLabel:'CHAPTER ONE · MACHINE LEARNING',theme:'peach',illustration:'🤖',title:'How does Pip learn?',subtitle:'Learning from examples',Content:()=> <><p>Pip studies pictures of gardens. Some show healthy flowers and happy butterflies. Others show gardens that need help.</p><p>“I look for patterns in examples,” Pip said. “But I can still make mistakes.”</p><p className="concept-pill">BIG IDEA · Machine learning uses examples to discover patterns.</p></>},
{id:'ch1-game',chapterLabel:'CHAPTER ONE · MACHINE LEARNING',theme:'mint',illustration:'🔎',title:'Spot Pip’s mistakes!',subtitle:'Help Pip check its garden picture.',Content:({onComplete})=><Game onComplete={onComplete}/>},
];
