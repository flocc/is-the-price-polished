debug('document_end');

const mountHTML = (html) => {
  const t = document.createElement('template');
  t.innerHTML = html;
  return t.content.firstElementChild;
};

const init = async () => {
  const target = document.querySelector('div.rightcol.game_meta_data');
  if (!target || !globalThis.popPromise) return;

  try {
    target.insertAdjacentElement('afterbegin', mountHTML(renderSkeleton()));

    const result = await popPromise;
    initStorage();
    updatePopData(result);

    document.getElementById('pop').replaceWith(mountHTML(renderWidget()));

    initValveMethodHook();
    initMenuHook();
    updateValveMethod();

  } catch (error) {
    const pop = document.getElementById('pop');
    if (pop) pop.replaceWith(mountHTML(renderError(escapeHTML(error.message))));
  }
};

init();
