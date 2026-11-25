import React, { useEffect, useState } from 'react';
import './Game.css';

/**
 * Chapter 3 – Human Values & Fairness
 * A single, full-spread garden. Lily observes from the bottom left,
 * Pip explains from the bottom right, and the garden changes in the middle.
 * The game uses only artwork in public/chapter3 and public/chapter3/extra.
 */
const BASE = '/chapter3/';
const EXTRA = BASE + 'extra/';
const goals = [
  { id: 'pretty', label: 'Make it pretty', image: 'goal-pretty-button.png' },
  { id: 'budget', label: 'Save money', image: 'goal-budget-button.png' },
  { id: 'habitat', label: 'Help butterflies', image: 'goal-butterflies-button.png' }
];
const freshGame = () => ({
  step: 'explore',
  explored: [],
  checked: [],
  tried: ['pretty'],
  selected: 'pretty',
  pair: []
});
const initialLines = {
  lily: "It's beautiful! Let's see who can live here.",
  pip: "I picked lots of bright flowers, Lily!"
};
const goalLines = {
  pretty: "I chose lots of colorful flowers.",
  budget: "I used fewer plants to save money.",
  habitat: "I added nectar flowers AND milkweed!"
};
const dualLines = {
  'budget+pretty': "We can save money and still add some color!",
  'habitat+pretty': "We can make it beautiful AND help caterpillars!",
  'budget+habitat': "We can help monarchs while keeping costs down!"
};
const has = (items, id) => items.includes(id);

function PlantImage({ name, className = '', alt = '' }) {
  return <img className={'ch3-art ' + className} src={EXTRA + name + '.png'} alt={alt} draggable="false" loading="eager" />;
}

export default function Game({ onComplete }) {
  const [game, setGame] = useState(freshGame);
  const [lines, setLines] = useState(initialLines);
  const [speaking, setSpeaking] = useState(false);
  const step = game.step;
  const combination = step === 'combine' || step === 'check' || step === 'finished';
  const active = combination ? (game.pair.length ? game.pair : [game.selected]) : [game.selected];
  const hasHabitat = has(active, 'habitat');
  const hasPretty = has(active, 'pretty');
  const hasBudget = has(active, 'budget');
  const dual = active.length === 2;
  const pairKey = [...active].sort().join('+');
  const garden = hasHabitat ? 'habitat' : hasBudget ? 'budget' : 'pretty';
  const canInspect = ['explore', 'choose', 'combine', 'check'].includes(step);
  const exploredBoth = has(game.explored, 'butterfly') && has(game.explored, 'caterpillar');
  const checkedBoth = has(game.checked, 'butterfly') && has(game.checked, 'caterpillar');

  useEffect(() => () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  function stopReading() {
    if (typeof window !== 'undefined' && window.speechSynthesis) window.speechSynthesis.cancel();
    setSpeaking(false);
  }

  function readAloud() {
    if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    if (speaking) { stopReading(); return; }
    window.speechSynthesis.cancel();
    const utterance = new window.SpeechSynthesisUtterance('Lily says: ' + lines.lily + ' Pip says: ' + lines.pip);
    utterance.lang = 'en-US';
    utterance.rate = 0.86;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }

  function goTo(next) {
    stopReading();
    setGame(old => ({
      ...old,
      step: next,
      checked: next === 'check' ? [] : old.checked,
      pair: next === 'combine' ? [] : old.pair
    }));
    if (next === 'explain') {
      setLines({
        lily: "The butterfly found nectar. What about the caterpillar?",
        pip: "Oops! I focused on pretty flowers. I forgot milkweed!"
      });
    } else if (next === 'choose') {
      setLines({
        lily: "Let's try a different goal. What changes?",
        pip: "Your goal tells me what to focus on!"
      });
    } else if (next === 'combine') {
      setLines({
        lily: "Could two goals make a better garden?",
        pip: "Choose TWO things that matter!"
      });
    } else if (next === 'check') {
      setLines({
        lily: "Let's check BOTH the butterfly and caterpillar!",
        pip: dualLines[pairKey] || "I'll show you the new garden!"
      });
    }
  }

  function inspect(who) {
    if (!canInspect) return;
    const inCheck = step === 'check';
    setGame(old => ({
      ...old,
      explored: step === 'explore' ? [...new Set([...old.explored, who])] : old.explored,
      checked: inCheck ? [...new Set([...old.checked, who])] : old.checked
    }));
    stopReading();
    if (who === 'butterfly') {
      setLines({
        lily: "The adult butterfly found nectar flowers!",
        pip: "Adult butterflies drink nectar from flowers."
      });
    } else if (who === 'caterpillar') {
      setLines(hasHabitat ? {
        lily: "Look! The caterpillar found milkweed leaves!",
        pip: "Milkweed helps monarch caterpillars grow."
      } : {
        lily: "Oh no! The caterpillar is still hungry.",
        pip: "I forgot milkweed. Monarch caterpillars need its leaves!"
      });
    } else if (who === 'flowers') {
      setLines({
        lily: "These flowers are pretty. Do they help everyone?",
        pip: "Nectar feeds adults, but monarch babies need milkweed."
      });
    } else {
      setLines({
        lily: "That's milkweed! Look at its big green leaves.",
        pip: "Monarch caterpillars can eat those leaves."
      });
    }
  }

  function chooseGoal(id) {
    stopReading();
    setGame(old => ({
      ...old,
      selected: id,
      tried: [...new Set([...old.tried, id])]
    }));
    setLines({
      lily: id === 'habitat' ? "Now look! Who has food in this garden?" :
        id === 'budget' ? "It costs less. Did we remember the caterpillar?" :
          "Such lovely colors! Who might be missing?",
      pip: goalLines[id]
    });
  }

  function toggleGoal(id) {
    stopReading();
    const next = has(game.pair, id)
      ? game.pair.filter(item => item !== id)
      : game.pair.length < 2 ? [...game.pair, id] : [game.pair[1], id];
    setGame(old => ({ ...old, pair: next }));
    const key = [...next].sort().join('+');
    setLines({
      lily: next.length < 2 ? "Choose one more goal for Pip!" :
        next.includes('habitat') ? "Great! Now let's check the animals." :
          "It looks good. But did we forget anyone?",
      pip: next.length === 2 ? dualLines[key] : next.length ? goalLines[next[0]] : "Pick two important goals!"
    });
  }

  function finish() {
    stopReading();
    setGame(old => ({ ...old, step: 'finished' }));
    setLines({
      lily: "We checked the garden and helped everyone!",
      pip: "AI needs people to check its choices and what it missed!"
    });
    if (onComplete) onComplete('chapter3');
  }

  function restart() {
    stopReading();
    setGame(freshGame());
    setLines(initialLines);
  }

  function GoalChoices({ multiple = false }) {
    return <div className="ch3-goal-choices" role="group" aria-label={multiple ? 'Choose two garden goals' : 'Choose a garden goal'}>
      {goals.map(goal => {
        const chosen = multiple ? has(game.pair, goal.id) : game.selected === goal.id;
        return <button key={goal.id} type="button"
          className={'ch3-goal-card' + (chosen ? ' is-selected' : '')}
          onClick={() => multiple ? toggleGoal(goal.id) : chooseGoal(goal.id)}
          aria-pressed={chosen} aria-label={goal.label}
          title={goal.label}>
          <PlantImage name={goal.image} />
          <span className="ch3-sr-only">{goal.label}</span>
        </button>;
      })}
    </div>;
  }

  return <section className="mini-game ch3-garden-game"
    aria-label="Chapter 3: Who did Pip think about?"
    onPointerDown={event => event.stopPropagation()}
    onPointerUp={event => event.stopPropagation()}>
    <div className="ch3-stage" data-step={step} data-garden={garden}
      data-dual={dual ? pairKey : 'none'} data-milkweed={hasHabitat ? 'yes' : 'no'}>
      <img className="ch3-background" src={BASE + 'garden-background.webp'} alt="" draggable="false" />

      {/* The scenery frames ONE interactive garden across both pages. */}
      <PlantImage name="trellis" className="ch3-trellis" />
      <PlantImage name="stone-pond" className="ch3-pond" />
      <PlantImage name="garden-bench" className="ch3-bench" />
      <PlantImage name="garden-sign" className="ch3-wood-sign" />
      <PlantImage name="stepping-stones" className="ch3-stones" />
      <PlantImage name="water-can" className="ch3-watering-can" />
      <PlantImage name="pink-flower-bed" className="ch3-border-flowers ch3-border-flowers-left" />
      <PlantImage name="mixed-flower-bed" className="ch3-border-flowers ch3-border-flowers-right" />
      <PlantImage name="garden-pretty-bed" className="ch3-main-bed ch3-bed-pretty" />
      <PlantImage name="garden-budget-bed" className="ch3-main-bed ch3-bed-budget" />
      <PlantImage name="garden-habitat-bed" className="ch3-main-bed ch3-bed-habitat" />
      <PlantImage name="pink-flower-bed" className="ch3-goal-accent ch3-goal-accent-pretty" />
      <PlantImage name="raised-flower-bed" className="ch3-goal-accent ch3-goal-accent-budget" />
      <PlantImage name="milkweed-bed-sign" className="ch3-plant-sign ch3-milkweed-sign" />
      <PlantImage name="nectar-bed-sign" className="ch3-plant-sign ch3-nectar-sign" />

      <div className="ch3-heading">
        <span className="ch3-eyebrow">CHAPTER 3 · THE GARDEN EXPERIMENT</span>
        <h3>{step === 'explore' ? 'Who Can Live Here?' :
          step === 'explain' ? 'What Did Pip Forget?' :
            step === 'choose' ? "Change Pip's Goals!" :
              step === 'combine' ? 'Two Goals, One Garden!' :
                step === 'check' ? 'Check the New Garden!' : 'A Garden for Everyone!'}</h3>
        <p>{step === 'explore' ? 'Tap the butterfly and the caterpillar.' :
          step === 'explain' ? 'AI follows the priorities we give it.' :
            step === 'choose' ? 'Try different goals and watch the garden change.' :
              step === 'combine' ? 'Choose two priorities to guide Pip.' :
                step === 'check' ? 'Did Pip remember what both animals need?' :
                  'We can improve AI ideas by checking what was missed.'}</p>
      </div>

      {/* Inspectable garden visitors: their reactions change when the goals change. */}
      <button type="button" className="ch3-visitor ch3-visitor-butterfly"
        onClick={() => inspect('butterfly')} disabled={!canInspect}
        aria-label="Inspect adult monarch butterfly">
        <PlantImage name="butterfly-adult" />
        {canInspect && <span className="ch3-tap-spark" aria-hidden="true">✦</span>}
      </button>
      <button type="button" className="ch3-visitor ch3-visitor-caterpillar"
        onClick={() => inspect('caterpillar')} disabled={!canInspect}
        aria-label="Inspect monarch caterpillar">
        <PlantImage name={hasHabitat ? 'caterpillar-fed' : 'caterpillar-looking'} />
        {canInspect && <span className="ch3-tap-spark" aria-hidden="true">✦</span>}
      </button>
      {canInspect && <button type="button" className="ch3-clue ch3-clue-flower"
        aria-label="Inspect the flowers" title="Look at the flowers"
        onClick={() => inspect('flowers')}>✦</button>}
      {canInspect && hasHabitat && <button type="button" className="ch3-clue ch3-clue-milkweed"
        aria-label="Inspect milkweed" title="Look at the milkweed"
        onClick={() => inspect('milkweed')}>✦</button>}

      {/* Character anchors never swap sides. Their dialogue lives above them. */}
      <img className="ch3-character ch3-character-lily" src={BASE + 'lily.png'} alt="Lily, observing from the left" draggable="false" />
      <img className="ch3-character ch3-character-pip" src={BASE + 'pip.png'} alt="Pip, the AI robot, on the right" draggable="false" />
      <div className="ch3-speech ch3-speech-lily">
        <PlantImage name="bubble-lily" />
        <span>{lines.lily}</span>
      </div>
      <div className="ch3-speech ch3-speech-pip" role="status" aria-live="polite">
        <PlantImage name="bubble-pip" />
        <span>{lines.pip}</span>
      </div>

      <button type="button" className="ch3-read-aloud" onClick={readAloud}
        aria-label={speaking ? 'Stop reading aloud' : 'Read Lily and Pip dialogue aloud'}
        title={speaking ? 'Stop reading' : 'Read dialogue aloud'}>
        {speaking ? '■' : '♫'} <span>{speaking ? 'Stop' : 'Listen'}</span>
      </button>

      <div className="ch3-control-dock" aria-label="Garden game controls">
        {step === 'explore' && <div className="ch3-control-content">
          <strong>Garden detective</strong>
          <span className="ch3-dock-hint">{game.explored.length}/2 visitors checked · Find the butterfly and caterpillar</span>
          <button type="button" className="ch3-primary" disabled={!exploredBoth}
            onClick={() => goTo('explain')}>What did Pip miss? <span aria-hidden="true">→</span></button>
        </div>}

        {step === 'explain' && <div className="ch3-control-content">
          <strong>One goal can leave someone out!</strong>
          <span className="ch3-dock-hint">Adult butterflies drink nectar. Monarch caterpillars need milkweed leaves.</span>
          <button type="button" className="ch3-primary" onClick={() => goTo('choose')}>Help Pip choose again <span aria-hidden="true">→</span></button>
        </div>}

        {step === 'choose' && <div className="ch3-control-content">
          <strong>What should Pip focus on?</strong>
          <GoalChoices />
          <div className="ch3-dock-actions">
            <span className="ch3-dock-hint">Explore at least two goals · {game.tried.length}/3 tried</span>
            <button type="button" className="ch3-primary" disabled={game.tried.length < 2}
              onClick={() => goTo('combine')}>Try two goals <span aria-hidden="true">→</span></button>
          </div>
        </div>}

        {step === 'combine' && <div className="ch3-control-content">
          <strong>What TWO things matter most?</strong>
          <GoalChoices multiple />
          <div className="ch3-dock-actions">
            <span className="ch3-dock-hint">{game.pair.length}/2 selected</span>
            <button type="button" className="ch3-primary" disabled={game.pair.length !== 2}
              onClick={() => goTo('check')}>Check our garden <span aria-hidden="true">→</span></button>
          </div>
        </div>}

        {step === 'check' && <div className="ch3-control-content">
          <strong>Who did Pip remember?</strong>
          <span className="ch3-dock-hint">Tap BOTH visitors to check · {game.checked.length}/2 checked</span>
          <div className="ch3-dock-actions">
            <button type="button" className="ch3-secondary" onClick={() => goTo('combine')}>↶ Change goals</button>
            {hasHabitat && checkedBoth && <button type="button" className="ch3-primary"
              onClick={finish}>Celebrate! <span aria-hidden="true">✦</span></button>}
            {!hasHabitat && checkedBoth && <span className="ch3-dock-hint ch3-try-again">Milkweed is missing. Try a habitat goal!</span>}
          </div>
        </div>}

        {step === 'finished' && <div className="ch3-control-content ch3-celebrate">
          <strong>✦ We made a better garden! ✦</strong>
          <span className="ch3-dock-hint">People set AI goals, and people check whose needs were missed.</span>
          <button type="button" className="ch3-primary" onClick={restart}>Play again ↶</button>
        </div>}
      </div>
    </div>
  </section>;
}
