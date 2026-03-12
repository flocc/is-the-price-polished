// debug timing
var popStart = performance.now();
var popLog = (desc) => {
  const ms = (performance.now() - popStart).toFixed(1);
  console.log(`[POP][${ms.padStart(6)}] ${desc}`);
};

popLog('document_start');

const appId = window.location.pathname.match(/\/app\/(\d+)/)?.[1];

if (appId) {
  popLog('fetch start');
  globalThis.popPromise = fetch(`https://polishourprices.pl/api/games/${appId}`)
    .then(response => {
      popLog('fetch resolved');
      if (response.status === 400) throw new Error('Niepoprawny ID gry.');
      if (response.status === 404) throw new Error('W tej chwili gry spoza kuratorów nie są obsługiwane. Ale to się zmieni niedługo!');
      if (response.status === 500) throw new Error('Problem z serwerem.');
      if (!response.ok) throw new Error(`Inny (${response.status})`);
      return response.json();
    });
}
