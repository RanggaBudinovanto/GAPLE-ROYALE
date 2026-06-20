import state from '../state.js';
import { renderNavbar } from '../components/navbar.js';
import { renderCharacter } from '../components/character.js';
import { getLeaderboard as getLocalLeaderboard } from '../api.js';
import { apiCall } from '../config.js';
import { staggerFadeIn } from '../utils/animation.js';
import { formatNumber } from '../utils/format.js';
import { getRankTier } from './matchmaking.js';

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  let activeTab = 'global';
  let currentPage = 1;
  const perPage = 20;

  container.innerHTML = '<div class="page-with-sidebar"><div id="nav-mount"></div><div class="page-content" id="lb-content"></div></div>';
  const navCleanup = renderNavbar(container.querySelector('#nav-mount'));

  async function renderContent() {
    const content = container.querySelector('#lb-content');

    // Try backend API first, fallback to localStorage
    let data = [];
    let cached = false;
    const res = await apiCall('GET', `/ranking/leaderboard?type=${activeTab}&page=${currentPage}&limit=50`);
    if (!res.error && res.data && res.data.data) {
      data = res.data.data;
      cached = res.data.cached || false;
    } else {
      const local = getLocalLeaderboard(activeTab);
      data = local.data || [];
      cached = local.cached;
    }

    const totalPages = Math.ceil(data.length / perPage);
    const pageData = data.slice((currentPage - 1) * perPage, currentPage * perPage);
    const top3 = data.slice(0, 3);

    content.innerHTML = `
      <h1 class="text-display text-gold" style="margin-bottom:var(--sp-5);">Leaderboard</h1>
      <div class="tabs">
        <button class="tab ${activeTab === 'global' ? 'tab--active' : ''}" data-tab="global">Kemenangan (Global)</button>
        <button class="tab ${activeTab === 'weekly' ? 'tab--active' : ''}" data-tab="weekly">Kemenangan (Mingguan)</button>
        <button class="tab ${activeTab === 'ranked' ? 'tab--active' : ''}" data-tab="ranked">Peringkat RP (Ranked)</button>
      </div>

      ${cached ? '<div class="text-xs text-muted" style="margin-bottom:var(--sp-3);">📦 Data dari cache</div>' : ''}

      <!-- Podium -->
      ${top3.length >= 3 ? `
        <div style="display:flex;align-items:flex-end;justify-content:center;gap:var(--sp-4);margin-bottom:var(--sp-7);padding-top:var(--sp-5);">
          ${renderPodium(top3[1], 2, 100)}
          ${renderPodium(top3[0], 1, 140)}
          ${renderPodium(top3[2], 3, 80)}
        </div>
      ` : ''}

      <!-- Table -->
      <div style="overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-default);">
              <th style="padding:var(--sp-3);text-align:left;font-family:var(--font-display);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);">Rank</th>
              <th style="padding:var(--sp-3);text-align:left;font-family:var(--font-display);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);">Pemain</th>
              <th style="padding:var(--sp-3);text-align:center;font-family:var(--font-display);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);">${activeTab === 'ranked' ? 'Poin Rank (RP)' : 'Menang'}</th>
              <th style="padding:var(--sp-3);text-align:center;font-family:var(--font-display);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);">Game</th>
              <th style="padding:var(--sp-3);text-align:center;font-family:var(--font-display);font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);">Win Rate</th>
            </tr>
          </thead>
          <tbody>
            ${pageData.length > 0 ? pageData.map(entry => `
              <tr style="border-bottom:1px solid var(--border-default);${entry.userId === user.id ? 'background:rgba(212,160,23,0.06);' : ''}">
                <td style="padding:var(--sp-3);font-family:var(--font-mono);font-weight:600;color:${entry.rank <= 3 ? 'var(--text-gold)' : 'var(--text-secondary)'};">
                  ${entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank-1] : '#' + entry.rank}
                </td>
                <td style="padding:var(--sp-3);">
                  <div class="flex items-center gap-2">
                    <div class="avatar avatar--sm">${renderCharacter(entry.activeCharacter, 'tiny')}</div>
                    <div class="flex flex-col" style="text-align:left;">
                      <span style="font-weight:${entry.userId === user.id ? '700' : '400'};color:${entry.userId === user.id ? 'var(--text-gold)' : 'var(--text-primary)'};">${entry.username}</span>
                      ${(() => {
                        const tier = getRankTier(entry.rankPoints || 0);
                        return `<span style="font-size:9.5px;font-family:var(--font-mono);font-weight:bold;color:${tier.color};letter-spacing:0.04em;margin-top:2px;display:flex;align-items:center;gap:4px;"><img src="${tier.icon}" style="width:12px;height:12px;object-fit:contain;" /> ${tier.name.toUpperCase()}</span>`;
                      })()}
                    </div>
                  </div>
                </td>
                <td style="padding:var(--sp-3);text-align:center;font-family:var(--font-mono);font-weight:600;color:${activeTab === 'ranked' ? 'var(--gold-bright)' : 'var(--text-primary)'};">
                  ${activeTab === 'ranked' ? `${entry.rankPoints} RP` : `${entry.wins} Menang`}
                </td>
                <td style="padding:var(--sp-3);text-align:center;font-family:var(--font-mono);color:var(--text-secondary);">${entry.totalGames}</td>
                <td style="padding:var(--sp-3);text-align:center;font-family:var(--font-mono);color:${entry.winRate >= 50 ? 'var(--status-win)' : 'var(--text-secondary)'};">${entry.winRate}%</td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="5" style="padding:var(--sp-8);text-align:center;color:var(--text-muted);">
                  Belum ada pemain. Jadilah yang pertama!
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>

      ${totalPages > 1 ? `
        <div class="flex justify-center gap-2" style="margin-top:var(--sp-5);">
          ${Array.from({length: totalPages}, (_, i) => `
            <button class="btn ${i + 1 === currentPage ? 'btn-primary' : 'btn-ghost'} btn-sm page-btn" data-page="${i+1}">${i+1}</button>
          `).join('')}
        </div>
      ` : ''}
    `;

    content.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeTab = tab.dataset.tab;
        currentPage = 1;
        renderContent();
      });
    });

    content.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentPage = parseInt(btn.dataset.page);
        renderContent();
      });
    });

    staggerFadeIn('#lb-content tbody tr');
  }

  function renderPodium(entry, rank, height) {
    const colors = { 1: 'var(--gold-bright)', 2: '#C0C0C0', 3: '#CD7F32' };
    const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
    const tier = getRankTier(entry.rankPoints || 0);
    return `
      <div style="text-align:center;animation:podiumRise 0.5s var(--ease-spring) ${rank * 0.15}s both;">
        <div class="avatar ${rank === 1 ? 'avatar--lg avatar--glow' : ''}" style="margin:0 auto var(--sp-2);${rank === 1 ? 'border-color:var(--gold-bright);' : ''}">
          ${renderCharacter(entry.activeCharacter, rank === 1 ? 'small' : 'tiny')}
        </div>
        <div style="font-family:var(--font-heading);font-size:${rank === 1 ? '16px' : '13px'};font-weight:600;margin-bottom:var(--sp-1);">${entry.username}</div>
        <div style="font-size:10px;font-family:var(--font-mono);font-weight:bold;color:${tier.color};margin-bottom:2px;display:flex;align-items:center;justify-content:center;gap:4px;">
          <img src="${tier.icon}" style="width:14px;height:14px;object-fit:contain;" /> ${tier.name.toUpperCase()}
        </div>
        <div style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);margin-bottom:var(--sp-2);">
          ${activeTab === 'ranked' ? `${entry.rankPoints || 0} RP` : `${entry.wins} menang`}
        </div>
        <div style="width:100px;height:${height}px;background:linear-gradient(180deg, ${colors[rank]}, rgba(0,0,0,0.3));border-radius:var(--radius-md) var(--radius-md) 0 0;display:flex;align-items:flex-start;justify-content:center;padding-top:var(--sp-3);">
          <span style="font-size:28px;">${medals[rank]}</span>
        </div>
      </div>
    `;
  }

  renderContent();
  return () => { if (navCleanup) navCleanup(); };
}
