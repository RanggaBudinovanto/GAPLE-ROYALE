import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { renderDomino } from '../components/domino-card.js';
import { showToast } from '../components/toast.js';
import { showConfirm } from '../components/modal.js';
import { getCatalog, purchaseItem, activateCharacter, activateSkin } from '../api.js';
import { formatNumber } from '../utils/format.js';
import { staggerFadeIn } from '../utils/animation.js';
import { playPurchase } from '../utils/sfx.js';

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  let activeTab = 'characters';
  const catalog = getCatalog();

  container.innerHTML = '<div class="page-with-sidebar"><div id="nav-mount"></div><div class="page-content" id="shop-content"></div></div>';
  const navCleanup = renderNavbar(container.querySelector('#nav-mount'));

  function renderContent() {
    const content = container.querySelector('#shop-content');
    content.innerHTML = `
      <h1 class="text-display text-gold" style="margin-bottom:var(--sp-5);">Shop</h1>
      <div class="tabs">
        <button class="tab ${activeTab === 'characters' ? 'tab--active' : ''}" data-tab="characters">Karakter</button>
        <button class="tab ${activeTab === 'skins' ? 'tab--active' : ''}" data-tab="skins">Skin Kartu</button>
        <button class="tab ${activeTab === 'powerups' ? 'tab--active' : ''}" data-tab="powerups">Power-up</button>
      </div>
      <div id="shop-grid"></div>
    `;

    content.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        renderContent();
      });
    });

    const grid = content.querySelector('#shop-grid');

    if (activeTab === 'characters') renderCharacters(grid);
    else if (activeTab === 'skins') renderSkins(grid);
    else renderPowerups(grid);

    staggerFadeIn('#shop-grid > *');
  }

  function renderCharacters(grid) {
    grid.className = 'grid grid-4';
    grid.innerHTML = catalog.characters.map(char => {
      const owned = user.inventory.includes(char.id);
      const active = user.activeCharacter === char.id;
      return `
        <div class="character-card ${active ? 'character-card--active' : owned ? 'character-card--owned' : ''}">
          ${active ? '<div class="character-card-badge"><span class="badge badge--green">AKTIF</span></div>' : ''}
          <div class="character-card-preview character-idle">${renderCharacter(char.id, 'large')}</div>
          <div class="character-card-name">${char.name}</div>
          <div class="character-card-skill">${char.skill}</div>
          <div class="character-card-price">
            ${char.price === 0 ? '<span style="color:var(--status-win);">Gratis</span>' : `<div class="coin-icon coin-icon--sm"></div>${formatNumber(char.price)}`}
          </div>
          ${!owned
            ? `<button class="btn btn-primary btn-block buy-btn" data-id="${char.id}" data-type="character" data-price="${char.price}">BELI</button>`
            : active
              ? '<button class="btn btn-ghost btn-block" disabled>Sedang Aktif</button>'
              : `<button class="btn btn-success btn-block activate-char-btn" data-id="${char.id}">AKTIFKAN</button>`
          }
        </div>
      `;
    }).join('');

    attachBuyHandlers(grid);
    grid.querySelectorAll('.activate-char-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateCharacter(btn.dataset.id);
        showToast('Karakter diaktifkan!', 'success');
        renderContent();
      });
    });
  }

  function renderSkins(grid) {
    grid.className = 'grid grid-4';
    grid.innerHTML = catalog.skins.map(skin => {
      const owned = user.inventory.includes(skin.id);
      const active = user.activeSkin === skin.id;
      return `
        <div class="skin-card ${active ? 'skin-card--active' : ''}">
          ${active ? '<div class="character-card-badge"><span class="badge badge--green">AKTIF</span></div>' : ''}
          <div class="skin-preview">
            ${renderDomino(3, 5, { skin: skin.id })}
            ${renderDomino(6, 6, { skin: skin.id })}
          </div>
          <div class="skin-card-name">${skin.name}</div>
          <div class="character-card-price">
            ${skin.price === 0 ? '<span style="color:var(--status-win);">Gratis</span>' : `<div class="coin-icon coin-icon--sm"></div>${formatNumber(skin.price)}`}
          </div>
          ${!owned
            ? `<button class="btn btn-primary btn-block buy-btn" data-id="${skin.id}" data-type="skin" data-price="${skin.price}">BELI</button>`
            : active
              ? '<button class="btn btn-ghost btn-block" disabled>Sedang Aktif</button>'
              : `<button class="btn btn-success btn-block activate-skin-btn" data-id="${skin.id}">AKTIFKAN</button>`
          }
        </div>
      `;
    }).join('');

    attachBuyHandlers(grid);
    grid.querySelectorAll('.activate-skin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateSkin(btn.dataset.id);
        showToast('Skin diaktifkan!', 'success');
        renderContent();
      });
    });
  }

  function renderPowerups(grid) {
    grid.className = 'flex flex-col gap-3';
    const qtyState = {};

    grid.innerHTML = catalog.powerups.map(pu => {
      const stock = user.powerups[pu.id] || 0;
      qtyState[pu.id] = 1;
      return `
        <div class="powerup-card">
          <div class="powerup-card-icon">${pu.icon}</div>
          <div class="powerup-card-info">
            <div class="powerup-card-name">${pu.name}</div>
            <div class="powerup-card-desc">${pu.desc}</div>
            <div class="text-xs text-secondary">Stok: <span class="text-gold">${stock}</span> / ${pu.maxStock}</div>
          </div>
          <div class="powerup-card-actions">
            <div class="powerup-qty-control">
              <button class="powerup-qty-btn qty-minus" data-id="${pu.id}">−</button>
              <span class="powerup-qty-value" id="qty-${pu.id}">1</span>
              <button class="powerup-qty-btn qty-plus" data-id="${pu.id}">+</button>
            </div>
            <div style="text-align:center;">
              <div class="coin-display" style="font-size:13px;margin-bottom:4px;" id="price-${pu.id}">
                <div class="coin-icon coin-icon--sm"></div><span>${pu.price}</span>
              </div>
              <button class="btn btn-primary btn-sm buy-pu-btn" data-id="${pu.id}" data-type="powerup">BELI</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        qtyState[id] = Math.max(1, (qtyState[id] || 1) - 1);
        updateQtyDisplay(id, qtyState[id]);
      });
    });
    grid.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        qtyState[id] = Math.min(99, (qtyState[id] || 1) + 1);
        updateQtyDisplay(id, qtyState[id]);
      });
    });

    function updateQtyDisplay(id, qty) {
      const qtyEl = grid.querySelector(`#qty-${id}`);
      const priceEl = grid.querySelector(`#price-${id} span`);
      const pu = catalog.powerups.find(p => p.id === id);
      if (qtyEl) qtyEl.textContent = qty;
      if (priceEl && pu) priceEl.textContent = formatNumber(pu.price * qty);
    }

    grid.querySelectorAll('.buy-pu-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const qty = qtyState[id] || 1;
        const pu = catalog.powerups.find(p => p.id === id);
        const confirmed = await showConfirm(`Beli ${qty}x ${pu.name} seharga ${formatNumber(pu.price * qty)} coin?`);
        if (!confirmed) return;

        const result = purchaseItem(id, 'powerup', qty);
        if (result.success) {
          playPurchase();
          showToast(`${qty}x ${pu.name} berhasil dibeli!`, 'success');
          renderContent();
        } else {
          showToast(result.message, 'error');
        }
      });
    });
  }

  function attachBuyHandlers(grid) {
    grid.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const { id, type, price } = btn.dataset;
        if (Number(price) === 0) {
          const result = purchaseItem(id, type);
          if (result.success) {
            showToast('Item berhasil didapatkan!', 'success');
            renderContent();
          }
          return;
        }

        const confirmed = await showConfirm(`Beli item ini seharga ${formatNumber(Number(price))} coin?`);
        if (!confirmed) return;

        const result = purchaseItem(id, type);
        if (result.success) {
          playPurchase();
          showToast('Item berhasil dibeli!', 'success');
          renderContent();
        } else {
          showToast(result.message, 'error');
        }
      });
    });
  }

  renderContent();
  return () => { if (navCleanup) navCleanup(); };
}
