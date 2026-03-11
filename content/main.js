import { renderWidget } from '../ui/builder.js';

const init = async () => {
  const appId = window.location.pathname.match(/\/app\/(\d+)/)?.[1];
  if (!appId) return;

  const target = document.querySelector('.rightcol.game_meta_data');
  if (!target || document.getElementById('pop-block')) return;

  try {
    const response = await fetch(`https://polishourprices.pl/api/games/${appId}`);
    if (!response.ok) throw new Error('[POP] API Error: ${response.status}');

    const result = await response.json();

    if (result.success && result.data) {
      target.insertAdjacentHTML('afterbegin', renderWidget(result.data));
    }
  } catch (error) {
    console.error("[POP] Error:", error);
  }
};

init();
