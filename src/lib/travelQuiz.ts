// The Traveler tab's game (Where in the World Was Deo?, #290): every travel photo as a question, and every place as
// an answer. The photos use the same 1800px webp copies as the Traveler map (same getImage options), so the game adds
// no new files to the site. Words (chatter, facts) live in content/travel-quiz.json.
import { getImage } from 'astro:assets';
import { loadPlaces } from './travel';
import quiz from '../../content/travel-quiz.json';

export async function travelQuiz() {
  const places = loadPlaces();
  const answers = places.map((p) => (p.sub ? { key: p.key, name: p.sub, within: p.countryName, group: p.country } : { key: p.key, name: p.name, group: p.country }));
  const questions = (
    await Promise.all(
      places.map((p) =>
        Promise.all(
          p.photos.map(async (ph) => ({
            src: (await getImage({ src: ph.src, width: Math.min(1800, ph.src.width), format: 'webp', quality: 80 })).src,
            answer: p.key,
          })),
        ),
      ),
    )
  ).flat();
  const keys = new Set([...places.map((p) => p.key), ...places.map((p) => p.country)]);
  return { questions, answers, chatter: quiz.chatter, facts: quiz.facts.filter((f) => keys.has(f.key)) };
}
