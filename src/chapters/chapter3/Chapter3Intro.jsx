import React from 'react';
import './Chapter3Intro.css';

/**
 * One high-quality 8:5 full-bleed illustration matching the chapter's prototype art.
 * Its lettering is part of the artwork, not duplicated as HTML.
 */
export default function Chapter3Intro({onTurnNext}) {
  return <section className="ch3-opening" aria-label="Lily and Pip plan a butterfly garden">
    <img
      className="ch3-opening-illustration"
      width="1536" height="960"
      src="/chapter3/ch3-intro-full.webp"
      alt="Lily asks Pip to design a beautiful butterfly garden. Pip shows her garden pictures and a new design, but something does not seem quite right. Not everyone in the garden looks happy."
      draggable="false"
      loading="eager"
      decoding="async"
    />
    <button
      className="ch3-opening-next-hotspot"
      type="button"
      onClick={onTurnNext}
      aria-label="Let's take a closer look! Turn the page to the interactive garden"
      title="Let's take a closer look!"
    >
      <span className="ch3-opening-screen-reader-only">Let's take a closer look! Turn the page.</span>
    </button>
  </section>;
}
