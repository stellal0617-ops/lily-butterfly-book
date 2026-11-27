import React from 'react';
import './Chapter3Intro.css';

const ROOT = '/chapter3/';
const EXTRA = ROOT + 'extra/';

/**
 * Opening spread for Chapter Three.
 * Layered DOM artwork and editable text; no flattened/generated spread image.
 */
function Cutout({src,className='',alt=''}) {
  return <img src={src} className={'ch3-opening-cutout '+className}
    alt={alt} draggable="false" loading="eager" />;
}

export default function Chapter3Intro({onTurnNext}) {
  return <section className="ch3-opening" aria-label="Chapter 3: the garden mystery begins">
    <img className="ch3-opening-background" src={ROOT+'garden-background.webp'} alt="" draggable="false" />

    <div className="ch3-opening-soft-sky" aria-hidden="true"/>
    <div className="ch3-opening-foliage" aria-hidden="true">
      <Cutout src={EXTRA+'pink-flower-bed.png'} className="ch3-opening-edge-flowers ch3-opening-edge-left"/>
      <Cutout src={EXTRA+'mixed-flower-bed.png'} className="ch3-opening-edge-flowers ch3-opening-edge-right"/>
      <Cutout src={EXTRA+'stepping-stones.png'} className="ch3-opening-stones"/>
    </div>

    <div className="ch3-opening-left">
      <div className="ch3-opening-eyebrow">CHAPTER THREE · A GARDEN FOR EVERYONE</div>

      <div className="ch3-opening-voice">
        <div className="ch3-opening-balloon ch3-opening-lily-balloon">
          <span className="ch3-opening-speaker ch3-opening-speaker-lily">Lily</span>
          <p>“Pip, now that we have everything we need, can you design a <strong className="ch3-opening-beautiful">beautiful</strong> butterfly garden?”</p>
        </div>

        <div className="ch3-opening-balloon ch3-opening-pip-balloon">
          <span className="ch3-opening-speaker ch3-opening-speaker-pip">Pip</span>
          <p>“Of course! I found some garden pictures to help me. Here you go!”</p>
        </div>
      </div>

      <div className="ch3-opening-picture-stack" aria-label="Pip's picture ideas: flowers and an adult butterfly">
        <div className="ch3-opening-picture ch3-opening-picture-pink">
          <Cutout src={ROOT+'pretty-flowers.png'} alt="A picture of colorful flowers"/>
        </div>
        <div className="ch3-opening-picture ch3-opening-picture-purple">
          <Cutout src={ROOT+'nectar-flowers.png'} alt="A picture of flowers"/>
        </div>
        <div className="ch3-opening-picture ch3-opening-picture-butterfly">
          <Cutout src={ROOT+'butterfly.png'} alt="A picture of a butterfly"/>
        </div>
      </div>

      <Cutout src={ROOT+'lily.png'} className="ch3-opening-lily-one" alt="Lily, excited to plan a butterfly garden"/>
      <Cutout src={ROOT+'pip.png'} className="ch3-opening-pip-one" alt="Pip, showing Lily its picture ideas"/>
    </div>

    <div className="ch3-opening-right">
      <div className="ch3-opening-narration ch3-opening-narration-one">
        <p>Pip proudly shows Lily his new design.</p>
        <p>Pip picked the prettiest flowers, just as Lily asked.</p>
      </div>

      <div className="ch3-opening-narration ch3-opening-narration-mystery">
        <p>But wait... something doesn't seem quite right.</p>
        <p><strong>Not everyone in the garden looks happy!</strong></p>
      </div>

      <div className="ch3-opening-easel" role="img"
        aria-label="A partly covered garden plan; the full garden will be revealed on the next page">
        <span className="ch3-opening-easel-clip" aria-hidden="true"/>
        <div className="ch3-opening-easel-paper" aria-hidden="true">
          <div className="ch3-opening-easel-swirl ch3-opening-easel-swirl-one"/>
          <div className="ch3-opening-easel-swirl ch3-opening-easel-swirl-two"/>
          <span className="ch3-opening-plan-flower ch3-opening-plan-flower-one">✿</span>
          <span className="ch3-opening-plan-flower ch3-opening-plan-flower-two">✿</span>
          <span className="ch3-opening-plan-sparkle">✧</span>
          <div className="ch3-opening-plan-fold"/>
        </div>
        <span className="ch3-opening-easel-leg ch3-opening-easel-leg-one" aria-hidden="true"/>
        <span className="ch3-opening-easel-leg ch3-opening-easel-leg-two" aria-hidden="true"/>
      </div>
      <Cutout src={ROOT+'lily.png'} className="ch3-opening-lily-two" alt="Lily takes a closer look at Pip's new design"/>
      <Cutout src={ROOT+'pip.png'} className="ch3-opening-pip-two" alt="Pip points toward the garden plan"/>
      <span className="ch3-opening-question" aria-hidden="true">?</span>
      <button type="button" className="ch3-opening-next" onClick={onTurnNext}
        aria-label="Turn to the interactive garden">
        Let's take a closer look! <span aria-hidden="true">→</span>
      </button>
    </div>
  </section>;
}
