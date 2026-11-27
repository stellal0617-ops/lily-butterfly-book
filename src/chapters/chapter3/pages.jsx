import React from 'react';
import Game from './Game.jsx';
import Chapter3Intro from './Chapter3Intro.jsx';

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
    theme:'peach',illustration:'🌼',title:'What Did Pip Learn?',
    subtitle:'Goals matter. Examples matter. People matter.',
    Content:()=> <>
      <p><strong>Goals matter.</strong> Pip designed the garden differently when Lily changed what she asked for.</p>
      <p><strong>Examples matter.</strong> Pip's first pictures showed adult butterflies but missed caterpillars and milkweed. Missing examples can give AI an incomplete picture.</p>
      <p><strong>People matter.</strong> Lily checked the recommendation and helped Pip notice what was missing.</p>
      <p>“AI can help us make choices,” Lily says, “but we should always ask whose needs might have been left out.”</p>
      <p className="concept-pill">BIG IDEA · Check the goals, check the examples, and check the results!</p>
    </>
  }
];