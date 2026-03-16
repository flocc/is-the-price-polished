const euFlag = chrome.runtime.getURL('assets/flags/eu.svg');
const plFlag = chrome.runtime.getURL('assets/flags/pl.svg');
const hamburger = ICONS.MENU["hamburger"];

const renderWidget = (data) => {
  if (!data) return '';

  const { currencies, pop_score, verdict, is_polish_dev } = data;
  const { pln, eur } = currencies;

  const polishDevClass = is_polish_dev ? 'polish-dev' : '';
  const polishDevTooltip = is_polish_dev ? 'Polski wydawca/developer' : '';

  const diffTooltip = getDiffTooltip(eur.diff);
  const diffPctTooltip = getDiffPctTooltip(eur.diff_pct);

  const plnPrice = fmt(pln.price);
  const eurPrice = fmt(eur.price);
  const eurConverted = fmt(eur.in_pln);
  const valvePln = fmt(pln.valve);
  const valveEur = fmt(eur.valve);
  
  const valveDiffPctPln = pln.valve_diff_pct !== 0 ? fmtSigned(pln.valve_diff_pct) + '%' : '';
  const valveDiffPctEur = eur.valve_diff_pct !== 0 ? fmtSigned(eur.valve_diff_pct) + '%' : '';
  
  const diff = fmtSigned(eur.diff);
  const diffPct = fmtSigned(eur.diff_pct);
  const eurRate = fmt(eur.rate);

  const valveTypePln = getValveType(pln.valve_diff_pct);
  const valveTypeEur = getValveType(eur.valve_diff_pct);
  
  const reviewTier = getReviewTier(pop_score);
  const reviewReactionSvg = getReviewReactionSvg(pop_score);

  return `
    <div id="pop" class="block pop">
      <div class="block_content_inner">
        <div class="row">
          <div class="flag ${polishDevClass}" data-tooltip-text="${polishDevTooltip}"><img src="${plFlag}"></div>
          <div class="price">
            <div class="price-value">
              <span data-tooltip-text="Cena w PLN">${plnPrice}<span class="currency"> zł</span></span>
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
            <div class="price-value">
              <span data-tooltip-text="Cena w EUR">${eurPrice}<span class="currency"> €</span></span>
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
