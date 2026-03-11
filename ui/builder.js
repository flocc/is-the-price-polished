import { fmt, fmtSigned, getValveType, getReviewTier, getReviewReactionSvg, getDiffTooltip, getDiffPctTooltip } from '../core/utils.js';
import { ICONS } from '../assets/icons.js';

const euFlag = chrome.runtime.getURL('assets/flags/eu.svg');
const plFlag = chrome.runtime.getURL('assets/flags/pl.svg');
const hamburger = ICONS.MENU["hamburger"];

export const renderWidget = (data) => {
  if (!data) return '';

  const pln = fmt(data.pln);
  const eur = fmt(data.eur);
  const eurConverted = fmt(data.eurConverted);
  const valvePln = fmt(data.valvePln);
  const valveEur = fmt(data.valveEur);
  const valveDiffPctPln = data.valveDiffPctPln !== 0 ? fmtSigned(data.valveDiffPctPln) + '%' : '';
  const valveDiffPctEur = data.valveDiffPctEur !== 0 ? fmtSigned(data.valveDiffPctEur) + '%' : '';
  const diff = fmtSigned(data.diff);
  const diffPct = fmtSigned(data.diffPct);
  const eurRate = fmt(data.eurRate);
  const pop = data.pop;
  const verdict = data.verdict;

  const valveTypePln = getValveType(data.valveDiffPctPln);
  const valveTypeEur = getValveType(data.valveDiffPctEur);
  const reviewTier = getReviewTier(pop);
  const reviewReactionSvg = getReviewReactionSvg(pop);

  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="flag" style="background-image: url('${plFlag}')"></div>
          <div class="price">
            <div class="price-value"><span data-tooltip-text="Bazowa cena w Polsce">${pln}
              <span class="currency"> zł</span></span>
              <span class="valve-diff-pct ${valveTypePln}" data-tooltip-text="Różnica od sugerowanej ceny (%)">${valveDiffPctPln}</span>
            </div>
          </div>
          <div class="span-2"></div>
          <div class="valve-recommendation"><span data-tooltip-text="Sugerowana cena w Polsce">${valvePln}<span class="currency"> zł</span></span></div>
        </div>
        <div class="row">
          <div class="flag" style="background-image: url('${euFlag}')"></div>
          <div class="price" data-tooltip-text="Bazowa cena w Europie przeliczona na złotówki">${eurConverted}<span class="currency"> zł</span></div>
          <div class="arrow"><span data-tooltip-text="EUR/PLN = ${eurRate}">🡄</span></div>
          <div class="price price-left">
            <div class="price-value"><span data-tooltip-text="Bazowa cena w Europie">${eur}
              <span class="currency"> €</span></span>
              <span class="valve-diff-pct ${valveTypeEur}" data-tooltip-text="Różnica od sugerowanej ceny (%)">${valveDiffPctEur}</span>
              </div>
            </div>
          <div class="valve-recommendation"><span data-tooltip-text="Sugerowana cena w Europie">${valveEur}<span class="currency"> €</span></span></div>
        </div>
        <hr class="pop-line" style="--color: var(--${reviewTier})">
        <div class="row ${reviewTier}">
          <div class="price span-2" data-tooltip-text="${getDiffTooltip(diff)}">${diff}
            <span class="currency"> zł</span>
          </div>
          <div class="price span-2 price-left" data-tooltip-text="${getDiffPctTooltip(diff)}">
            <span style="font-weight: 300; margin: 0 3px 0 6px">(</span>${diffPct}<span class="currency">%</span><span style="font-weight: 300; margin-left: 3px">)</span>
          </div>
          <div class="pop-reaction">${reviewReactionSvg}</div>
        </div>
        <hr class="pop-line" style="--color: var(--${reviewTier})">
        <div class="row">
          <div class="pop-description span-5">${verdict}</div>
          <div class="menu">${hamburger}</div>
        </div>
      </div>
    </div>
  `.trim();
};

export const renderSkeleton = () => {
  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="pop-description span-4">zZzZZZzzZzz...</div>
          <div class="menu">${hamburger}</div>
        </div>
      </div>
    </div>
  `.trim();
};

export const renderError = (message) => {
  if (!message) return '';

  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="pop-description span-4">${message}</div>
          <div class="menu">${hamburger}</div>
        </div>
      </div>
    </div>
  `.trim();
};
