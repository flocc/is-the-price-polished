const DEBUG = false;

const debug = DEBUG
  ? (desc) => {
      const ms = (performance.now() - debug.start).toFixed(1);
      console.log(`[POP][${ms.padStart(6)}ms] ${desc}`);
    }
  : () => {};

debug.start = performance.now();

debug('document_start');

const appId = window.location.pathname.match(/\/app\/(\d+)/)?.[1];

var popPromise = null;

if (appId) {
  debug('fetch start');
  popPromise = fetch(`https://api.polishourprices.pl/games/${appId}`)
    .then(response => {
      debug('fetch resolved');
      if (response.status === 400) throw new Error('Niepoprawny ID gry.');
      if (response.status === 404) throw new Error('W tej chwili gry spoza kuratorów nie są obsługiwane. Ale to się zmieni niedługo!');
      if (response.status === 422) throw new Error('Gra nie miała jeszcze premiery.');
      if (response.status === 500) throw new Error('Problem z serwerem.');
      if (!response.ok) throw new Error(`Inny (${response.status})`);
      return response.json();
    });
}
