const euFlag = chrome.runtime.getURL('assets/flags/eu.svg');
const plFlag = chrome.runtime.getURL('assets/flags/pl.svg');
const hamburger = ICONS.MENU["hamburger"];

const renderWidget = (data) => {
  if (!data) return '';

  const polishDev = data.isPolishDev ? 'polish-dev' : '';
  const polishDevTooltip = data.isPolishDev ? 'Polski wydawca/developer' : '';

  const diffTooltip = getDiffTooltip(data.diff)
  const diffPctTooltip = getDiffPctTooltip(data.diff)

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
          <div class="flag ${polishDev}" data-tooltip-text="${polishDevTooltip}"><img src="${plFlag}"></div>
          <div class="price">
            <div class="price-value"><span data-tooltip-text="Cena w PLN">${pln}
              <span class="currency"> zł</span></span>
              <span class="valve-diff-pct ${valveTypePln}" data-tooltip-text="Różnica względem ceny rekomendowanej (%)">${valveDiffPctPln}</span>
            </div>
          </div>
          <div class="span-2"></div>
          <div class="valve-recommendation"><span data-tooltip-text="Cena rekomendowana przez Valve">${valvePln}<span class="currency"> zł</span></span></div>
        </div>
        <div class="row">
          <div class="flag"><img src="${euFlag}"></div>
          <div class="price" data-tooltip-text="Cena w EUR przeliczona na PLN">${eurConverted}<span class="currency"> zł</span></div>
          <div class="arrow"><span data-tooltip-text="Kurs EUR/PLN: ${eurRate}">🡄</span></div>
          <div class="price price-left">
            <div class="price-value"><span data-tooltip-text="Cena w EUR">${eur}
              <span class="currency"> €</span></span>
              <span class="valve-diff-pct ${valveTypeEur}" data-tooltip-text="Różnica względem ceny rekomendowanej (%)">${valveDiffPctEur}</span>
              </div>
            </div>
          <div class="valve-recommendation"><span data-tooltip-text="Cena rekomendowana przez Valve">${valveEur}<span class="currency"> €</span></span></div>
        </div>
        <hr class="pop-line" style="--color: var(--${reviewTier})">
        <div class="row ${reviewTier}">
          <div class="price span-2" data-tooltip-text="${diffTooltip}">${diff}
            <span class="currency"> zł</span>
          </div>
          <div class="price span-2 price-left" data-tooltip-text="${diffPctTooltip}">
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

const renderSkeleton = () => {
  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="pop-description span-5">zZzZZZzzZzz...</div>
          <div class="menu">${hamburger}</div>
        </div>
      </div>
    </div>
  `.trim();
};

const renderError = (message) => {
  if (!message) return '';

  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="pop-description span-5">${message}</div>
          <div class="menu">${hamburger}</div>
        </div>
      </div>
    </div>
  `.trim();
};
