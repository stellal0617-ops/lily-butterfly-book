import React from 'react';
import './Chapter3Intro.css';

/**
 * Chapter 3 opening picture-book spread.
 *
 * The illustrated spread is one image (with the printed text removed).
 * All dialogue, narration, emphasis and the page-turn button are live HTML.
 */
export default function Chapter3Intro({onTurnNext}) {
  return <section className="ch3-opening" aria-label="A Garden for Everyone: story introduction">
    <img
      className="ch3-opening-illustration"
      src="/chapter3/chapter3-opening-art.webp"
      alt=""
      draggable="false"
      loading="eager"
    />

    <div className="ch3-opening-lily-bubble">
      <p>
        “Pip, now that we have everything we need, can you design a{' '}
        <strong className="ch3-opening-beautiful">beautiful</strong> butterfly garden?”
      </p>
      <span className="ch3-opening-attribution">Lily asks.</span>
    </div>

    <div className="ch3-opening-pip-bubble">
      <p>“Of course!” says Pip. “I found some garden pictures to help me. Here you go!”</p>
    </div>

    <div className="ch3-opening-story ch3-opening-story-first">
      Pip proudly shows Lily his new design.
    </div>
    <div className="ch3-opening-story ch3-opening-story-surprise">
      But something doesn’t seem quite right...
    </div>
    <div className="ch3-opening-story ch3-opening-story-clue">
      Not everyone in the garden looks happy!
    </div>

    <button
      type="button"
      className="ch3-opening-page-button"
      onClick={onTurnNext}
      aria-label="Turn the page to look more closely at Pip's garden"
    >
      Let’s take a closer look! <span aria-hidden="true">→</span>
    </button>
  </section>;
}
