const version = chrome.runtime.getManifest().version

const moreVertical = icons["moreVertical"];
const arrowDropDown = icons["arrowDropDown"];
const coffee = icons["coffee"];
const discord = icons["discord"];
const twitter = icons["twitter"];
const bluesky = icons["bluesky"];
const steam = icons["steam"];
const www = icons["www"];
const facebook = icons["facebook"];
const polishDev = icons['polishDev'];
const polishDevBad = icons['polishDevBad'];
const visibility = icons["visibility"];
const scale = icons["scale"];

// TODO: fix: don't send whole object lol
const renderCurrencyMenu = (cc) => {
  const code = cc.code;

  const isBasicChecked = localStorage.getItem(`pop-${code.toLowerCase()}-basic`) === 'true';
  const isDiffChecked = localStorage.getItem(`pop-${code.toLowerCase()}-diff`) === 'true';

  const flag = code === 'USD' ? flags['USD']() : flags[code];

  return `
    <div class="checkbox-row">
      <span class="flag">${flag}</span>
      <span>${code}</span>

      <label class="icon-toggle icon-toggle-visibility">
        <input type="checkbox" id="pop-${code.toLowerCase()}-basic" ${isBasicChecked ? 'checked' : ''} />
        <span class="icon-toggle-icon">${visibility}</span>
      </label>

      <label class="icon-toggle icon-toggle-scale">
        <input type="checkbox" id="pop-${code.toLowerCase()}-diff" ${isDiffChecked ? 'checked' : ''} />
        <span class="icon-toggle-icon">${scale}</span>
      </label>
    </div>
  `;
}

// TODO: fix: don't send whole object lol
const renderCurrencyBlock = (cc) => {
  const method = 'multi';

  const valve = cc.valve[method];
  const code = cc.code;

  const basicVisible = localStorage.getItem(`pop-${code.toLowerCase()}-basic`) === 'true' ? '' : 'pop-basic-off';
  const diffVisible = localStorage.getItem(`pop-${code.toLowerCase()}-diff`) === 'true' ? '' : 'pop-diff-off';

  const valveDiffType = getValveType(valve.diff_pct);

  const verdict = '';

  const flag = code === 'USD' ? flags['USD']() : flags[code];

  const valveDiffPct = valve.diff_pct !== 0 ? fmtSigned(valve.diff_pct) + '%' : '';

  const popRank = window.pop.pop_rank;

  const [diffClass, reactionSvg] = (code === window.pop.pop_target) ? getReaction(popRank) : ['pop-def', ''];

  let infoBasic = '';

  if (code === 'PLN')
    infoBasic = `
    <div class="pop-currency-block PLN">
      <div class="pop_row pop-basic ${basicVisible}">
        ${window.pop.is_polish_dev ? `
        <div class="flag" data-tooltip-text="Polski wydawca/developer">${popRank < 1 ? polishDevBad : polishDev}</div>` : `
        <div class="flag">${flag}</div>`}

        <div class="pop_price">
          <span data-tooltip-text="Cena w PLN">${fmt(cc.price)}<span class="pop_symbol">zł</span></span>
          <span class="valve-diff-pct valve-diff-value ${valveDiffType}" data-tooltip-text="Różnica względem ceny rekomendowanej (%)">
            ${valve.diff_pct !== 0 ? fmtSigned(valve.diff_pct) + '%' : ''}
          </span>
        </div>
        <div class="span-2"></div>
        <div class="valve-recommendation" data-tooltip-text="Cena rekomendowana przez Valve">
          <span class="valve-price-value">${fmt(valve.price)}</span><span class="pop_symbol"> zł</span>
        </div>
      </div>
    </div>
  `;

  else infoBasic = `
    <div class="pop-currency-block ${code} ${basicVisible}">
      <div class="pop_row pop-basic">
        <div class="flag">${flag}</div>

        <div class="pop_price" data-tooltip-text="Cena w ${code} przeliczona na PLN">${fmt(cc.in_pln)}<span class="pop_symbol">zł</span></div>
        <div class="arrow"><span data-tooltip-text="Kurs ${code}/PLN: ${fmtCurrency(cc.rate)}">🡄</span></div>

        <div class="pop_price pop_price_left">
          <span data-tooltip-text="Cena w ${code}">${fmt(cc.price, code)}<span class="pop_symbol">${cc.symbol}</span></span>

${code !== 'USD' ? `
          <span class="valve-diff-pct ${valveDiffType}" data-tooltip-text="Różnica względem ceny rekomendowanej (%)">
            ${valveDiffPct}
          </span>
` : ''}

        </div>

${code !== 'USD' ? `
        <div class="valve-recommendation" data-tooltip-text="Cena rekomendowana przez Valve"></div>
` : ''}

      </div>
`.trim();

  const infoDiff = `
    <div class='pop-diff-wrapper ${diffVisible}'>
      <div class="pop_row pop-diff ${diffClass} ${verdict}">
        <div class="pop_price" data-tooltip-text='${getDiffTooltip(cc.diff)}'>${fmtSigned(cc.diff)}<span class="pop_symbol">zł</span></div>
        <div class="pop_approx">≈</div>
        <div class="pop_price pop_price_left" data-tooltip-text='${getDiffPctTooltip(cc.diff)}'>${fmtSigned(cc.diff_pct)}<span class="pop_symbol pct" style="margin-left: 2px;">%</span></div>
        <div class="pop_context" data-tooltip-text="${window.pop.pop_desc}">${reactionSvg}</div>
      </div>
    </div>
    </div>
  `.trim();

  return infoBasic + (code === 'PLN' ? '' : infoDiff);
};


const renderWidget = () => {

  const { currencies, valve, /*theme*/ } = window.pop;

  if (!currencies) return;

  const { PLN, GBP, EUR, USD, NOK, CHF, JPY } = currencies;


  return `
    <div id='pop' class="pop block block_content_inner">
      <div class="pop-header">
        <span class="pop-header-title">Is the Price Polished?</span>
        <div class="pop_buttons">
          <button id="valvePowerBtn" class="pop_valve ${valve === 'power' ? 'active' : ''}" data-method="power" data-tooltip-text='Konwersja używająca tylko siły nabywczej'>${icons["valvePower"]}</button>
          <button id="valveExchangeBtn" class="pop_valve ${valve === 'exchange' ? 'active' : ''}" data-method="exchange" data-tooltip-text='Konwersja używająca tylko kursu walut'>${icons["valveExchange"]}</button>
          <button id="valveMultiBtn" class="pop_valve ${valve === 'multi' ? 'active' : ''}" data-method="multi" data-tooltip-text='Konwersja wielozmienna'>${icons["valveMulti"]}</button>
          <button id="valveOldBtn" class="pop_valve ${valve === 'old' ? 'active' : ''}" data-method="old" data-tooltip-text='Archiwalna konwersja (2022-2026)'>${icons["valveOld"]}</button>
          <button id="valveOld2017Btn" class="pop_valve ${valve === 'old2017' ? 'active' : ''}" data-method="old2017" data-tooltip-text='Archiwalna konwersja (2017-2022)'>${icons["valveOld2017"]}</button>
        </div>
        <button id="burgerBtn" class="pop_menu">${moreVertical}</button>
      </div>

      <div class="pop_data">
        ${renderCurrencyBlock(PLN)}
        ${renderCurrencyBlock(EUR)}
        ${renderCurrencyBlock(USD)}
        ${renderCurrencyBlock(NOK)}
        ${renderCurrencyBlock(JPY)}
        ${renderCurrencyBlock(GBP)}
        ${renderCurrencyBlock(CHF)}
      </div>

      <nav class="pop-menu" id="popMenu">
        <div class="pop-menu-inner">
          <div class="currency-list">
            ${renderCurrencyMenu(EUR)}
            ${renderCurrencyMenu(USD)}
            ${renderCurrencyMenu(NOK)}
            ${renderCurrencyMenu(JPY)}
            ${renderCurrencyMenu(GBP)}
            ${renderCurrencyMenu(CHF)}
          </div>


          <button id="toggleSocialsBtn" class="pop-menu-more-btn">
            ${arrowDropDown} 
          </button>


          <div id="popExtraMenu" class="pop-menu-extra pop-socials-hidden">

            <div class="socials">
              <span class="pop-menu-label pop-menu-label-pop"><span style="color: #c72626; margin-right: 2px;">#</span>PolishOurPrices</span>
              <div class="socials-row">
                <a class="social-btn" href="https://discord.gg/exfzeYSpqW" target="_blank" rel="noopener">${discord}</a>
                <a class="social-btn" href="https://store.steampowered.com/curator/45074143" target="_blank" rel="noopener">${steam}</a>
                <a class="social-btn" href="https://polishourprices.pl" target="_blank" rel="noopener">${www}</a>
                <a class="social-btn" href="https://x.com/polishourprices" target="_blank" rel="noopener">${twitter}</a>
                <a class="social-btn" href="https://bsky.app/profile/polishourprices.pl" target="_blank" rel="noopener">${bluesky}</a>
                <a class="social-btn" href="https://www.facebook.com/profile.php?id=61582951236530" target="_blank" rel="noopener">${facebook}</a>
              </div>
            </div>
            <div class="socials">
              <span class="heart">Za tym rozszerzeniem<br>stoją godziny pracy.</span>
              <a class="social-btn coffee" href="https://buycoffee.to/flocc" target="_blank" rel="noopener">${coffee}</a>
              <span class="heart">Doceniasz?<br>Postaw mi kawę ${icons["heart"]}</span>
            </div>

            <div class="pop-menu-version">${version}</div>
          </div>

        </div>
      </nav>
    </div>
    `.trim();

};

const renderSkeleton = () => `
    <div id='pop' class="pop block block_content_inner">
      <div class="pop-header">
        <span class="pop-header-title">Is the Price Polished?</span>
      </div>
      <div>
        <hr style='border: none; border-top: solid 1px #333; margin-bottom: 8px'>
        <span style='color: #73fafe; font-size: 15px;'>Czekamy na odpowiedź... :)</span>
      </div>
    </div>
`.trim();

const renderError = (message) => !message ? '' : `
    <div id='pop' class="pop block block_content_inner">
      <div class="pop-header">
        <span class="pop-header-title">Is the Price Polished?</span>
      </div>
      <div>
        <hr style='border: none; border-top: solid 1px #333; margin-bottom: 8px'>
        <span style='color: inherit; font-size: 15px;'>${message}</span>
      </div>
    </div>
`.trim();
