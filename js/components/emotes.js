const EMOTE_SIZES = { tiny: 24, small: 32, medium: 48, large: 64 };

export const EMOTE_LIST = [
  { id: 'laugh', name: 'Ketawa' },
  { id: 'angry', name: 'Marah' },
  { id: 'cry', name: 'Sedih' },
  { id: 'thumbsup', name: 'Jempol' },
  { id: 'clap', name: 'Tepuk' },
  { id: 'taunt', name: 'Ejek' },
  { id: 'shock', name: 'Kaget' },
  { id: 'moneyeyes', name: 'Mata Duit' },
  { id: 'fire', name: 'Api' },
  { id: 'cool', name: 'Keren' },
  { id: 'sleepy', name: 'Ngantuk' },
  { id: 'gg', name: 'GG' }
];

export function getEmoteName(id) {
  const e = EMOTE_LIST.find(e => e.id === id);
  return e ? e.name : id;
}

export function renderEmote(id, size = 'medium') {
  const s = EMOTE_SIZES[size] || EMOTE_SIZES.medium;
  switch (id) {
    case 'laugh': return emoteLaugh(s);
    case 'angry': return emoteAngry(s);
    case 'cry': return emoteCry(s);
    case 'thumbsup': return emoteThumbsup(s);
    case 'clap': return emoteClap(s);
    case 'taunt': return emoteTaunt(s);
    case 'shock': return emoteShock(s);
    case 'moneyeyes': return emoteMoneyeyes(s);
    case 'fire': return emoteFire(s);
    case 'cool': return emoteCool(s);
    case 'sleepy': return emoteSleepy(s);
    case 'gg': return emoteGG(s);
    default: return emoteLaugh(s);
  }
}

export function renderIcon(id, size = 20) {
  switch (id) {
    case 'icon_swords': return iconSwords(size);
    case 'icon_crown': return iconCrown(size);
    case 'icon_robot': return iconRobot(size);
    case 'icon_coins': return iconCoins(size);
    case 'icon_users': return iconUsers(size);
    case 'icon_coin': return iconCoin(size);
    case 'icon_diamond': return iconDiamond(size);
    case 'icon_fire': return iconFire(size);
    case 'icon_bell': return iconBell(size);
    case 'icon_trophy': return iconTrophy(size);
    case 'icon_lock': return iconLock(size);
    case 'icon_gift': return iconGift(size);
    case 'icon_gold': return iconMedal(size, '#FFD700', '#d4a017', '1');
    case 'icon_silver': return iconMedal(size, '#C0C0C0', '#8a8a8a', '2');
    case 'icon_bronze': return iconMedal(size, '#CD7F32', '#8B5A2B', '3');
    case 'icon_star': return iconStar(size);
    case 'icon_mic': return iconMic(size, false);
    case 'icon_mic_off': return iconMic(size, true);
    case 'icon_shuffle': return iconShuffle(size);
    case 'icon_eye': return iconEye(size);
    case 'icon_block': return iconBlock(size);
    case 'icon_x': return iconX(size);
    default: return `<span style="font-size:${size}px;">?</span>`;
  }
}

// ══════════════════════════════════════════════════════════════════
// CHAT EMOTES (48x48 viewBox, casino/domino themed faces)
// ══════════════════════════════════════════════════════════════════

function emoteLaugh(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <path d="M12 18 Q16 14 20 18" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M28 18 Q32 14 36 18" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M12 28 Q24 40 36 28" fill="#8B4513" stroke="#6B3410" stroke-width="1"/>
    <path d="M14 28 Q24 34 34 28" fill="#fff"/>
    <circle cx="10" cy="24" r="3" fill="#e8a050" opacity="0.5"/>
    <circle cx="38" cy="24" r="3" fill="#e8a050" opacity="0.5"/>
  </svg>`;
}

function emoteAngry(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
    <line x1="10" y1="14" x2="20" y2="18" stroke="#6B1010" stroke-width="3" stroke-linecap="round"/>
    <line x1="38" y1="14" x2="28" y2="18" stroke="#6B1010" stroke-width="3" stroke-linecap="round"/>
    <circle cx="16" cy="22" r="3" fill="#6B1010"/>
    <circle cx="32" cy="22" r="3" fill="#6B1010"/>
    <path d="M16 34 Q24 28 32 34" stroke="#6B1010" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="18" y="30" width="12" height="4" rx="1" fill="#fff" opacity="0.9"/>
    <line x1="21" y1="30" x2="21" y2="34" stroke="#c0392b" stroke-width="0.5"/>
    <line x1="24" y1="30" x2="24" y2="34" stroke="#c0392b" stroke-width="0.5"/>
    <line x1="27" y1="30" x2="27" y2="34" stroke="#c0392b" stroke-width="0.5"/>
  </svg>`;
}

function emoteCry(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <ellipse cx="16" cy="20" rx="3" ry="3.5" fill="#8B4513"/>
    <ellipse cx="32" cy="20" rx="3" ry="3.5" fill="#8B4513"/>
    <circle cx="17" cy="19" r="1" fill="#fff"/>
    <circle cx="33" cy="19" r="1" fill="#fff"/>
    <path d="M18 34 Q24 28 30 34" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M13 24 Q11 32 14 38" stroke="#3498db" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
    <path d="M35 24 Q37 32 34 38" stroke="#3498db" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.8"/>
    <ellipse cx="12" cy="38" rx="2" ry="1.5" fill="#3498db" opacity="0.5"/>
    <ellipse cx="36" cy="38" rx="2" ry="1.5" fill="#3498db" opacity="0.5"/>
  </svg>`;
}

function emoteThumbsup(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#2ecc71" stroke="#27ae60" stroke-width="1.5"/>
    <path d="M24 8 L24 28 Q24 30 22 30 L18 30 Q16 30 16 28 L16 18 Q16 16 18 14 L22 8 Q24 6 24 8 Z" fill="#f5c842" stroke="#d4a017" stroke-width="1"/>
    <rect x="14" y="28" width="14" height="12" rx="2" fill="#f5c842" stroke="#d4a017" stroke-width="1"/>
    <line x1="14" y1="31" x2="28" y2="31" stroke="#d4a017" stroke-width="0.7"/>
    <line x1="14" y1="34" x2="28" y2="34" stroke="#d4a017" stroke-width="0.7"/>
    <line x1="14" y1="37" x2="28" y2="37" stroke="#d4a017" stroke-width="0.7"/>
    <circle cx="34" cy="12" r="2" fill="#fff" opacity="0.6"/>
    <circle cx="38" cy="8" r="1.5" fill="#fff" opacity="0.4"/>
    <circle cx="36" cy="16" r="1" fill="#fff" opacity="0.3"/>
  </svg>`;
}

function emoteClap(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f39c12" stroke="#d68910" stroke-width="1.5"/>
    <path d="M14 30 L14 20 Q14 16 18 16 L20 16 Q22 16 22 18 L22 28" fill="#FAD7A0" stroke="#d4a017" stroke-width="1"/>
    <path d="M26 28 L26 18 Q26 16 28 16 L30 16 Q34 16 34 20 L34 30" fill="#FAD7A0" stroke="#d4a017" stroke-width="1" transform="scale(-1,1) translate(-48,0)"/>
    <line x1="10" y1="14" x2="14" y2="18" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <line x1="24" y1="10" x2="24" y2="14" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <line x1="38" y1="14" x2="34" y2="18" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    <line x1="8" y1="24" x2="12" y2="24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
    <line x1="36" y1="24" x2="40" y2="24" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  </svg>`;
}

function emoteTaunt(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <circle cx="16" cy="20" r="3" fill="#8B4513"/>
    <circle cx="17" cy="19" r="1" fill="#fff"/>
    <path d="M28 17 Q32 14 36 18" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M26 14" stroke="#8B4513" stroke-width="2.5" fill="none"/>
    <line x1="26" y1="14" x2="36" y2="12" stroke="#8B4513" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M16 32 Q26 38 36 30" stroke="#8B4513" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="10" cy="26" r="3" fill="#e8a050" opacity="0.4"/>
  </svg>`;
}

function emoteShock(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <circle cx="16" cy="18" r="5" fill="#fff" stroke="#8B4513" stroke-width="1.5"/>
    <circle cx="32" cy="18" r="5" fill="#fff" stroke="#8B4513" stroke-width="1.5"/>
    <circle cx="16" cy="18" r="2.5" fill="#8B4513"/>
    <circle cx="32" cy="18" r="2.5" fill="#8B4513"/>
    <ellipse cx="24" cy="34" rx="6" ry="8" fill="#8B4513" stroke="#6B3410" stroke-width="1"/>
    <ellipse cx="24" cy="33" rx="4" ry="5" fill="#c0392b" opacity="0.7"/>
    <line x1="6" y1="6" x2="10" y2="10" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
    <line x1="42" y1="6" x2="38" y2="10" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
    <line x1="24" y1="2" x2="24" y2="6" stroke="#d4a017" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function emoteMoneyeyes(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <circle cx="16" cy="18" r="6" fill="#27ae60"/>
    <text x="16" y="21" fill="#fff" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif">$</text>
    <circle cx="32" cy="18" r="6" fill="#27ae60"/>
    <text x="32" y="21" fill="#fff" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif">$</text>
    <path d="M16 32 Q24 40 32 32" fill="#8B4513" stroke="#6B3410" stroke-width="1"/>
    <path d="M18 32 Q24 36 30 32" fill="#fff"/>
    <circle cx="8" cy="10" r="3" fill="#f5c842" stroke="#d4a017" stroke-width="1" opacity="0.7"/>
    <circle cx="40" cy="10" r="2.5" fill="#f5c842" stroke="#d4a017" stroke-width="1" opacity="0.5"/>
    <circle cx="42" cy="18" r="2" fill="#f5c842" stroke="#d4a017" stroke-width="0.8" opacity="0.4"/>
  </svg>`;
}

function emoteFire(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
    <path d="M24 6 Q30 16 28 22 Q34 16 32 26 Q38 22 34 34 Q30 42 24 42 Q18 42 14 34 Q10 22 16 26 Q14 16 20 22 Q18 16 24 6 Z" fill="#f39c12" stroke="#e67e22" stroke-width="1"/>
    <path d="M24 18 Q28 24 26 30 Q30 26 28 34 Q26 40 24 40 Q22 40 20 34 Q18 26 22 30 Q20 24 24 18 Z" fill="#f5c842"/>
    <path d="M24 28 Q26 32 25 36 Q24 40 23 36 Q22 32 24 28 Z" fill="#fff" opacity="0.8"/>
  </svg>`;
}

function emoteCool(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <rect x="8" y="16" width="14" height="8" rx="2" fill="#1a1a2e" stroke="#111" stroke-width="1"/>
    <rect x="26" y="16" width="14" height="8" rx="2" fill="#1a1a2e" stroke="#111" stroke-width="1"/>
    <line x1="22" y1="20" x2="26" y2="20" stroke="#111" stroke-width="2"/>
    <rect x="8" y="17" width="14" height="3" rx="1" fill="#2c3e50" opacity="0.3"/>
    <rect x="26" y="17" width="14" height="3" rx="1" fill="#2c3e50" opacity="0.3"/>
    <path d="M16 32 Q24 38 32 32" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="10" cy="28" r="3" fill="#e8a050" opacity="0.4"/>
    <circle cx="38" cy="28" r="3" fill="#e8a050" opacity="0.4"/>
  </svg>`;
}

function emoteSleepy(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <path d="M10 20 Q16 24 22 20" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M26 20 Q32 24 38 20" stroke="#8B4513" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="24" cy="34" rx="4" ry="3" fill="#8B4513"/>
    <text x="38" y="12" fill="#3498db" font-size="8" font-weight="900" font-family="sans-serif" opacity="0.9">Z</text>
    <text x="42" y="6" fill="#3498db" font-size="6" font-weight="900" font-family="sans-serif" opacity="0.6">Z</text>
    <text x="44" y="2" fill="#3498db" font-size="4" font-weight="900" font-family="sans-serif" opacity="0.4">Z</text>
    <circle cx="10" cy="28" r="3" fill="#e8a050" opacity="0.4"/>
    <circle cx="38" cy="28" r="3" fill="#e8a050" opacity="0.4"/>
  </svg>`;
}

function emoteGG(s) {
  return `<svg viewBox="0 0 48 48" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ggGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE875"/>
        <stop offset="50%" stop-color="#d4a017"/>
        <stop offset="100%" stop-color="#996500"/>
      </linearGradient>
    </defs>
    <path d="M24 2 L30 14 L44 14 L32 22 L36 36 L24 28 L12 36 L16 22 L4 14 L18 14 Z" fill="url(#ggGold)" stroke="#996500" stroke-width="1"/>
    <text x="24" y="24" fill="#fff" font-size="12" font-weight="900" text-anchor="middle" font-family="sans-serif" stroke="#996500" stroke-width="0.5">GG</text>
  </svg>`;
}

// ══════════════════════════════════════════════════════════════════
// UI ICONS (casino/domino themed, scalable)
// ══════════════════════════════════════════════════════════════════

function iconSwords(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14.5 17.5L3 6V3h3l11.5 11.5"/>
    <path d="M13 19l6-6"/>
    <path d="M16 16l4 4"/>
    <path d="M19 21l2-2"/>
    <path d="M9.5 6.5L21 18v3h-3L6.5 9.5"/>
    <path d="M11 5l-6 6"/>
    <path d="M8 8L4 4"/>
    <path d="M5 3L3 5"/>
  </svg>`;
}

function iconCrown(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <polygon points="2,18 4,8 8,13 12,6 16,13 20,8 22,18" fill="#f5c842" stroke="#d4a017" stroke-width="1.5" stroke-linejoin="round"/>
    <rect x="2" y="18" width="20" height="3" rx="1" fill="#d4a017"/>
    <circle cx="4" cy="8" r="1.5" fill="#e74c3c"/>
    <circle cx="12" cy="6" r="1.5" fill="#3498db"/>
    <circle cx="20" cy="8" r="1.5" fill="#2ecc71"/>
  </svg>`;
}

function iconRobot(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="8" width="16" height="12" rx="3" fill="#3498db" stroke="#2980b9" stroke-width="1"/>
    <rect x="8" y="11" width="3" height="3" rx="1" fill="#fff"/>
    <rect x="13" y="11" width="3" height="3" rx="1" fill="#fff"/>
    <circle cx="9.5" cy="12.5" r="1" fill="#2c3e50"/>
    <circle cx="14.5" cy="12.5" r="1" fill="#2c3e50"/>
    <rect x="9" y="16" width="6" height="2" rx="1" fill="#2c3e50"/>
    <line x1="12" y1="4" x2="12" y2="8" stroke="#2980b9" stroke-width="1.5"/>
    <circle cx="12" cy="4" r="2" fill="#e74c3c"/>
    <line x1="2" y1="14" x2="4" y2="14" stroke="#2980b9" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="20" y1="14" x2="22" y2="14" stroke="#2980b9" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

function iconCoins(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="14" r="8" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <circle cx="10" cy="14" r="5.5" fill="none" stroke="#d4a017" stroke-width="0.8" stroke-dasharray="2 1.5"/>
    <text x="10" y="17" fill="#996500" font-size="8" font-weight="900" text-anchor="middle" font-family="sans-serif">$</text>
    <circle cx="16" cy="10" r="6" fill="#f5c842" stroke="#d4a017" stroke-width="1" opacity="0.5"/>
  </svg>`;
}

function iconUsers(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#f5c842" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="9" cy="7" r="3"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    <circle cx="17" cy="7" r="3"/>
    <path d="M17 11a4 4 0 014 4v2"/>
  </svg>`;
}

function iconCoin(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <circle cx="12" cy="12" r="7" fill="none" stroke="#d4a017" stroke-width="0.8" stroke-dasharray="2 1.5"/>
    <text x="12" y="16" fill="#996500" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">1</text>
  </svg>`;
}

function iconDiamond(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 22,9 12,22 2,9" fill="#3498db" stroke="#2980b9" stroke-width="1.5" stroke-linejoin="round"/>
    <polygon points="12,2 17,9 12,22 7,9" fill="#5dade2" opacity="0.6"/>
    <line x1="2" y1="9" x2="22" y2="9" stroke="#2980b9" stroke-width="1"/>
    <line x1="7" y1="9" x2="12" y2="2" stroke="#2980b9" stroke-width="0.8"/>
    <line x1="17" y1="9" x2="12" y2="2" stroke="#2980b9" stroke-width="0.8"/>
  </svg>`;
}

function iconFire(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2 Q16 8 14 12 Q18 8 16 16 Q20 12 18 20 Q16 24 12 24 Q8 24 6 20 Q4 12 8 16 Q6 8 10 12 Q8 8 12 2 Z" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
    <path d="M12 8 Q14 12 13 16 Q16 12 14 20 Q12 24 12 24 Q10 24 10 20 Q8 12 11 16 Q10 12 12 8 Z" fill="#f39c12"/>
    <path d="M12 14 Q13 18 12.5 20 Q12 22 11.5 20 Q11 18 12 14 Z" fill="#f5c842"/>
  </svg>`;
}

function iconBell(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#f5c842" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
    <line x1="12" y1="2" x2="12" y2="4"/>
  </svg>`;
}

function iconTrophy(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 4h12v6a6 6 0 01-12 0V4z" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <path d="M6 6H3a1 1 0 00-1 1v1a4 4 0 004 4" fill="none" stroke="#d4a017" stroke-width="1.5"/>
    <path d="M18 6h3a1 1 0 011 1v1a4 4 0 01-4 4" fill="none" stroke="#d4a017" stroke-width="1.5"/>
    <rect x="10" y="16" width="4" height="4" fill="#d4a017"/>
    <rect x="7" y="20" width="10" height="2" rx="1" fill="#d4a017"/>
    <circle cx="12" cy="9" r="2" fill="#fff" opacity="0.6"/>
  </svg>`;
}

function iconLock(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#7f8c8d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" fill="#7f8c8d" stroke="#6c7a7d"/>
    <path d="M7 11V7a5 5 0 0110 0v4" fill="none" stroke="#6c7a7d"/>
    <circle cx="12" cy="16" r="1.5" fill="#2c3e50"/>
  </svg>`;
}

function iconGift(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="10" width="18" height="12" rx="2" fill="#e74c3c" stroke="#c0392b" stroke-width="1.5"/>
    <rect x="3" y="10" width="18" height="4" rx="1" fill="#c0392b"/>
    <rect x="11" y="10" width="2" height="12" fill="#f5c842"/>
    <path d="M12 10 Q8 4 6 6 Q4 8 8 10" fill="none" stroke="#f5c842" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 10 Q16 4 18 6 Q20 8 16 10" fill="none" stroke="#f5c842" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}

function iconMedal(s, color1, color2, num) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 2 L10 8 L6 8 L8 2 Z" fill="#3498db"/>
    <path d="M16 2 L14 8 L18 8 L16 2 Z" fill="#e74c3c"/>
    <circle cx="12" cy="14" r="8" fill="${color1}" stroke="${color2}" stroke-width="1.5"/>
    <circle cx="12" cy="14" r="5.5" fill="none" stroke="${color2}" stroke-width="0.8"/>
    <text x="12" y="18" fill="${color2}" font-size="9" font-weight="900" text-anchor="middle" font-family="sans-serif">${num}</text>
  </svg>`;
}

function iconStar(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
    <polygon points="12,2 15,9 22,9 16,14 18,22 12,17 6,22 8,14 2,9 9,9" fill="#f5c842" stroke="#d4a017" stroke-width="1"/>
  </svg>`;
}

function iconMic(s, muted) {
  if (muted) {
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="#7f8c8d"/>
      <path d="M5 10a7 7 0 0014 0" stroke="#7f8c8d"/>
      <line x1="12" y1="17" x2="12" y2="22" stroke="#7f8c8d"/>
      <line x1="2" y1="2" x2="22" y2="22" stroke="#e74c3c"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3"/>
    <path d="M5 10a7 7 0 0014 0"/>
    <line x1="12" y1="17" x2="12" y2="22"/>
  </svg>`;
}

function iconShuffle(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#f5c842" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 3h5v5"/>
    <path d="M4 20L21 3"/>
    <path d="M21 16v5h-5"/>
    <path d="M15 15l6 6"/>
    <path d="M4 4l5 5"/>
  </svg>`;
}

function iconEye(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#f5c842" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3" fill="#f5c842" stroke="none"/>
  </svg>`;
}

function iconBlock(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="4" y1="4" x2="20" y2="20"/>
  </svg>`;
}

function iconX(s) {
  return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="#e74c3c" stroke-width="3" stroke-linecap="round">
    <line x1="6" y1="6" x2="18" y2="18"/>
    <line x1="18" y1="6" x2="6" y2="18"/>
  </svg>`;
}
