debug('document_end');

const init = async () => {
  const target = document.querySelector('div.rightcol.game_meta_data');
  if (!target || !globalThis.popPromise) return;

  try {
    target.insertAdjacentHTML('afterbegin', renderSkeleton());

    // TODO: asdfdsafd
    const result = await popPromise;

    initStorage();

    document.getElementById('pop').outerHTML = renderWidget();

    initValveMethodHook();
    initMenuHook();

    updateValveMethod();

  } catch (error) {
    document.getElementById('pop').outerHTML = renderError(error.message);
  }
};

init();
