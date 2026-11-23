// The Settings menu (the gear in the header, src/components/SettingsMenu.astro): language and Vraki mode,
// remembered in this browser (localStorage, key in <html data-store>). Adapted from Deovandski-repo-template's
// src/scripts/settings.ts; Vraki mode works like husbandoutworld.com's. The inline script in Base.astro applies
// the saved choices before the page paints. Add new settings to the same object.
interface Saved { lang?: string; vraki?: boolean }

const root = document.documentElement;
const KEY = root.dataset.store ?? 'deovandski-site';
const BASE = root.dataset.base ?? '';
const LANG = root.dataset.lang ?? ''; // "" on English pages, "ja", "pt", ... on translated ones

function load(): Saved {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') as Saved; } catch { return {}; }
}
function save(patch: Saved): void {
  try { localStorage.setItem(KEY, JSON.stringify({ ...load(), ...patch })); } catch { /* private mode: lasts for this page only */ }
}

/** The same page in another language: /ja/contact/ <-> /contact/ (the hash, like #multilingual, comes along). */
function langHref(code: string): string {
  let path = location.pathname.slice(BASE.length);
  if (LANG && path.startsWith(`/${LANG}/`)) path = path.slice(LANG.length + 1);
  return BASE + (code === 'en' ? '' : `/${code}`) + path + location.search + location.hash;
}
function goLang(code: string): void {
  save({ lang: code });
  if (code !== (LANG || 'en')) location.href = langHref(code);
}

/** Vraki mode: the English page in the Vraki script. It spells English letters, so it's off on translated pages. */
function setVraki(on: boolean): void {
  root.classList.toggle('vraki', on && !LANG);
  save({ vraki: on });
  document.dispatchEvent(new CustomEvent('vraki-change', { detail: on }));
}

const dialog = document.querySelector<HTMLDialogElement>('#site-settings');
document.querySelector('#gear')?.addEventListener('click', () => dialog?.showModal());
// A click on the dark area around the menu closes it too.
dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

// The banner's "English" link, the Multilingual tab's languages, and anything with data-lang-switch remember the choice.
document.addEventListener('click', (e) => {
  const el = (e.target as Element | null)?.closest<HTMLElement>('[data-lang-switch], [data-vraki-switch]');
  if (!el) return;
  e.preventDefault();
  if (el.dataset.vrakiSwitch !== undefined) {
    if (LANG) { save({ vraki: true }); goLang('en'); } // Vraki mode needs the English page
    else setVraki(!root.classList.contains('vraki'));
    return;
  }
  const code = el.dataset.langSwitch!;
  if (root.classList.contains('vraki') && code !== 'en') setVraki(false);
  else if (code === 'en' && !LANG && root.classList.contains('vraki')) setVraki(false); // "English" while in Vraki: plain English
  goLang(code);
});

const langSelect = dialog?.querySelector<HTMLSelectElement>('[data-setting="lang"]');
if (langSelect) {
  langSelect.value = LANG || 'en';
  langSelect.addEventListener('change', () => {
    if (langSelect.value !== 'en' && root.classList.contains('vraki')) setVraki(false);
    goLang(langSelect.value);
  });
}
const vrakiBox = dialog?.querySelector<HTMLInputElement>('[data-setting="vraki"]');
if (vrakiBox) {
  vrakiBox.checked = root.classList.contains('vraki');
  vrakiBox.disabled = !!LANG;
  vrakiBox.addEventListener('change', () => setVraki(vrakiBox.checked));
  document.addEventListener('vraki-change', () => { vrakiBox.checked = root.classList.contains('vraki'); });
}
