import state from '../state.js';
import { renderCharacter, getCharacterName } from '../components/character.js';
import { formatNumber } from '../utils/format.js';
import { countUp, coinRain, staggerFadeIn } from '../utils/animation.js';
import { getRankTier } from './matchmaking.js';

export function render(container) {
  const user = state.user;
  if (!user) { location.hash = '#/login'; return; }

  const result = state.lastGameResult;
  if (!result) { location.hash = '#/lobby'; return; }

  const { scores, coinResult, isWinner, reason, mode, players, newAchievements, rankedInfo } = result;

  container.innerHTML = `
    <div style="min-height:100vh;background:var(--bg-primary);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:var(--sp-8) var(--sp-6) var(--sp-10);position:relative;overflow-y:auto;" id="result-screen">
      <!-- Background effect -->
      <div style="position:absolute;inset:0;background:radial-gradient(ellipse at center, ${isWinner ? 'rgba(212,160,23,0.1)' : 'rgba(0,0,0,0.3)'} 0%, transparent 70%);pointer-events:none;"></div>

      <!-- Result Title -->
      <div style="text-align:center;margin-bottom:var(--sp-6);position:relative;z-index:1;flex-shrink:0;" id="result-title">
        ${isWinner ? `
          <div class="character-container character-win" style="margin-bottom:var(--sp-3);">
            ${renderCharacter(user.activeCharacter, 'large')}
          </div>
          <h1 class="text-display text-gold" style="text-shadow:0 0 40px rgba(245,200,66,0.3);font-size:36px;margin:0;">KAMU MENANG!</h1>
          ${reason === 'gaple' ? '<p class="text-lg text-secondary" style="margin-top:var(--sp-2);margin-bottom:0;">Gaple! Semua pemain pass.</p>' : ''}
        ` : `
          <div class="character-container character-lose" style="margin-bottom:var(--sp-3);">
            ${renderCharacter(user.activeCharacter, 'large')}
          </div>
          <h1 class="text-display text-muted" style="font-size:36px;margin:0;">LEBIH BERUNTUNG NEXT TIME</h1>
        `}
      </div>

      <!-- Details Columns Wrapper -->
      <div class="result-details-wrapper" style="display:flex;gap:var(--sp-5);max-width:1000px;width:100%;margin-bottom:var(--sp-6);flex-wrap:wrap;justify-content:center;position:relative;z-index:1;">
        
        <!-- Column 1: Score Table -->
        <div class="card" style="flex:1;min-width:320px;max-width:480px;margin-bottom:0;">
          <h3 class="text-label text-secondary" style="margin-bottom:var(--sp-4);">HASIL PERTANDINGAN</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="border-bottom:1px solid var(--border-default);">
                <th style="padding:var(--sp-2);text-align:left;font-size:11px;font-family:var(--font-display);letter-spacing:0.1em;text-transform:uppercase;color:var(--text-secondary);">Pemain</th>
                <th style="padding:var(--sp-2);text-align:center;font-size:11px;font-family:var(--font-display);letter-spacing:0.1em;text-transform:uppercase;color:var(--text-secondary);">Sisa</th>
                <th style="padding:var(--sp-2);text-align:center;font-size:11px;font-family:var(--font-display);letter-spacing:0.1em;text-transform:uppercase;color:var(--text-secondary);">Pip</th>
                <th style="padding:var(--sp-2);text-align:center;font-size:11px;font-family:var(--font-display);letter-spacing:0.1em;text-transform:uppercase;color:var(--text-secondary);">Posisi</th>
              </tr>
            </thead>
            <tbody>
              ${scores.map(s => {
                const isMe = s.userId === user.id;
                const player = players.find(p => p.id === s.userId);
                return `
                  <tr style="border-bottom:1px solid var(--border-default);${s.rank === 1 ? 'background:rgba(212,160,23,0.06);' : ''}">
                    <td style="padding:var(--sp-3);">
                      <div class="flex items-center gap-2">
                        <div class="avatar avatar--sm">${renderCharacter(player?.activeCharacter || 'raja_domino', 'tiny')}</div>
                        <span style="font-weight:${isMe ? '700' : '400'};color:${isMe ? 'var(--text-gold)' : 'var(--text-primary)'};">${s.username}</span>
                      </div>
                    </td>
                    <td style="padding:var(--sp-3);text-align:center;font-family:var(--font-mono);">${s.cardsLeft}</td>
                    <td style="padding:var(--sp-3);text-align:center;font-family:var(--font-mono);">${s.totalPip}</td>
                    <td style="padding:var(--sp-3);text-align:center;">
                      ${s.rank === 1 ? '<span class="badge badge--gold">🥇 1st</span>' : `<span class="text-secondary">#${s.rank}</span>`}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Column 2: Coin Rewards & Passive Skill -->
        <div style="flex:1;min-width:320px;max-width:480px;display:flex;flex-direction:column;gap:var(--sp-4);">
          <!-- Coin Earned Card -->
          <div class="card card--premium" style="text-align:center;margin-bottom:0;">
            <div class="coin-display" style="font-size:36px;justify-content:center;margin-bottom:var(--sp-4);">
              <div class="coin-icon coin-icon--lg"></div>
              <span id="coin-earned">0</span>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--sp-2);text-align:left;font-size:var(--text-sm);">
              <span class="text-secondary">Base reward:</span>
              <span class="text-mono" style="text-align:right;">+${coinResult.base}</span>
              ${coinResult.winBonus > 0 ? `
                <span class="text-secondary">Win bonus:</span>
                <span class="text-mono" style="text-align:right;color:var(--status-win);">+${coinResult.winBonus}</span>
              ` : ''}
              ${coinResult.streakBonus > 0 ? `
                <span class="text-secondary">Streak bonus:</span>
                <span class="text-mono" style="text-align:right;color:var(--text-gold);">+${coinResult.streakBonus}</span>
              ` : ''}
              ${coinResult.passiveBonus > 0 ? `
                <span class="text-secondary">Passive skill:</span>
                <span class="text-mono" style="text-align:right;color:var(--text-gold);">+${coinResult.passiveBonus}</span>
              ` : ''}
              ${coinResult.multiplier > 1 ? `
                <span class="text-secondary">Double Coin:</span>
                <span class="text-mono" style="text-align:right;color:var(--text-gold);">×${coinResult.multiplier}</span>
              ` : ''}
            </div>
          </div>

          <!-- Passive Skill Card (if active) -->
          ${coinResult.passiveBonus > 0 ? `
            <div class="card card--flat" style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:0;">
              <div style="width:48px;height:48px;flex-shrink:0;">${renderCharacter(user.activeCharacter, 'tiny')}</div>
              <div>
                <div style="font-weight:600;color:var(--text-gold);">${getCharacterName(user.activeCharacter)}: +15% bonus coin!</div>
                <div class="text-sm text-secondary">Passive skill aktif</div>
              </div>
            </div>
          ` : ''}

          <!-- Ranked Progression Card (if ranked match) -->
          ${rankedInfo && rankedInfo.isRanked ? (() => {
            const oldTier = getRankTier(rankedInfo.oldRp);
            const newTier = getRankTier(rankedInfo.newRp);
            const rpChangeText = rankedInfo.change >= 0 ? `+${rankedInfo.change} RP` : `${rankedInfo.change} RP`;
            const rpChangeColor = rankedInfo.change >= 0 ? 'var(--status-win)' : 'var(--status-lose)';
            
            // Calculate progress percentage
            const progressPercent = newTier.name === 'Royale Champion' ? 100 : (rankedInfo.newRp % 100);
            
            return `
              <div class="card card--premium" style="text-align:center;margin-bottom:0;position:relative;overflow:hidden;border:1px solid rgba(212,160,23,0.3);box-shadow:0 8px 32px rgba(212,160,23,0.1);">
                <div style="font-family:var(--font-display);font-size:11px;color:var(--text-secondary);letter-spacing:0.12em;text-transform:uppercase;margin-bottom:var(--sp-2);">PERKEMBANGAN RANK</div>
                
                <div class="flex items-center justify-center gap-4" style="margin:var(--sp-3) 0;">
                  <img src="${newTier.icon}" style="width:48px;height:48px;object-fit:contain;filter:drop-shadow(0 0 8px ${newTier.color});" />
                  <div style="text-align:left;">
                    <div style="font-family:var(--font-heading);font-size:20px;font-weight:800;color:${newTier.color};letter-spacing:0.04em;">${newTier.name.toUpperCase()}</div>
                    <div style="font-family:var(--font-mono);font-size:13px;color:var(--text-secondary);display:flex;align-items:center;gap:6px;">
                      <span>${rankedInfo.newRp} RP</span>
                      <span style="color:${rpChangeColor};font-weight:bold;">(${rpChangeText})</span>
                    </div>
                  </div>
                </div>

                <!-- Rank Progress Bar -->
                <div style="width:100%;background:rgba(255,255,255,0.05);height:6px;border-radius:var(--radius-full);overflow:hidden;margin-bottom:8px;border:1px solid rgba(255,255,255,0.05);">
                  <div style="width:${progressPercent}%;background:linear-gradient(90deg, ${newTier.color}, var(--gold-bright));height:100%;border-radius:var(--radius-full);transition:width 1s cubic-bezier(0.4, 0, 0.2, 1);"></div>
                </div>
                
                <div style="display:flex;justify-content:space-between;font-size:10px;font-family:var(--font-mono);color:var(--text-muted);">
                  <span>Divisi Saat Ini</span>
                  <span>${newTier.name === 'Royale Champion' ? 'ROYALE' : `${100 - progressPercent} RP ke Rank Berikutnya`}</span>
                </div>
              </div>
            `;
          })() : ''}
        </div>
      </div>

      <!-- New Achievements (if any) -->
      ${newAchievements && newAchievements.length > 0 ? `
        <div style="max-width:980px;width:100%;margin-bottom:var(--sp-6);position:relative;z-index:1;">
          ${newAchievements.map(ach => `
            <div class="card card--premium" style="display:flex;align-items:center;gap:var(--sp-3);margin-bottom:var(--sp-2);">
              <span style="font-size:28px;">🏆</span>
              <div>
                <div style="font-weight:600;color:var(--text-gold);">${ach.name}</div>
                <div class="text-sm text-secondary">${ach.desc} · +${ach.reward} coin</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Action Buttons -->
      <div class="flex gap-3" style="position:relative;z-index:1;flex-wrap:wrap;justify-content:center;margin-top:var(--sp-2);">
        <button class="btn btn-primary btn-lg" onclick="location.hash='#/matchmaking'">MAIN LAGI</button>
        <button class="btn btn-secondary" onclick="location.hash='#/lobby'">KEMBALI KE LOBBY</button>
        <button class="btn btn-ghost" onclick="location.hash='#/leaderboard'">LIHAT LEADERBOARD</button>
      </div>
    </div>
  `;

  // Coin count-up
  const coinEl = container.querySelector('#coin-earned');
  countUp(coinEl, coinResult.total, { prefix: '+' });

  // Coin rain for winner
  if (isWinner) {
    const screen = container.querySelector('#result-screen');
    setTimeout(() => coinRain(screen, 20), 500);
  }

  // Stagger animations
  staggerFadeIn('#result-screen .card', { stagger: 0.15, delay: 0.3 });
}
