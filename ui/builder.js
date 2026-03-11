import { fmt, fmtSigned, getChangeType, getReviewTier, getReviewReactionSvg, getDiffTooltip, getDiffPctTooltip } from '../core/utils.js';
import { ICONS } from '../assets/icons.js';

export const renderWidget = (data) => {
  if (!data) return '';

  const euFlag = chrome.runtime.getURL('assets/flags/eu.svg');
  const plFlag = chrome.runtime.getURL('assets/flags/pl.svg');

  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="flag" style="background-image: url('${plFlag}')"></div>
          <div class="price">
            <div class="price-value"><span data-tooltip-text="Bazowa cena w Polsce">${fmt(data.pln)}
              <span class="currency"> zł</span></span>
              <span class="valve-diff-pct ${getChangeType(data.valveDiffPctPln)}" data-tooltip-text="Różnica od sugerowanej ceny (%)">${fmtSigned(data.valveDiffPctPln)}%</span>
            </div>
          </div>
          <div class="span-2"></div>
          <div class="valve-recommendation"><span data-tooltip-text="Sugerowana cena w Polsce">${fmt(data.valvePln)}<span class="currency"> zł</span></span></div>
        </div>
        <div class="row">
          <div class="flag" style="background-image: url('${euFlag}')"></div>
          <div class="price" data-tooltip-text="Bazowa cena w Europie przeliczona na złotówki">${fmt(data.eurConverted)}<span class="currency"> zł</span></div>
          <div class="arrow"><span data-tooltip-text="EUR/PLN = ${data.eurRate}">🡄</span></div>
          <div class="price price-left">
            <div class="price-value"><span data-tooltip-text="Bazowa cena w Europie">${fmt(data.eur)}
              <span class="currency"> €</span></span>
              <span class="valve-diff-pct ${getChangeType(data.valveDiffPctEur)}" data-tooltip-text="Różnica od sugerowanej ceny (%)">${fmtSigned(data.valveDiffPctEur)}%</span>
              </div>
            </div>
          <div class="valve-recommendation"><span data-tooltip-text="Sugerowana cena w Europie">${fmt(data.valveEur)}<span class="currency"> €</span></span></div>
        </div>
        <hr class="pop-line" style="--color: var(--${getReviewTier(data.pop)})">
        <div class="row ${getReviewTier(data.pop)}">
          <div class="price span-2" data-tooltip-text="${getDiffTooltip(data.diff)}">${fmtSigned(data.diff)}
            <span class="currency"> zł</span>
          </div>
          <div class="price span-2 price-left" data-tooltip-text="${getDiffPctTooltip(data.diff)}">
            <span style="font-weight: 300; margin: 0 3px 0 6px">(</span>${fmtSigned(data.diffPct)}<span class="currency">%</span><span style="font-weight: 300; margin-left: 3px">)</span>
          </div>
          <div class="pop-reaction">${getReviewReactionSvg(data.pop)}</div>
        </div>
        <hr class="pop-line" style="--color: var(--${getReviewTier(data.pop)})">
        <div class="row">
          <div class="pop-description span-4">${data.verdict}</div>
          <div class="menu">${ICONS.MENU["hamburger"]}</div>
        </div>
      </div>
    </div>
  `.trim();
};
