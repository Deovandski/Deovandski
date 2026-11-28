/**
 * kitkot/tricks.ts: the tricks KitKot plays on you, one source for KitKot.astro (its own "Under the hood" list) and
 * KitKotHood.astro (the same list placed somewhere else on the page, like a tab's Links box, #328). Each one lights up
 * while it fires. No imports and no DOM.
 */
export type Trick = { id: string; name: string; text: string; source: string };
export const KITKOT_TRICKS: Trick[] = [
  {
    id: 'variable',
    name: 'Variable rewards',
    text: 'Results are random: usually small, sometimes nothing, rarely huge. Unpredictable rewards are the hardest habit to quit (a variable-ratio schedule).',
    source: 'Ferster & Skinner, Schedules of Reinforcement (1957)',
  },
  {
    id: 'nearmiss',
    name: 'Near miss',
    text: '"Almost went viral!" is still a loss, and it feels worse than a plain miss, yet it makes people want to keep playing. Persistence peaks when about 30% of the losses are near misses.',
    source: 'Clark et al., Neuron 61:481–490 (2009), and the studies it cites',
  },
  {
    id: 'reward',
    name: 'Reward learning',
    text: 'People post more right after a batch of likes, spacing posts to chase the best rate of likes, like an animal in a Skinner box.',
    source: 'Lindström et al., Nature Communications 12:1311 (2021)',
  },
  {
    id: 'hot',
    name: 'The algorithm',
    text: 'One kind of post secretly pays better, and it changes without warning, so you keep trying everything.',
    source: 'Same variable-reward idea, applied to what to post',
  },
  {
    id: 'fatigue',
    name: 'Diminishing returns',
    text: 'Repeat yourself and each post pays less, then starts to cost you followers. The treadmill speeds up.',
    source: 'Hedonic adaptation / audience fatigue',
  },
  {
    id: 'streak',
    name: 'Streaks and loss aversion',
    text: 'A streak you could lose feels worse than one you never had. Losing hurts about twice as much as winning feels good.',
    source: 'Kahneman & Tversky, Prospect Theory (1979)',
  },
  {
    id: 'drip',
    name: 'Notification drip',
    text: 'Likes trickle in a few at a time after you post, so you keep checking.',
    source: 'Schüll, Addiction by Design (2012), on how slot machines are tuned',
  },
  {
    id: 'energy',
    name: 'Energy timers',
    text: 'A meter that refills over time makes you wait, then binge, and keeps you coming back.',
    source: 'Common free-to-play design',
  },
];
