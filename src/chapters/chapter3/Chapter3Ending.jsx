import React from 'react';
import './Chapter3Ending.css';

/**
 * Chapter 3 ending and reflection: the user's approved, full-bleed artwork.
 * The text is part of the illustration, not drawn over it again.
 */
export default function Chapter3Ending() {
  return <section className="ch3-ending" aria-label="Lily and Pip reflect on their butterfly garden">
    <img
      className="ch3-ending-illustration"
      src="/chapter3/ch3-ending-full.webp"
      width="1536" height="960"
      alt="Lily and Pip smile in their thriving butterfly garden. On the other page, they discuss goals, seeing more examples, and checking AI ideas together."
      draggable="false"
      decoding="async"
      loading="eager"
    />
    <div className="ch3-ending-readable" aria-label="Read the ending and reflection">
      <div className="ch3-ending-readable-left">
        The garden was now full of life! Butterflies fluttered, flowers bloomed,
        and caterpillars munched on milkweed. Lily and Pip looked around and smiled.
        Together, they had made a happier home for everyone!
      </div>
      <div className="ch3-ending-readable-right">
        What Did We Learn, Pip?
        Pip: You asked me to make a beautiful garden, so I focused on pretty flowers!
        Lily: Next time, I'll tell you all the things that matter!
        Pip: I only saw pictures of grown-up butterflies!
        Lily: Let's show you more kinds of examples!
        Pip: My first garden wasn't perfect!
        Lily: That's why we check AI's ideas and make them better together!
      </div>
    </div>
  </section>;
}
