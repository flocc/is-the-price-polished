const DEBUG = false;

const debug = DEBUG
  ? (desc) => {
      const ms = (performance.now() - debug.start).toFixed(1);
      console.log(`[POP][${ms.padStart(6)}ms] ${desc}`);
    }
  : () => {};

debug.start = performance.now();

debug('document_start');

const BASE = [
  'price',
  'in_pln',
  'diff',
  'diff_pct',
  'rate',
];

const VALVE = [
  'exchange',
  'power',
  'multi',
  'old',
  'old2017'
];

const SYMBOLS = {
  PLN: 'zł',
  USD: '$',
  EUR: '€',
  NOK: 'kr',
  GBP: '£',
  CHF: 'fr.',
  JPY: '¥',
};

const createCurrency = (code) => {
  const base = { 
    code: code,
    symbol: SYMBOLS[code],
    valve: {}
  };

  BASE.forEach(field => base[field] = null);
  
  VALVE.forEach(method => {
    base.valve[method] = { price: null, diff_pct: null };
  });

  return base;
};

window.pop = window.pop || {
  theme: 'material'
};

window.pop.currencies = {}; 

for (const [code, params] of Object.entries(SYMBOLS)) {
  window.pop.currencies[code] = createCurrency(code, ...params);
}


// first run defs
const initStorage = () => {
  if (!window.pop?.currencies) return;
  
  if (localStorage.getItem('pop-valve') === null) {
    localStorage.setItem('pop-valve', 'multi');
  }

  Object.keys(window.pop.currencies).forEach(code => {
    const storageBasic = `pop-${code.toLowerCase()}-basic`;
    const storageDiff = `pop-${code.toLowerCase()}-diff`;

    if (localStorage.getItem(storageBasic) === null) {
      localStorage.setItem(storageBasic, (code === 'EUR' || code === 'PLN') ? 'true' : 'false');
    }

    if (localStorage.getItem(storageDiff) === null) {
      localStorage.setItem(storageDiff, 'true');
    }
  });
}


const updatePopData = (apiResponse) => {
  window.pop.is_polish_dev = apiResponse.is_polish_dev;
  window.pop.pop_target = apiResponse.pop_target;
  window.pop.pop_score = apiResponse.pop_score;
  window.pop.pop_rank = apiResponse.pop_rank;
  window.pop.pop_desc = apiResponse.pop_desc;
  
  Object.keys(apiResponse.currencies).forEach(apiCode => {
    const source = apiResponse.currencies[apiCode];
    const target = window.pop.currencies[apiCode];

    if (target) {
      BASE.forEach(field => {
        if (source[field] !== undefined) {
          target[field] = source[field];
        }
      });

      if (source.valve) {
        VALVE.forEach(method => {
          if (source.valve[method]) {
            Object.assign(target.valve[method], source.valve[method]);
          }
        });
      }
    }
  });
};


const appId = window.location.pathname.match(/\/app\/(\d+)/)?.[1];
var popPromise = null;

const fetchBackground = (appId) => new Promise((resolve, reject) => {
  chrome.runtime.sendMessage({ type: 'FETCH_GAME', appId }, (response) => {
    if (chrome.runtime.lastError)
      return reject(Object.assign(new Error(chrome.runtime.lastError.message), { isBackgroundError: true }));
    if (!response)
      return reject(Object.assign(new Error('Brak odpowiedzi'), { isBackgroundError: true }));
    if (response.error)
      return reject(new Error(response.error));
    resolve(response.data);
  });
});

const fetchDirect = (appId) =>
  fetch(`https://api.polishourprices.pl/games/${appId}`)
    .then(res => {
      if (res.status === 400) throw new Error('Niepoprawny ID gry. :)');
      if (res.status === 404) throw new Error('Obecnie gry spoza naszych kuratorów nie działają z rozszerzeniem. W przyszłości planowana jest obsługa wszystkich gier. :)');
      if (res.status === 422) throw new Error('Gra jest w naszej bazie, ale nie miała jeszcze premiery. :)');
      if (res.status === 500) throw new Error('Problem z serwerem API. :(');
      if (!res.ok) throw new Error(`Inny: ${res.status}`);
      return res.json();
    });

if (appId) {
  debug(`fetch start for appId: ${appId}`);

  popPromise = fetchBackground(appId)
    .catch(err => {
      if (!err.isBackgroundError) throw err;
      debug(`background failed (${err.message}), retrying direct`);
      return fetchDirect(appId);
    })
    .then(data => {
      debug(`fetch ok`);
      return data;
    })
    .catch(err => {
      debug(`Error: ${err.message}`);
      throw err;
    });
}
