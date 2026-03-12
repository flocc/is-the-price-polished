popLog('main.js')
import { renderSkeleton, renderError, renderWidget } from '../ui/builder.js';

const init = async () => {
  const target = document.querySelector('div.rightcol.game_meta_data');
  if (!target || !globalThis.popPromise) return;

  try {
    // TODO: check if promise already resolved so I can skip skeleton?
    target.insertAdjacentHTML('afterbegin', renderSkeleton());

    const result = await globalThis.popPromise;
    document.getElementById('pop').outerHTML = renderWidget(result.data);
  } catch (error) {
    const message = error instanceof TypeError ? `Nie można połączyć z serwerem: ${error.message}` : error.message;

    const elem = document.getElementById('pop');
    if (elem) elem.outerHTML = renderError(message);
  }
};

init();
