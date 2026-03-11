import { ICONS } from '../assets/icons.js';

const nf = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const fmt = (num) => nf.format(num);

export const fmtSigned = (num) => {
  const sign = num > 0 ? '+' : num < 0 ? '-' : '';
  return sign + nf.format(Math.abs(num));
};

export const getDiffTooltip = (diff) =>
  diff >= 0 ? 'Tyle płacimy więcej' : 'Tyle płacimy mniej';

export const getDiffPctTooltip = (diff) =>
  diff >= 0 ? 'Tyle płacimy więcej (%)' : 'Tyle płacimy mniej (%)';

export function getReviewTier(pop) {
  const p = parseFloat(pop);
  if (p >= 43.37) return 'pop-positive-3';
  if (p >= 28.37) return 'pop-positive-2';
  if (p >= 13.37) return 'pop-positive-1';
  if (p >= 0) return 'pop-neutral';
  if (p >= -5) return 'pop-negative-1';
  if (p >= -12) return 'pop-negative-2';
  return 'pop-negative-3';
}

// TODO: duplicate code
export function getReviewReactionSvg(pop) {
  const p = parseFloat(pop);
  if (p >= 43.37) return ICONS.REACTIONS["POSITIVE-3"] + ICONS.THUMBS["UP-RIGHT"].repeat(3);
  if (p >= 28.37) return ICONS.REACTIONS["POSITIVE-2"] + ICONS.THUMBS["UP-RIGHT"].repeat(2);
  if (p >= 13.37) return ICONS.REACTIONS["POSITIVE-1"] + ICONS.THUMBS["UP-RIGHT"];
  if (p >= 0) return ICONS.REACTIONS["NEUTRAL"];
  if (p >= -5) return ICONS.THUMBS["DOWN-LEFT"] + ICONS.REACTIONS["NEGATIVE-3"];
  if (p >= -12) return ICONS.THUMBS["DOWN-LEFT"].repeat(2) + ICONS.REACTIONS["NEGATIVE-2"];
  return ICONS.THUMBS["DOWN-LEFT"].repeat(3) + ICONS.REACTIONS["NEGATIVE-1"];
}

export function getChangeType(change) {
  return change > 0 ? 'valve-increase' : 'valve-decrease';
}


export function waitForElement(selector, timeout = 6666) {
  return new Promise((resolve, reject) => {
    const elem = document.querySelector(selector);
    if (elem) return resolve(elem);

    const observer = new MutationObserver(() => {
      const found = document.querySelector(selector);
      if (found) {
        observer.disconnect();
        resolve(found);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error('Selektor nie znaleziony.'));
    }, timeout);
  });
}
