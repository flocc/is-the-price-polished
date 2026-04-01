const nfSigned = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero'
});

const nfCurrency = new Intl.NumberFormat('pl-PL', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4
});

const fmtSigned = v => {
  if (v == null) return '';
  const parts = nfSigned.formatToParts(v / 100);
  
  return parts.map(part => {
    if (part.type === 'plusSign' || part.type === 'minusSign') {
      return `<span class="pop_sign">${part.value}</span>`;
    }
    return part.value;
  }).join('');
};

const fmtCurrency = v => {
  if (v == null) return '';
  return nfCurrency.format(v / 10000);
};

const fmt = (price, code = null) => {
  const val = (price / 100);
  const precision = (code === 'JPY') ? 0 : 2;
  return val.toFixed(precision).replace('.', ',');
};

const getDiffTooltip = (diff) =>
  diff >= 0 ? 'Tyle płacimy więcej' : 'Tyle płacimy mniej';

const getDiffPctTooltip = (diff) =>
  diff >= 0 ? 'Tyle płacimy więcej (%)' : 'Tyle płacimy mniej (%)';

function getValveType(change) {
  return change > 0 ? 'valve-increase' : 'valve-decrease';
}

function getReaction(popRank) {
  const n = Math.abs(popRank);
  const diffClass = (popRank > 0) ? `pop-pos-${n}` : (popRank < 0) ? `pop-neg-${n}` : 'pop-neu';

  const theme = window.pop.currentTheme || 'material';
  const thumb = themes[theme]["pop-thumb"];
  const head = themes[theme][diffClass];

  return [diffClass, `<div class="pop-thumb">${thumb}</div>`.repeat(n) + `<div class="pop-head">${head}</div>`];
}


function initValveMethodHook() {
  document.querySelector('.pop-header').addEventListener('click', (e) => {
    const btn = e.target.closest('.pop_valve');
    if (!btn) return;

    const method = btn.id.replace('valve', '').replace('Btn', '').toLowerCase();

    updateValveMethod(method);
  });
}


function updateValveMethod(valveMethod = null) {
  if (valveMethod)
    localStorage.setItem('pop-valve', valveMethod);
  else
    valveMethod = localStorage.getItem('pop-valve') ?? 'multi';

  document.querySelectorAll('.pop_valve').forEach(btn => {
    btn.classList.toggle('active', btn.id.toLowerCase().includes(valveMethod));
  });

  const currencies = window.pop.currencies;

  Object.keys(currencies).forEach(cc => {
    const code = currencies[cc].code;
    const valve = currencies[cc].valve[valveMethod];

    const block = document.querySelector(`.pop-currency-block.${code}`);
    
    if (block) {
      const valvePrice = block.querySelector('.valve-recommendation');
      const valveDiffPct = block.querySelector('.valve-diff-pct');

      if (valvePrice) valvePrice.textContent = `${fmt(valve.price, code)} ${currencies[cc].symbol}`;
      if (valveDiffPct) {
        valveDiffPct.innerHTML = valve.diff_pct !== 0 ? fmtSigned(valve.diff_pct) + '%' : '';
      }
    }
  });
}


function initCurrencyToggle(cc) {
  const basicToggle = document.getElementById(`pop-${cc.toLowerCase()}-basic`);
  const diffToggle = document.getElementById(`pop-${cc.toLowerCase()}-diff`);

  const basicBlock = document.querySelector(`.pop-currency-block.${cc}`);
  const diffBlock = basicBlock.querySelector(`.${cc} .pop-diff-wrapper`);

    console.log(diffBlock);

  function update() {
    const isBasicVisible = basicToggle.checked;
    const isDiffVisible = diffToggle.checked;

    localStorage.setItem(`pop-${cc.toLowerCase()}-basic`, isBasicVisible ? 'true' : 'false');
    localStorage.setItem(`pop-${cc.toLowerCase()}-diff`, isDiffVisible ? 'true' : 'false');

    basicBlock.classList.remove('pop-basic-on', 'pop-basic-off');
    diffBlock.classList.remove('pop-diff-on', 'pop-diff-off');

    basicBlock.classList.add(isBasicVisible ? 'pop-basic-on' : 'pop-basic-off');
    diffBlock.classList.add(isDiffVisible ? 'pop-diff-on' : 'pop-diff-off');
  }

  basicToggle.addEventListener('change', update);
  diffToggle.addEventListener('change', update);

  update();
}


function initMenuHook() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('popMenu');
  const toggleExtraBtn = document.getElementById('toggleSocialsBtn');
  const extraContent = document.getElementById('popExtraMenu');

if (!burger || !menu) return;

  let isOpen = false;

  function setOpen(next) {
    isOpen = next;
    
    burger.classList.toggle('is-open', next);
    menu.classList.toggle('is-open', next);
    
    if (!next && toggleExtraBtn && extraContent) {
      extraContent.classList.add('pop-socials-hidden');
      toggleExtraBtn.classList.remove('pop-socials-hidden');
    }
  }

  if (toggleExtraBtn && extraContent) {
    toggleExtraBtn.addEventListener('click', () => {
      extraContent.classList.remove('pop-socials-hidden');
      toggleExtraBtn.classList.add('pop-socials-hidden');
    });
  }

  burger.addEventListener('click', () => setOpen(!isOpen));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) setOpen(false);
  });

  document.addEventListener('pointerdown', e => {
    if (isOpen && !e.target.closest('.pop-menu') && !e.target.closest('#burgerBtn')) setOpen(false);
  });

  ['EUR', 'USD', 'CHF', 'NOK', 'JPY', 'GBP'].forEach(initCurrencyToggle);
}
