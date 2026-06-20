const SIZES = {
  tiny:   [30, 45],
  small:  [60, 90],
  medium: [100, 150],
  large:  [160, 240]
};

export function renderCharacter(id, size = 'large') {
  const [w, h] = SIZES[size] || SIZES.large;
  const scale = w / 120;

  switch (id) {
    case 'bocah_pemula': return bocahPemula(w, h, scale);
    case 'magang_domino': return magangDomino(w, h, scale);
    case 'kapten_kartu': return kaptenKartu(w, h, scale);
    case 'raja_domino':  return rajaDomino(w, h, scale);
    case 'si_hoki':      return siHoki(w, h, scale);
    case 'juragan_meja': return juraganMeja(w, h, scale);
    case 'sang_bluffer':  return sangBluffer(w, h, scale);
    case 'bocah_warnet': return bocahWarnet(w, h, scale);
    case 'satpam_meja':  return satpamMeja(w, h, scale);
    case 'pawang_domino': return pawangDomino(w, h, scale);
    case 'si_paling_gaple': return siPalingGaple(w, h, scale);
    case 'ratu_casino':  return ratuCasino(w, h, scale);
    case 'bandar_darat': return bandarDarat(w, h, scale);
    case 'hacker_gaple': return hackerGaple(w, h, scale);
    case 'eyang_hoki':   return eyangHoki(w, h, scale);
    case 'master_zen':   return masterZen(w, h, scale);
    case 'legenda_royale': return legendaRoyale(w, h, scale);
    default:             return bocahPemula(w, h, scale);
  }
}

function bocahPemula(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (orange shirt) -->
    <rect x="35" y="100" width="50" height="65" rx="10" fill="#e67e22"/>
    <!-- Collar -->
    <ellipse cx="60" cy="100" rx="15" ry="5" fill="#f1c40f"/>
    <!-- Head -->
    <ellipse cx="60" cy="68" rx="26" ry="28" fill="#FAD7A0"/>
    <!-- Backwards Cap -->
    <rect x="42" y="42" width="36" height="6" fill="#f1c40f" rx="2"/>
    <path d="M34 45 Q36 28 60 28 Q84 28 86 45 Z" fill="#f1c40f"/>
    <path d="M80 43 Q95 38 100 48 Q90 52 80 48 Z" fill="#f39c12"/>
    <!-- Big Innocent Eyes -->
    <circle cx="48" cy="66" r="5" fill="#1a1008"/>
    <circle cx="72" cy="66" r="5" fill="#1a1008"/>
    <circle cx="46.5" cy="64.5" r="1.5" fill="#fff"/>
    <circle cx="70.5" cy="64.5" r="1.5" fill="#fff"/>
    <!-- Pink Blushing Cheeks -->
    <circle cx="40" cy="74" r="4" fill="#e8a090" opacity="0.6"/>
    <circle cx="80" cy="74" r="4" fill="#e8a090" opacity="0.6"/>
    <!-- Cute Smile -->
    <path d="M52 76 Q60 84 68 76" stroke="#c0392b" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Arms -->
    <ellipse cx="26" cy="120" rx="10" ry="7" fill="#FAD7A0" transform="rotate(-15 26 120)"/>
    <ellipse cx="94" cy="120" rx="10" ry="7" fill="#FAD7A0" transform="rotate(15 94 120)"/>
  </svg>`;
}

function magangDomino(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (white polo with green collar) -->
    <rect x="30" y="95" width="60" height="70" rx="6" fill="#ecf0f1"/>
    <path d="M42 95 L60 112 L78 95" fill="#27ae60"/>
    <!-- Head -->
    <ellipse cx="60" cy="64" rx="28" ry="30" fill="#E8B89A"/>
    <!-- Visor cap (green visor shield) -->
    <path d="M34 40 Q60 38 86 40 Q94 48 88 52 Q60 48 32 52 Z" fill="#27ae60" opacity="0.9"/>
    <rect x="42" y="32" width="36" height="10" rx="2" fill="#2cc36b"/>
    <!-- Smart square glasses -->
    <rect x="36" y="54" width="18" height="14" rx="2" fill="none" stroke="#2c3e50" stroke-width="2"/>
    <rect x="66" y="54" width="18" height="14" rx="2" fill="none" stroke="#2c3e50" stroke-width="2"/>
    <line x1="54" y1="61" x2="66" y2="61" stroke="#2c3e50" stroke-width="2"/>
    <!-- Eyes behind glasses -->
    <circle cx="45" cy="61" r="2.5" fill="#1a1008"/>
    <circle cx="75" cy="61" r="2.5" fill="#1a1008"/>
    <!-- Smile of confidence -->
    <path d="M52 77 Q60 84 68 77" stroke="#c0392b" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <!-- Arms -->
    <ellipse cx="22" cy="118" rx="11" ry="8" fill="#E8B89A" transform="rotate(-10 22 118)"/>
    <ellipse cx="98" cy="118" rx="11" ry="8" fill="#E8B89A" transform="rotate(10 98 118)"/>
    <!-- Domino in hand -->
    <rect x="92" y="106" width="12" height="22" rx="1.5" fill="#f5f0e8" stroke="#d4b896" stroke-width="0.8" transform="rotate(15 98 118)"/>
  </svg>`;
}

function kaptenKartu(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (navy vest and gold shoulder straps) -->
    <rect x="28" y="92" width="64" height="74" rx="8" fill="#2c3e50"/>
    <rect x="24" y="92" width="12" height="6" fill="#f1c40f"/>
    <rect x="84" y="92" width="12" height="6" fill="#f1c40f"/>
    <circle cx="60" cy="115" r="4" fill="#f1c40f"/>
    <circle cx="60" cy="132" r="4" fill="#f1c40f"/>
    <!-- Head -->
    <ellipse cx="60" cy="62" rx="28" ry="30" fill="#E0AC9D"/>
    <!-- Captain Hat -->
    <path d="M30 42 Q60 30 90 42 L86 28 Q60 22 34 28 Z" fill="#34495e"/>
    <ellipse cx="60" cy="40" rx="30" ry="4" fill="#f1c40f"/>
    <!-- Shiny visor -->
    <path d="M32 42 Q60 48 88 42 Q92 48 86 50 Q60 54 34 50 Z" fill="#111"/>
    <!-- Anchor symbol on hat -->
    <circle cx="60" cy="30" r="2.5" fill="#f1c40f"/>
    <line x1="60" y1="30" x2="60" y2="36" stroke="#f1c40f" stroke-width="1"/>
    <path d="M57 34 Q60 37 63 34" fill="none" stroke="#f1c40f" stroke-width="1"/>
    <!-- Eyes (sharp) -->
    <ellipse cx="48" cy="60" rx="4" ry="3" fill="#fff"/>
    <ellipse cx="72" cy="60" rx="4" ry="3" fill="#fff"/>
    <circle cx="48" cy="60" r="2" fill="#2c3e50"/>
    <circle cx="72" cy="60" r="2" fill="#2c3e50"/>
    <!-- Eyebrows -->
    <path d="M42 53 Q48 50 54 52" stroke="#2c3e50" stroke-width="2" fill="none"/>
    <path d="M66 53 Q72 50 78 52" stroke="#2c3e50" stroke-width="2" fill="none"/>
    <!-- Mustache -->
    <path d="M46 72 Q52 69 60 72 Q68 69 74 72" stroke="#2c3e50" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Smile -->
    <path d="M50 77 Q60 83 70 77" stroke="#c0392b" stroke-width="1.5" fill="none"/>
    <!-- Arms -->
    <ellipse cx="20" cy="115" rx="12" ry="8" fill="#E0AC9D" transform="rotate(-15 20 115)"/>
    <ellipse cx="100" cy="115" rx="12" ry="8" fill="#E0AC9D" transform="rotate(15 100 115)"/>
  </svg>`;
}

function rajaDomino(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <rect x="30" y="95" width="60" height="70" rx="8" fill="#8B0000"/>
    <rect x="45" y="95" width="30" height="12" rx="3" fill="#fff" opacity="0.9"/>
    <!-- Head -->
    <ellipse cx="60" cy="65" rx="30" ry="32" fill="#F4C27A"/>
    <!-- Crown -->
    <polygon points="35,40 42,20 50,35 60,15 70,35 78,20 85,40" fill="#f5c842" stroke="#d4a017" stroke-width="1.5"/>
    <circle cx="50" cy="28" r="2.5" fill="#e74c3c"/>
    <circle cx="60" cy="22" r="2.5" fill="#2980b9"/>
    <circle cx="70" cy="28" r="2.5" fill="#27ae60"/>
    <!-- Eyes -->
    <ellipse cx="48" cy="62" rx="4" ry="5" fill="#fff"/>
    <ellipse cx="72" cy="62" rx="4" ry="5" fill="#fff"/>
    <circle cx="49" cy="63" r="2.5" fill="#1a1008"/>
    <circle cx="73" cy="63" r="2.5" fill="#1a1008"/>
    <circle cx="50" cy="62" r="1" fill="#fff"/>
    <circle cx="74" cy="62" r="1" fill="#fff"/>
    <!-- Eyebrows -->
    <path d="M42 55 Q48 50 55 55" stroke="#2c1810" stroke-width="2" fill="none"/>
    <path d="M65 55 Q72 50 78 55" stroke="#2c1810" stroke-width="2" fill="none"/>
    <!-- Mustache -->
    <path d="M44 76 Q52 82 60 76 Q68 82 76 76" stroke="#1a1008" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Smile -->
    <path d="M50 80 Q60 88 70 80" stroke="#c0392b" stroke-width="1.5" fill="none"/>
    <!-- Arms -->
    <ellipse cx="22" cy="120" rx="12" ry="8" fill="#F4C27A" transform="rotate(-15 22 120)"/>
    <ellipse cx="98" cy="120" rx="12" ry="8" fill="#F4C27A" transform="rotate(15 98 120)"/>
    <!-- Domino in hand -->
    <rect x="90" y="108" width="14" height="24" rx="2" fill="#f5f0e8" stroke="#d4b896" stroke-width="1" transform="rotate(10 97 120)"/>
    <line x1="90" y1="120" x2="104" y2="120" stroke="#d4b896" stroke-width="0.8" transform="rotate(10 97 120)"/>
    <!-- Belt -->
    <rect x="30" y="130" width="60" height="5" fill="#d4a017"/>
    <rect x="55" y="128" width="10" height="9" rx="1" fill="#f5c842"/>
  </svg>`;
}

function siHoki(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <rect x="30" y="95" width="60" height="70" rx="8" fill="#4CAF50"/>
    <path d="M45 95 L50 110 L70 110 L75 95" fill="#388E3C"/>
    <!-- Head -->
    <ellipse cx="60" cy="65" rx="28" ry="30" fill="#E8B89A"/>
    <!-- Hat -->
    <ellipse cx="58" cy="38" rx="28" ry="10" fill="#FFD700" transform="rotate(-15 58 38)"/>
    <rect x="38" y="28" width="35" height="14" rx="4" fill="#FFD700" transform="rotate(-15 55 35)"/>
    <rect x="40" y="36" width="30" height="4" rx="1" fill="#d4a017" transform="rotate(-15 55 38)"/>
    <!-- Eyes (happy) -->
    <path d="M44 60 Q48 55 52 60" stroke="#1a1008" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M68 60 Q72 55 76 60" stroke="#1a1008" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Big smile -->
    <path d="M42 74 Q52 88 60 85 Q68 88 78 74" stroke="#c0392b" stroke-width="2" fill="#fff"/>
    <path d="M46 78 Q60 90 74 78" fill="#c0392b"/>
    <!-- Cheeks -->
    <circle cx="40" cy="72" r="5" fill="#e8a090" opacity="0.5"/>
    <circle cx="80" cy="72" r="5" fill="#e8a090" opacity="0.5"/>
    <!-- Arms -->
    <ellipse cx="22" cy="118" rx="12" ry="8" fill="#E8B89A" transform="rotate(-10 22 118)"/>
    <ellipse cx="98" cy="118" rx="12" ry="8" fill="#E8B89A" transform="rotate(10 98 118)"/>
    <!-- Thumbs up -->
    <rect x="100" y="105" width="6" height="16" rx="3" fill="#E8B89A" transform="rotate(-20 103 113)"/>
    <!-- Pocket -->
    <rect x="42" y="125" width="18" height="14" rx="3" fill="#388E3C"/>
    <path d="M44 125 Q51 132 58 125" fill="none" stroke="#2E7D32" stroke-width="1"/>
  </svg>`;
}

function juraganMeja(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (batik) -->
    <rect x="25" y="90" width="70" height="75" rx="8" fill="#5D4037"/>
    <!-- Batik pattern -->
    <circle cx="40" cy="105" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="55" cy="100" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="70" cy="108" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="80" cy="98" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="45" cy="120" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="60" cy="115" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="75" cy="122" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="50" cy="138" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <circle cx="65" cy="132" r="4" fill="none" stroke="#8D6E63" stroke-width="1"/>
    <!-- Head (bigger) -->
    <ellipse cx="60" cy="60" rx="32" ry="35" fill="#C68642"/>
    <!-- Eyes (serious) -->
    <rect x="42" y="56" width="12" height="5" rx="2" fill="#fff"/>
    <rect x="66" y="56" width="12" height="5" rx="2" fill="#fff"/>
    <circle cx="50" cy="58" r="2.5" fill="#1a1008"/>
    <circle cx="74" cy="58" r="2.5" fill="#1a1008"/>
    <!-- Thick eyebrows -->
    <rect x="40" y="50" width="16" height="3" rx="1" fill="#1a1008"/>
    <rect x="64" y="50" width="16" height="3" rx="1" fill="#1a1008"/>
    <!-- Nose -->
    <path d="M56 62 Q60 70 64 62" fill="#B37A3A"/>
    <!-- Mouth (firm) -->
    <line x1="48" y1="76" x2="72" y2="76" stroke="#8B4513" stroke-width="2" stroke-linecap="round"/>
    <!-- Hair -->
    <path d="M28 48 Q35 20 60 18 Q85 20 92 48" fill="#1a1008"/>
    <!-- Arms (big) -->
    <ellipse cx="18" cy="115" rx="14" ry="10" fill="#C68642" transform="rotate(-5 18 115)"/>
    <ellipse cx="102" cy="115" rx="14" ry="10" fill="#C68642" transform="rotate(5 102 115)"/>
    <!-- Hands on table gesture -->
    <rect x="8" y="120" width="18" height="8" rx="4" fill="#C68642"/>
    <rect x="94" y="120" width="18" height="8" rx="4" fill="#C68642"/>
  </svg>`;
}

function sangBluffer(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (suit) -->
    <rect x="30" y="95" width="60" height="70" rx="6" fill="#1a1a2e"/>
    <!-- Lapels -->
    <path d="M50 95 L60 120 L55 95" fill="#16213e"/>
    <path d="M70 95 L60 120 L65 95" fill="#16213e"/>
    <!-- Tie -->
    <polygon points="58,95 62,95 63,115 60,120 57,115" fill="#c0392b"/>
    <!-- Head -->
    <ellipse cx="60" cy="62" rx="28" ry="30" fill="#FDBCB4"/>
    <!-- Hair -->
    <path d="M32 50 Q35 25 60 22 Q85 25 88 50 Q85 40 75 38 Q65 35 55 38 Q45 40 35 45 Z" fill="#2c3e50"/>
    <!-- Glasses -->
    <circle cx="46" cy="60" r="10" fill="none" stroke="#1a1008" stroke-width="2.5"/>
    <circle cx="74" cy="60" r="10" fill="none" stroke="#1a1008" stroke-width="2.5"/>
    <line x1="56" y1="60" x2="64" y2="60" stroke="#1a1008" stroke-width="2"/>
    <line x1="36" y1="58" x2="32" y2="55" stroke="#1a1008" stroke-width="2"/>
    <line x1="84" y1="58" x2="88" y2="55" stroke="#1a1008" stroke-width="2"/>
    <!-- Eyes behind glasses -->
    <circle cx="46" cy="60" r="3" fill="#1a1008"/>
    <circle cx="74" cy="60" r="3" fill="#1a1008"/>
    <circle cx="47" cy="59" r="1" fill="#fff"/>
    <circle cx="75" cy="59" r="1" fill="#fff"/>
    <!-- Raised eyebrow -->
    <path d="M64 47 Q72 42 84 47" stroke="#2c3e50" stroke-width="2.5" fill="none"/>
    <path d="M36 50 Q44 46 54 50" stroke="#2c3e50" stroke-width="2" fill="none"/>
    <!-- Smirk -->
    <path d="M50 76 Q58 80 68 74" stroke="#c0392b" stroke-width="1.5" fill="none"/>
    <!-- Arms -->
    <rect x="14" y="100" width="20" height="10" rx="5" fill="#FDBCB4" transform="rotate(-10 24 105)"/>
    <rect x="86" y="100" width="20" height="10" rx="5" fill="#FDBCB4" transform="rotate(10 96 105)"/>
    <!-- Domino in hand -->
    <rect x="5" y="92" width="16" height="26" rx="3" fill="#f5f0e8" stroke="#d4b896" stroke-width="1" transform="rotate(-20 13 105)"/>
    <line x1="5" y1="105" x2="21" y2="105" stroke="#d4b896" stroke-width="0.8" transform="rotate(-20 13 105)"/>
    <circle cx="10" cy="99" r="2" fill="#1a1008" transform="rotate(-20 13 105)"/>
    <circle cx="16" cy="99" r="2" fill="#1a1008" transform="rotate(-20 13 105)"/>
    <circle cx="10" cy="111" r="2" fill="#1a1008" transform="rotate(-20 13 105)"/>
  </svg>`;
}

function bocahWarnet(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body -->
    <rect x="35" y="100" width="50" height="65" rx="8" fill="#1abc9c"/>
    <rect x="42" y="100" width="36" height="15" fill="#16a085" rx="2"/>
    <!-- Head -->
    <ellipse cx="60" cy="68" rx="26" ry="28" fill="#F3AFA9"/>
    <!-- Headset headband -->
    <path d="M40 45 Q60 30 80 45" stroke="#2c3e50" stroke-width="5" fill="none"/>
    <!-- Headset cups -->
    <rect x="32" y="55" width="10" height="20" rx="3" fill="#e74c3c"/>
    <rect x="78" y="55" width="10" height="20" rx="3" fill="#e74c3c"/>
    <!-- Glasses -->
    <rect x="40" y="56" width="16" height="12" rx="2" fill="none" stroke="#3498db" stroke-width="2"/>
    <rect x="64" y="56" width="16" height="12" rx="2" fill="none" stroke="#3498db" stroke-width="2"/>
    <line x1="56" y1="62" x2="64" y2="62" stroke="#3498db" stroke-width="2"/>
    <!-- Eyes behind glasses -->
    <circle cx="48" cy="62" r="2.5" fill="#111"/>
    <circle cx="72" cy="62" r="2.5" fill="#111"/>
    <!-- Focused smile -->
    <path d="M50 78 Q60 84 70 78" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Arms -->
    <ellipse cx="26" cy="120" rx="10" ry="7" fill="#F3AFA9" transform="rotate(-15 26 120)"/>
    <ellipse cx="94" cy="120" rx="10" ry="7" fill="#F3AFA9" transform="rotate(15 94 120)"/>
  </svg>`;
}

function satpamMeja(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (White police shirt) -->
    <rect x="28" y="95" width="64" height="70" rx="6" fill="#f8f9fa"/>
    <path d="M42 95 L60 110 L78 95" fill="#343a40"/>
    <rect x="34" y="110" width="12" height="12" fill="#e9ecef" rx="1"/>
    <rect x="74" y="110" width="12" height="12" fill="#e9ecef" rx="1"/>
    <!-- Head -->
    <ellipse cx="60" cy="64" rx="28" ry="30" fill="#E8B89A"/>
    <!-- Security Cap -->
    <path d="M30 42 Q60 28 90 42 L86 28 Q60 22 34 28 Z" fill="#212529"/>
    <ellipse cx="60" cy="40" rx="30" ry="4" fill="#212529"/>
    <path d="M32 42 Q60 48 88 42 Q92 48 86 50 Q60 54 34 50 Z" fill="#212529"/>
    <!-- Star badge on hat -->
    <polygon points="60,26 62,30 66,30 63,33 64,37 60,35 56,37 57,33 54,30 58,30" fill="#f1c40f"/>
    <!-- Eyes (serious) -->
    <ellipse cx="48" cy="60" rx="4" ry="3" fill="#fff"/>
    <ellipse cx="72" cy="60" rx="4" ry="3" fill="#fff"/>
    <circle cx="48" cy="60" r="2.5" fill="#111"/>
    <circle cx="72" cy="60" r="2.5" fill="#111"/>
    <!-- Mustache (thick) -->
    <path d="M44 72 Q52 76 60 72 Q68 76 76 72" stroke="#212529" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Arms -->
    <ellipse cx="20" cy="118" rx="12" ry="8" fill="#E8B89A" transform="rotate(-15 20 118)"/>
    <ellipse cx="100" cy="118" rx="12" ry="8" fill="#E8B89A" transform="rotate(15 100 118)"/>
  </svg>`;
}

function pawangDomino(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Traditional red shirt) -->
    <rect x="30" y="92" width="60" height="74" rx="8" fill="#a04000"/>
    <path d="M35 92 L60 120 L85 92" fill="#d35400"/>
    <!-- Head -->
    <ellipse cx="60" cy="60" rx="27" ry="29" fill="#D35400" opacity="0.15"/>
    <ellipse cx="60" cy="60" rx="27" ry="29" fill="#E59866"/>
    <!-- Udeng (Traditional Headband) -->
    <path d="M30 46 Q60 38 90 46 L88 38 Q60 30 32 38 Z" fill="#e74c3c"/>
    <path d="M50 36 Q60 22 70 36 Z" fill="#f1c40f"/>
    <!-- Eyes (mystic) -->
    <ellipse cx="48" cy="58" rx="5" ry="3" fill="#fff"/>
    <ellipse cx="72" cy="58" rx="5" ry="3" fill="#fff"/>
    <circle cx="48" cy="58" r="2.5" fill="#900"/>
    <circle cx="72" cy="58" r="2.5" fill="#900"/>
    <!-- Third eye / Bindi dot on forehead -->
    <circle cx="60" cy="46" r="2.5" fill="#f1c40f"/>
    <!-- Wise mustache/beard -->
    <path d="M48 70 Q60 84 72 70" stroke="#f1c40f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M54 75 Q60 88 66 75" fill="#e74c3c"/>
    <!-- Arms -->
    <ellipse cx="22" cy="116" rx="11" ry="8" fill="#E59866" transform="rotate(-15 22 116)"/>
    <ellipse cx="98" cy="116" rx="11" ry="8" fill="#E59866" transform="rotate(15 98 116)"/>
  </svg>`;
}

function siPalingGaple(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Singlet kaus) -->
    <rect x="32" y="98" width="56" height="68" rx="8" fill="#f4f6f7"/>
    <rect x="42" y="98" width="36" height="15" fill="#e5e7e9" rx="1"/>
    <!-- Head -->
    <ellipse cx="60" cy="64" rx="27" ry="29" fill="#E8B89A"/>
    <!-- Red Headband -->
    <rect x="32" y="40" width="56" height="8" fill="#e74c3c" rx="1"/>
    <path d="M30 40 L26 50 L32 46 Z" fill="#c0392b"/>
    <!-- Sunglasses -->
    <polygon points="36,52 54,52 52,62 38,62" fill="#111"/>
    <polygon points="66,52 84,52 82,62 68,62" fill="#111"/>
    <line x1="54" y1="55" x2="66" y2="55" stroke="#111" stroke-width="2"/>
    <!-- Cool grin -->
    <path d="M46 76 Q60 85 74 76" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Arms -->
    <ellipse cx="22" cy="118" rx="12" ry="8" fill="#E8B89A" transform="rotate(-10 22 118)"/>
    <ellipse cx="98" cy="118" rx="12" ry="8" fill="#E8B89A" transform="rotate(10 98 118)"/>
  </svg>`;
}

function ratuCasino(w, h, s) {
  return `<svg viewBox="0 0 120 200" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="blazerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a0533"/>
        <stop offset="50%" stop-color="#2d0b5c"/>
        <stop offset="100%" stop-color="#1a0533"/>
      </linearGradient>
      <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFDAB9"/>
        <stop offset="100%" stop-color="#F4A87C"/>
      </linearGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1a0533"/>
        <stop offset="60%" stop-color="#4a1080"/>
        <stop offset="100%" stop-color="#1a0533"/>
      </linearGradient>
      <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FF8FAB" stop-opacity="0.7"/>
        <stop offset="100%" stop-color="#FF8FAB" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- ===== BLAZER BODY ===== -->
    <!-- Main blazer -->
    <path d="M25 110 Q25 188 60 192 Q95 188 95 110 L85 98 Q72 104 60 105 Q48 104 35 98 Z" fill="url(#blazerGrad)"/>
    <!-- Left lapel -->
    <path d="M35 98 L48 112 L54 105 L60 100 L42 94 Z" fill="#0d001f"/>
    <!-- Right lapel -->
    <path d="M85 98 L72 112 L66 105 L60 100 L78 94 Z" fill="#0d001f"/>
    <!-- White inner shirt / blouse -->
    <path d="M48 112 L54 105 L60 100 L66 105 L72 112 L60 128 Z" fill="#f8f4ff"/>
    <!-- Gold brooch -->
    <ellipse cx="60" cy="116" rx="5" ry="3.5" fill="#FFD700" stroke="#B8860B" stroke-width="0.8"/>
    <circle cx="60" cy="116" r="1.5" fill="#FFF8DC"/>
    <!-- Blazer buttons -->
    <circle cx="60" cy="136" r="2" fill="#B8860B" stroke="#FFD700" stroke-width="0.5"/>
    <circle cx="60" cy="148" r="2" fill="#B8860B" stroke="#FFD700" stroke-width="0.5"/>
    <!-- Pocket square (right) -->
    <path d="M72 112 L80 112 L80 116 L76 118 Z" fill="#f8f4ff"/>
    <!-- Blazer lapel gold trim -->
    <path d="M35 98 L48 112" stroke="#FFD700" stroke-width="0.8" fill="none" opacity="0.6"/>
    <path d="M85 98 L72 112" stroke="#FFD700" stroke-width="0.8" fill="none" opacity="0.6"/>

    <!-- ===== LONG WAVY HAIR (behind body) ===== -->
    <!-- Left hair flow -->
    <path d="M32 68 Q16 90 20 130 Q22 155 28 170" stroke="url(#hairGrad)" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.95"/>
    <path d="M34 72 Q18 100 22 140" stroke="#3d0a72" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
    <!-- Right hair flow -->
    <path d="M88 68 Q104 90 100 130 Q98 155 92 170" stroke="url(#hairGrad)" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.95"/>
    <path d="M86 72 Q102 100 98 140" stroke="#3d0a72" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>

    <!-- ===== NECK ===== -->
    <path d="M50 94 Q55 100 60 101 Q65 100 70 94 L68 88 L52 88 Z" fill="url(#skinGrad)"/>

    <!-- ===== HEAD ===== -->
    <ellipse cx="60" cy="60" rx="30" ry="32" fill="url(#skinGrad)"/>

    <!-- ===== HAIR (top/front) ===== -->
    <!-- Crown hair volume -->
    <path d="M30 52 Q30 22 60 18 Q90 22 90 52 Q78 42 60 40 Q42 42 30 52 Z" fill="url(#hairGrad)"/>
    <!-- Side parting / wave -->
    <path d="M30 52 Q36 36 52 32" stroke="#6b21a8" stroke-width="3" fill="none" opacity="0.5"/>
    <!-- Loose strand left -->
    <path d="M34 54 Q28 62 30 72" stroke="#3d0a72" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <!-- Loose strand right -->
    <path d="M86 54 Q92 62 90 72" stroke="#3d0a72" stroke-width="3.5" fill="none" stroke-linecap="round"/>

    <!-- ===== EYES ===== -->
    <!-- Eye whites -->
    <ellipse cx="46" cy="58" rx="6.5" ry="5" fill="#fff"/>
    <ellipse cx="74" cy="58" rx="6.5" ry="5" fill="#fff"/>
    <!-- Iris (violet) -->
    <circle cx="46" cy="58" r="3.8" fill="#7c3aed"/>
    <circle cx="74" cy="58" r="3.8" fill="#7c3aed"/>
    <!-- Pupils -->
    <circle cx="46" cy="58" r="2.2" fill="#0d001f"/>
    <circle cx="74" cy="58" r="2.2" fill="#0d001f"/>
    <!-- Eye shine -->
    <circle cx="44.5" cy="56.5" r="1.2" fill="#fff" opacity="0.9"/>
    <circle cx="72.5" cy="56.5" r="1.2" fill="#fff" opacity="0.9"/>
    <!-- Upper eyelid / lash line (thick, dramatic) -->
    <path d="M38.5 54 Q46 49.5 53.5 54" stroke="#0d001f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M66.5 54 Q74 49.5 81.5 54" stroke="#0d001f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Lash flicks left eye -->
    <line x1="39" y1="54.5" x2="36" y2="51" stroke="#0d001f" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="41" y1="53" x2="39" y2="49.5" stroke="#0d001f" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Lash flicks right eye -->
    <line x1="81" y1="54.5" x2="84" y2="51" stroke="#0d001f" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="79" y1="53" x2="81" y2="49.5" stroke="#0d001f" stroke-width="1.2" stroke-linecap="round"/>
    <!-- Lower lash line -->
    <path d="M39.5 62 Q46 64.5 52.5 62" stroke="#0d001f" stroke-width="1" fill="none" opacity="0.5"/>
    <path d="M67.5 62 Q74 64.5 80.5 62" stroke="#0d001f" stroke-width="1" fill="none" opacity="0.5"/>
    <!-- Eyeshadow (shimmer purple) -->
    <path d="M38.5 54 Q46 49.5 53.5 54 L53.5 56 Q46 51.5 38.5 56 Z" fill="#9333ea" opacity="0.35"/>
    <path d="M66.5 54 Q74 49.5 81.5 54 L81.5 56 Q74 51.5 66.5 56 Z" fill="#9333ea" opacity="0.35"/>

    <!-- ===== EYEBROWS (arched, elegant) ===== -->
    <path d="M38 48 Q46 43 54 47" stroke="#0d001f" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M66 47 Q74 43 82 48" stroke="#0d001f" stroke-width="2.2" fill="none" stroke-linecap="round"/>

    <!-- ===== NOSE ===== -->
    <path d="M57 66 Q56 74 58 76 Q60 78 62 76 Q64 74 63 66" stroke="#D4956A" stroke-width="1.2" fill="none" stroke-linecap="round"/>

    <!-- ===== BLUSH ===== -->
    <ellipse cx="38" cy="70" rx="7" ry="4.5" fill="url(#blushGrad)"/>
    <ellipse cx="82" cy="70" rx="7" ry="4.5" fill="url(#blushGrad)"/>

    <!-- ===== LIPS ===== -->
    <!-- Upper lip -->
    <path d="M50 82 Q54 79 60 82 Q66 79 70 82 Q66 85 60 86 Q54 85 50 82 Z" fill="#C0392B"/>
    <!-- Cupid's bow -->
    <path d="M50 82 Q55 77 60 80 Q65 77 70 82" fill="#E74C3C"/>
    <!-- Lower lip -->
    <path d="M50 82 Q60 90 70 82 Q66 87 60 88 Q54 87 50 82 Z" fill="#E74C3C"/>
    <!-- Lip shine -->
    <path d="M54 82 Q60 79 66 82" stroke="#FF7979" stroke-width="1" fill="none" opacity="0.6" stroke-linecap="round"/>

    <!-- ===== EARRINGS ===== -->
    <!-- Left earring -->
    <circle cx="30" cy="66" r="3" fill="#FFD700" stroke="#B8860B" stroke-width="0.5"/>
    <ellipse cx="30" cy="73" rx="2.5" ry="5" fill="#FFD700" stroke="#B8860B" stroke-width="0.5"/>
    <circle cx="30" cy="78" r="1.5" fill="#fff" opacity="0.8"/>
    <!-- Right earring -->
    <circle cx="90" cy="66" r="3" fill="#FFD700" stroke="#B8860B" stroke-width="0.5"/>
    <ellipse cx="90" cy="73" rx="2.5" ry="5" fill="#FFD700" stroke="#B8860B" stroke-width="0.5"/>
    <circle cx="90" cy="78" r="1.5" fill="#fff" opacity="0.8"/>

    <!-- ===== ARMS ===== -->
    <!-- Left arm (blazer sleeve) -->
    <path d="M26 112 Q16 130 18 155 L30 152 Q28 134 36 115 Z" fill="url(#blazerGrad)"/>
    <ellipse cx="20" cy="156" rx="8" ry="5" fill="url(#skinGrad)" transform="rotate(-10 20 156)"/>
    <!-- Right arm (blazer sleeve) -->
    <path d="M94 112 Q104 130 102 155 L90 152 Q92 134 84 115 Z" fill="url(#blazerGrad)"/>
    <ellipse cx="100" cy="156" rx="8" ry="5" fill="url(#skinGrad)" transform="rotate(10 100 156)"/>
    <!-- Sleeve cuff gold trim -->
    <line x1="18" y1="149" x2="30" y2="150" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="90" y1="150" x2="102" y2="149" stroke="#FFD700" stroke-width="1.5" stroke-linecap="round"/>

    <!-- ===== SPARKLE DETAILS ===== -->
    <circle cx="78" cy="42" r="1.5" fill="#FFD700" opacity="0.8"/>
    <circle cx="42" cy="38" r="1" fill="#FFD700" opacity="0.6"/>
    <circle cx="86" cy="90" r="1" fill="#FFD700" opacity="0.5"/>
  </svg>`;
}


function bandarDarat(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Black suit, white tie) -->
    <rect x="28" y="92" width="64" height="74" rx="6" fill="#2c3e50"/>
    <path d="M48 92 L60 110 L72 92" fill="#ecf0f1"/>
    <!-- Gold chain -->
    <path d="M45 92 Q60 108 75 92" fill="none" stroke="#f1c40f" stroke-width="2"/>
    <!-- Head -->
    <ellipse cx="60" cy="62" rx="27" ry="29" fill="#E8B89A"/>
    <!-- Fedora Hat -->
    <ellipse cx="60" cy="40" rx="36" ry="7" fill="#1a252f" transform="rotate(-10 60 40)"/>
    <path d="M36 38 L32 20 Q60 14 88 20 L84 38 Z" fill="#1a252f" transform="rotate(-10 60 40)"/>
    <rect x="33" y="32" width="54" height="6" fill="#e74c3c" transform="rotate(-10 60 40)"/>
    <!-- Sharp Eyes (shady) -->
    <polygon points="40,54 54,52 52,58 42,58" fill="#111"/>
    <polygon points="66,52 80,54 78,58 68,58" fill="#111"/>
    <!-- Eyebrows (tilted) -->
    <line x1="38" y1="48" x2="54" y2="48" stroke="#111" stroke-width="2" transform="rotate(10 46 48)"/>
    <line x1="66" y1="48" x2="82" y2="48" stroke="#111" stroke-width="2" transform="rotate(-10 74 48)"/>
    <!-- Cigar -->
    <rect x="70" y="68" width="16" height="4" fill="#a0522d" transform="rotate(15 78 70)"/>
    <circle cx="86" cy="72" r="1.5" fill="#e67e22"/>
    <!-- Smoke -->
    <path d="M88 70 Q92 60 90 55 Q95 50 92 42" fill="none" stroke="#bdc3c7" stroke-width="1.5" opacity="0.6"/>
    <!-- Smirk -->
    <path d="M46 72 Q54 77 64 70" fill="none" stroke="#c0392b" stroke-width="1.5"/>
    <!-- Arms -->
    <ellipse cx="18" cy="116" rx="12" ry="8" fill="#E8B89A" transform="rotate(-10 18 116)"/>
    <ellipse cx="102" cy="116" rx="12" ry="8" fill="#E8B89A" transform="rotate(10 102 116)"/>
  </svg>`;
}

function hackerGaple(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Hoodie body -->
    <rect x="28" y="92" width="64" height="74" rx="12" fill="#2c3e50"/>
    <!-- Head -->
    <ellipse cx="60" cy="62" rx="27" ry="29" fill="#1a1a2e"/>
    <!-- Visor / Matrix glasses -->
    <rect x="36" y="52" width="48" height="14" rx="3" fill="#111" stroke="#2ecc71" stroke-width="1.5"/>
    <text x="60" y="62" fill="#2ecc71" font-size="8" font-weight="900" text-anchor="middle" font-family="monospace">0 1</text>
    <!-- Hood shadow -->
    <path d="M30 62 Q30 30 60 28 Q90 30 90 62 L80 92 L40 92 Z" fill="#1a252f" opacity="0.95"/>
    <!-- Arms -->
    <ellipse cx="20" cy="116" rx="11" ry="8" fill="#2c3e50" transform="rotate(-15 20 116)"/>
    <ellipse cx="100" cy="116" rx="11" ry="8" fill="#2c3e50" transform="rotate(15 100 116)"/>
  </svg>`;
}

function eyangHoki(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Batik) -->
    <rect x="28" y="92" width="64" height="74" rx="8" fill="#a0522d"/>
    <circle cx="60" cy="104" r="3" fill="#f1c40f"/>
    <circle cx="60" cy="120" r="3" fill="#f1c40f"/>
    <circle cx="60" cy="136" r="3" fill="#f1c40f"/>
    <!-- Head -->
    <ellipse cx="60" cy="62" rx="27" ry="29" fill="#fcd7b6"/>
    <!-- Blangkon Hat (Javanese headband) -->
    <path d="M30 44 Q60 34 90 44 L88 36 Q60 26 32 36 Z" fill="#5c3a21"/>
    <circle cx="90" cy="40" r="6" fill="#5c3a21"/>
    <!-- White Eyebrows -->
    <path d="M40 50 Q48 42 54 48" stroke="#ffffff" stroke-width="3" fill="none"/>
    <path d="M66 48 Q72 42 80 50" stroke="#ffffff" stroke-width="3" fill="none"/>
    <!-- Eyes (happy) -->
    <path d="M44 58 Q48 54 52 58" stroke="#111" stroke-width="2" fill="none"/>
    <path d="M68 58 Q72 54 76 58" stroke="#111" stroke-width="2" fill="none"/>
    <!-- White mustache and long beard -->
    <path d="M46 68 Q52 72 60 68 Q68 72 74 68" stroke="#ffffff" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M48 72 L60 98 L72 72 Z" fill="#ffffff" opacity="0.95"/>
    <path d="M50 72 Q60 84 70 72" stroke="#ffffff" stroke-width="2" fill="none"/>
    <!-- Arms -->
    <ellipse cx="20" cy="116" rx="12" ry="8" fill="#fcd7b6" transform="rotate(-15 20 116)"/>
    <ellipse cx="100" cy="116" rx="12" ry="8" fill="#fcd7b6" transform="rotate(15 100 116)"/>
  </svg>`;
}

function masterZen(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Yellow Zen Robe) -->
    <rect x="28" y="90" width="64" height="74" rx="8" fill="#f39c12"/>
    <path d="M38 90 L60 115 L82 90" fill="#d35400"/>
    <!-- Prayer Beads -->
    <circle cx="44" cy="100" r="4.5" fill="#5c3a21"/>
    <circle cx="52" cy="105" r="4.5" fill="#5c3a21"/>
    <circle cx="60" cy="107" r="4.5" fill="#5c3a21"/>
    <circle cx="68" cy="105" r="4.5" fill="#5c3a21"/>
    <circle cx="76" cy="100" r="4.5" fill="#5c3a21"/>
    <!-- Head (Bald) -->
    <ellipse cx="60" cy="60" rx="27" ry="29" fill="#E8B89A"/>
    <!-- Serene closed eyes -->
    <path d="M42 60 Q48 64 54 60" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M66 60 Q72 64 78 60" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Calm smile -->
    <path d="M50 78 Q60 84 70 78" stroke="#d35400" stroke-width="1.5" fill="none"/>
    <!-- Spiritual mark on forehead -->
    <circle cx="60" cy="45" r="1.5" fill="#d35400"/>
    <circle cx="60" cy="50" r="1.5" fill="#d35400"/>
    <!-- Arms -->
    <ellipse cx="20" cy="115" rx="12" ry="8" fill="#E8B89A" transform="rotate(-15 20 115)"/>
    <ellipse cx="100" cy="115" rx="12" ry="8" fill="#E8B89A" transform="rotate(15 100 115)"/>
  </svg>`;
}

function legendaRoyale(w, h, s) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Golden Zirah Suit) -->
    <rect x="28" y="90" width="64" height="74" rx="10" fill="url(#goldRobe)"/>
    <path d="M28 98 L60 122 L92 98 Z" fill="#996500" opacity="0.3"/>
    <circle cx="60" cy="115" r="4.5" fill="#fff" stroke="#f1c40f" stroke-width="1"/>
    <!-- Head (Gold Helmet) -->
    <ellipse cx="60" cy="60" rx="27" ry="29" fill="url(#goldRobe)"/>
    <!-- Glowing Cyber Visor -->
    <path d="M38 52 H82 L78 66 H42 Z" fill="#00ffff" opacity="0.9" filter="drop-shadow(0 0 4px #00ffff)"/>
    <line x1="38" y1="59" x2="82" y2="59" stroke="#fff" stroke-width="1"/>
    <!-- Helmet Crest -->
    <polygon points="60,18 64,32 56,32" fill="#ef4444"/>
    <!-- Arms -->
    <ellipse cx="20" cy="115" rx="12" ry="8" fill="url(#goldRobe)" transform="rotate(-15 20 115)"/>
    <ellipse cx="100" cy="115" rx="12" ry="8" fill="url(#goldRobe)" transform="rotate(15 100 115)"/>
    <defs>
      <linearGradient id="goldRobe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FFE875"/>
        <stop offset="50%" stop-color="#d4a017"/>
        <stop offset="100%" stop-color="#996500"/>
      </linearGradient>
    </defs>
  </svg>`;
}

export function getCharacterName(id) {
  const names = {
    bocah_pemula: 'Bocah Pemula',
    magang_domino: 'Magang Domino',
    kapten_kartu: 'Kapten Kartu',
    raja_domino: 'Raja Domino',
    si_hoki: 'Si Hoki',
    juragan_meja: 'Juragan Meja',
    sang_bluffer: 'Sang Bluffer',
    bocah_warnet: 'Bocah Warnet',
    satpam_meja: 'Satpam Meja',
    pawang_domino: 'Pawang Domino',
    si_paling_gaple: 'Si Paling Gaple',
    ratu_casino: 'Ratu Casino',
    bandar_darat: 'Bandar Darat',
    hacker_gaple: 'Hacker Gaple',
    eyang_hoki: 'Eyang Hoki',
    master_zen: 'Master Zen',
    legenda_royale: 'Legenda Royale'
  };
  return names[id] || id;
}


