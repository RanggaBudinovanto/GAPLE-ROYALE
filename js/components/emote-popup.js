import { renderEmote } from './emotes.js';

export function showEmotePopup(playerId, emoteId, containerEl) {
  const opponentEl = containerEl.querySelector(`#opponent-card-${playerId}`);

  let anchor;
  if (opponentEl) {
    anchor = opponentEl;
  } else {
    anchor = containerEl.querySelector('.player-hand') || containerEl.querySelector('.game-player-area');
  }
  if (!anchor) return;

  const popup = document.createElement('div');
  popup.className = 'emote-popup';
  popup.innerHTML = `<div class="emote-popup-inner">${renderEmote(emoteId, 'large')}</div>`;

  anchor.style.position = 'relative';
  anchor.appendChild(popup);

  setTimeout(() => popup.remove(), 2600);
}
