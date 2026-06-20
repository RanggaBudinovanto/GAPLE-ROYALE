import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { renderDomino } from '../components/domino-card.js';
import { showToast } from '../components/toast.js';
import { getCatalog, activateCharacter, activateSkin } from '../api.js';
import { staggerFadeIn } from '../utils/animation.js';
import { renderIcon } from '../components/emotes.js';

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  let activeTab = 'characters';
  const catalog = getCatalog();

  container.innerHTML = '<div class="page-with-sidebar"><div id="nav-mount"></div><div class="page-content" id="inv-content"></div></div>';
  const navCleanup = renderNavbar(container.querySelector('#nav-mount'));

  function renderContent() {
    const content = container.querySelector('#inv-content');
    content.innerHTML = `
      <h1 class="text-display text-gold" style="margin-bottom:var(--sp-5);">Inventory</h1>
      <div class="tabs">
        <button class="tab ${activeTab === 'characters' ? 'tab--active' : ''}" data-tab="characters">Karakter</button>
        <button class="tab ${activeTab === 'skins' ? 'tab--active' : ''}" data-tab="skins">Skin Kartu</button>
        <button class="tab ${activeTab === 'powerups' ? 'tab--active' : ''}" data-tab="powerups">Power-up</button>
      </div>
      <div id="inv-grid"></div>
    `;

    content.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        renderContent();
      });
    });

    const grid = content.querySelector('#inv-grid');

    if (activeTab === 'characters') renderCharacters(grid);
    else if (activeTab === 'skins') renderSkins(grid);
    else renderPowerups(grid);

    staggerFadeIn('#inv-grid > *');
  }

  function renderCharacters(grid) {
    const owned = catalog.characters.filter(c => user.inventory.includes(c.id));
    grid.className = 'grid grid-4';

    if (owned.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>Belum punya karakter tambahan</p></div>';
      return;
    }

    grid.innerHTML = owned.map(char => {
      const active = user.activeCharacter === char.id;
      return `
        <div class="character-card ${active ? 'character-card--active' : ''}">
          ${active ? '<div class="character-card-badge"><span class="badge badge--green">AKTIF</span></div>' : ''}
          <div class="character-card-preview character-idle">${renderCharacter(char.id, 'large')}</div>
          <div class="character-card-name">${char.name}</div>
          <div class="character-card-skill">${char.skill}</div>
          ${active
            ? '<button class="btn btn-ghost btn-block" disabled>Sedang Aktif</button>'
            : `<button class="btn btn-success btn-block activate-btn" data-id="${char.id}">AKTIFKAN</button>`
          }
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.activate-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateCharacter(btn.dataset.id);
        showToast(`${getCharacterName(btn.dataset.id)} diaktifkan!`, 'success');
        renderContent();
      });
    });
  }

  function renderSkins(grid) {
    const owned = catalog.skins.filter(s => user.inventory.includes(s.id));
    grid.className = 'grid grid-4';

    if (owned.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>Belum punya skin tambahan</p></div>';
      return;
    }

    grid.innerHTML = owned.map(skin => {
      const active = user.activeSkin === skin.id;
      return `
        <div class="skin-card ${active ? 'skin-card--active' : ''}">
          ${active ? '<div class="character-card-badge"><span class="badge badge--green">AKTIF</span></div>' : ''}
          <div class="skin-preview">
            ${renderDomino(3, 5, { skin: skin.id })}
            ${renderDomino(6, 6, { skin: skin.id })}
          </div>
          <div class="skin-card-name">${skin.name}</div>
          ${active
            ? '<button class="btn btn-ghost btn-block" disabled>Sedang Aktif</button>'
            : `<button class="btn btn-success btn-block activate-skin-btn" data-id="${skin.id}">AKTIFKAN</button>`
          }
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.activate-skin-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateSkin(btn.dataset.id);
        showToast('Skin diaktifkan!', 'success');
        renderContent();
      });
    });
  }

  function renderPowerups(grid) {
    const catalog_pu = catalog.powerups;
    const hasPowerups = catalog_pu.some(p => (user.powerups[p.id] || 0) > 0);

    grid.className = 'flex flex-col gap-3';

    if (!hasPowerups) {
      grid.innerHTML = `
        <div class="empty-state">
          <p>Belum punya power-up</p>
          <button class="btn btn-primary" style="margin-top:var(--sp-4);" onclick="location.hash='#/shop'">Beli di Shop</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = catalog_pu.filter(p => (user.powerups[p.id] || 0) > 0).map(pu => `
      <div class="powerup-card">
        <div class="powerup-card-icon">${renderIcon(pu.iconId, 24)}</div>
        <div class="powerup-card-info">
          <div class="powerup-card-name">${pu.name}</div>
          <div class="powerup-card-desc">${pu.desc}</div>
        </div>
        <div style="text-align:center;">
          <div style="font-family:var(--font-mono);font-size:24px;font-weight:600;color:var(--text-gold);">${user.powerups[pu.id]}</div>
          <div class="text-xs text-muted">stok</div>
          <button class="btn btn-secondary btn-sm" style="margin-top:var(--sp-2);" onclick="location.hash='#/shop'">Beli Lagi</button>
        </div>
      </div>
    `).join('');
  }

  renderContent();
  return () => { if (navCleanup) navCleanup(); };
}
