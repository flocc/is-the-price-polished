import { waitForElement } from '../core/utils.js';
import { renderSkeleton, renderError, renderWidget } from '../ui/builder.js';

const init = async () => {
  const appId = window.location.pathname.match(/\/app\/(\d+)/)?.[1];
  if (!appId) return;

  const promise = fetch(`https://polishourprices.pl/api/games/${appId}`)
    .then(response => {
      if (response.status === 400) throw new Error('Niepoprawny ID gry.');
      if (response.status === 404) throw new Error('W tej chwili gry spoza kuratorów nie są obsługiwane. Ale to się zmieni niedługo!');
      if (response.status === 500) throw new Error('Problem z serwerem.');
      if (!response.ok) throw new Error(`Inny (${response.status})`);
      return response.json();
    });

  try {
    const target = await waitForElement('#tabletGrid > div.page_content_ctn > div.page_content.middle_page > div.rightcol.game_meta_data');

    // TODO: check if promise already resolved so I can skip skeleton?
    target.insertAdjacentHTML('afterbegin', renderSkeleton());
    
    document.getElementById('pop').outerHTML = renderWidget((await promise).data);
  } catch (error) {
    const message = error instanceof TypeError ? 'Nie można połączyć z serwerem.' : error.message;

    const elem = document.getElementById('pop');
    if (elem) elem.outerHTML = renderError(message);
  }
};

init();
