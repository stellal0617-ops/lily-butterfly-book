import React from 'react';
import Game from './Game.jsx';
import './chapter2.css';
export const chapter2Pages=[
{id:'ch2-intro',chapterLabel:'CHAPTER TWO · REINFORCEMENT LEARNING',theme:'peach chapter-two',illustration:'🌷',title:'The missing flowers',subtitle:'A new clue appears.',Content:()=> <><p>Lily noticed that the garden had fewer flowers than last year. “Maybe butterflies cannot find enough food!”</p><p>Pip offered to help care for the garden. But which actions would make it better?</p><p className="story-dialogue">“You can help me learn by giving feedback!” — Pip</p></>},
{id:'ch2-concept',chapterLabel:'CHAPTER TWO · REINFORCEMENT LEARNING',theme:'garden chapter-two',illustration:'⭐',title:'Learning from feedback',subtitle:'Try, observe, improve.',Content:()=> <><p>When Pip chooses a helpful action, Lily gives a star. When Pip makes an unhelpful choice, Lily explains why.</p><p>Feedback can help an agent learn which actions lead to better results.</p><p className="concept-pill">BIG IDEA · Reinforcement learning uses actions and rewards.</p></>},
{id:'ch2-game',chapterLabel:'CHAPTER TWO · REINFORCEMENT LEARNING',theme:'mint chapter-two',illustration:'🌻',title:'Train the gardener!',subtitle:'Explore choices and feedback.',Content:({onComplete})=><Game onComplete={onComplete}/>},
];
