import React from 'react';
import Game from './Game.jsx';
import Chapter3Intro from './Chapter3Intro.jsx';
import Chapter3Ending from './Chapter3Ending.jsx';

export const chapter3Pages=[
  {
    id:'ch3-intro',
    chapterLabel:'CHAPTER THREE · HUMAN VALUES & FAIRNESS',
    theme:'garden',illustration:'🦋',title:'A Garden for Everyone',
    subtitle:'Lily and Pip discover that good ideas need careful checking.',
    // Render as a full-bleed layered spread, not a generic text column.
    Content:({onTurnNext})=><Chapter3Intro onTurnNext={onTurnNext}/>
  },
  {
    id:'ch3-game',
    chapterLabel:'CHAPTER THREE · HUMAN VALUES & FAIRNESS',
    theme:'mint',illustration:'🦋',title:'A Garden for Everyone',
    subtitle:'Explore, examine examples, change goals, and check your choices.',
    Content:({onComplete,onTurnNext})=><Game onComplete={onComplete} onTurnNext={onTurnNext}/>
  },
  {
    id:'ch3-reflection',
    chapterLabel:'CHAPTER THREE · HUMAN VALUES & FAIRNESS',
    theme:'garden',illustration:'🦋',title:'What Did We Learn, Pip?',
    subtitle:'The garden was now full of life!',
    Content:()=> <Chapter3Ending/>
  }
];