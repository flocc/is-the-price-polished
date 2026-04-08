chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== 'FETCH_GAME') return;

  fetch(`https://api.polishourprices.pl/games/${msg.appId}`)
    .then(async res => {
      if (res.status === 400) return sendResponse({ error: 'Niepoprawny ID gry. :)' });
      if (res.status === 404) return sendResponse({ error: 'Obecnie gry spoza naszych kuratorów nie działają z rozszerzeniem. W przyszłości planowana jest obsługa wszystkich gier. :)' });
      if (res.status === 422) return sendResponse({ error: 'Gra jest w naszej bazie, ale nie miała jeszcze premiery. :)' });
      if (res.status === 500) return sendResponse({ error: 'Problem z serwerem API. :(' });
      if (!res.ok) return sendResponse({ error: `Inny: ${res.status}` });

      const data = await res.json();
      sendResponse({ data });
    })
    .catch(err => sendResponse({ error: err.message }));

  return true;
});
