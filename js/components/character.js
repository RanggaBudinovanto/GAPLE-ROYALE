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
    case 'rangga_b':     return ranggaB(w, h, scale);
    case 'kucing_hoki':  return kucingHoki(w, h, scale);
    case 'anjing_royal': return anjingRoyal(w, h, scale);
    case 'iron_gaple':   return ironGaple(w, h, scale);
    case 'spider_domino':return spiderDomino(w, h, scale);
    case 'kapten_royale':return kaptenRoyale(w, h, scale);
    case 'thor_meja':    return thorMeja(w, h, scale);
    case 'hulk_smash':   return hulkSmash(w, h, scale);
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
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <!-- Body (Red gown) -->
    <path d="M35 95 L25 160 L95 160 L85 95 Z" fill="#9b59b6"/>
    <path d="M45 95 L60 115 L75 95" fill="#f1c40f"/>
    <!-- Head -->
    <ellipse cx="60" cy="62" rx="26" ry="28" fill="#F5B7B1"/>
    <!-- Tiara -->
    <polygon points="40,38 48,22 54,32 60,18 66,32 72,22 80,38" fill="#e74c3c" stroke="#c0392b" stroke-width="1"/>
    <circle cx="60" cy="18" r="2" fill="#f1c40f"/>
    <!-- Long Eyelashes / Eyes -->
    <ellipse cx="48" cy="58" rx="4" ry="3" fill="#fff"/>
    <ellipse cx="72" cy="58" rx="4" ry="3" fill="#fff"/>
    <circle cx="48" cy="58" r="2" fill="#8e44ad"/>
    <circle cx="72" cy="58" r="2" fill="#8e44ad"/>
    <path d="M42 54 Q48 48 54 54" stroke="#111" stroke-width="1.5" fill="none"/>
    <path d="M66 54 Q72 48 78 54" stroke="#111" stroke-width="1.5" fill="none"/>
    <!-- Lipstick smile -->
    <path d="M50 78 Q60 88 70 78" stroke="#e74c3c" stroke-width="3" fill="none" stroke-linecap="round"/>
    <!-- Arms -->
    <ellipse cx="24" cy="115" rx="10" ry="6" fill="#F5B7B1" transform="rotate(-20 24 115)"/>
    <ellipse cx="96" cy="115" rx="10" ry="6" fill="#F5B7B1" transform="rotate(20 96 115)"/>
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
    legenda_royale: 'Legenda Royale',
    rangga_b: 'Rangga B',
    kucing_hoki: 'Kucing Hoki',
    anjing_royal: 'Anjing Royal',
    iron_gaple: 'Iron Gaple',
    spider_domino: 'Spider Domino',
    kapten_royale: 'Kapten Royale',
    thor_meja: 'Thor Meja',
    hulk_smash: 'Hulk Smash'
  };
  return names[id] || id;
}

function ranggaB(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="92" width="60" height="73" rx="6" fill="#1a1a2e"/>
    <path d="M50 92 L60 118 L55 92" fill="#16213e"/><path d="M70 92 L60 118 L65 92" fill="#16213e"/>
    <polygon points="58,92 62,92 63,112 60,117 57,112" fill="#111"/>
    <rect x="42" y="92" width="36" height="8" rx="2" fill="#fff"/>
    <ellipse cx="60" cy="60" rx="28" ry="30" fill="#E8C4A0"/>
    <path d="M32 48 Q36 22 60 20 Q84 22 88 48 Q84 38 72 36 Q60 33 48 36 Q36 40 32 48 Z" fill="#1a1008"/>
    <circle cx="46" cy="58" r="11" fill="none" stroke="#333" stroke-width="2.2"/>
    <circle cx="74" cy="58" r="11" fill="none" stroke="#333" stroke-width="2.2"/>
    <line x1="57" y1="58" x2="63" y2="58" stroke="#333" stroke-width="2"/>
    <line x1="35" y1="56" x2="32" y2="53" stroke="#333" stroke-width="1.5"/>
    <line x1="85" y1="56" x2="88" y2="53" stroke="#333" stroke-width="1.5"/>
    <circle cx="46" cy="58" r="3.5" fill="#1a1008"/><circle cx="74" cy="58" r="3.5" fill="#1a1008"/>
    <circle cx="47" cy="57" r="1.2" fill="#fff"/><circle cx="75" cy="57" r="1.2" fill="#fff"/>
    <path d="M52 74 Q60 80 68 74" stroke="#c0392b" stroke-width="1.5" fill="none"/>
    <ellipse cx="22" cy="115" rx="12" ry="8" fill="#E8C4A0" transform="rotate(-10 22 115)"/>
    <ellipse cx="98" cy="115" rx="12" ry="8" fill="#E8C4A0" transform="rotate(10 98 115)"/>
  </svg>`;
}

function kucingHoki(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="95" width="50" height="65" rx="12" fill="#F5A623"/>
    <ellipse cx="60" cy="62" rx="30" ry="28" fill="#F5A623"/>
    <polygon points="32,45 38,18 50,42" fill="#F5A623"/><polygon points="88,45 82,18 70,42" fill="#F5A623"/>
    <polygon points="35,42 39,22 48,40" fill="#FFD1DC"/><polygon points="85,42 81,22 72,40" fill="#FFD1DC"/>
    <ellipse cx="46" cy="58" rx="6" ry="7" fill="#fff"/><ellipse cx="74" cy="58" rx="6" ry="7" fill="#fff"/>
    <ellipse cx="46" cy="60" rx="3" ry="5" fill="#2ecc71"/><ellipse cx="74" cy="60" rx="3" ry="5" fill="#2ecc71"/>
    <circle cx="46" cy="58" r="1.5" fill="#000"/><circle cx="74" cy="58" r="1.5" fill="#000"/>
    <ellipse cx="60" cy="72" rx="4" ry="3" fill="#FFB6C1"/>
    <path d="M56 75 Q60 80 64 75" stroke="#333" stroke-width="1" fill="none"/>
    <line x1="30" y1="65" x2="15" y2="60" stroke="#333" stroke-width="1"/><line x1="30" y1="68" x2="15" y2="68" stroke="#333" stroke-width="1"/>
    <line x1="90" y1="65" x2="105" y2="60" stroke="#333" stroke-width="1"/><line x1="90" y1="68" x2="105" y2="68" stroke="#333" stroke-width="1"/>
    <path d="M85 160 Q90 170 95 160" stroke="#F5A623" stroke-width="4" fill="none"/>
    <rect x="88" y="108" width="14" height="24" rx="2" fill="#f5f0e8" stroke="#d4b896" stroke-width="1" transform="rotate(8 95 120)"/>
  </svg>`;
}

function anjingRoyal(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="35" y="95" width="50" height="65" rx="10" fill="#8B4513"/>
    <rect x="42" y="95" width="36" height="10" rx="3" fill="#d4a017"/>
    <ellipse cx="60" cy="62" rx="30" ry="28" fill="#D2691E"/>
    <ellipse cx="42" cy="52" rx="14" ry="18" fill="#8B4513" transform="rotate(-15 42 52)"/>
    <ellipse cx="78" cy="52" rx="14" ry="18" fill="#8B4513" transform="rotate(15 78 52)"/>
    <circle cx="48" cy="58" r="5" fill="#fff"/><circle cx="72" cy="58" r="5" fill="#fff"/>
    <circle cx="48" cy="59" r="3" fill="#1a1008"/><circle cx="72" cy="59" r="3" fill="#1a1008"/>
    <circle cx="49" cy="57" r="1" fill="#fff"/><circle cx="73" cy="57" r="1" fill="#fff"/>
    <ellipse cx="60" cy="72" rx="8" ry="6" fill="#1a1008"/>
    <circle cx="57" cy="71" r="1.5" fill="#D2691E"/><circle cx="63" cy="71" r="1.5" fill="#D2691E"/>
    <path d="M54 78 Q60 84 66 78" stroke="#c0392b" stroke-width="2" fill="none"/>
    <polygon points="55,15 60,8 65,15" fill="#d4a017"/>
  </svg>`;
}

function ironGaple(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="90" width="60" height="75" rx="8" fill="#c0392b"/>
    <rect x="34" y="94" width="52" height="67" rx="6" fill="#e74c3c"/>
    <circle cx="60" cy="115" r="10" fill="#f1c40f" opacity="0.9"/>
    <circle cx="60" cy="115" r="6" fill="#fff" opacity="0.5"/>
    <path d="M28 55 Q30 20 60 15 Q90 20 92 55 Q88 50 80 48 L76 35 L68 45 L60 30 L52 45 L44 35 L40 48 Q32 50 28 55Z" fill="#c0392b"/>
    <rect x="36" y="50" width="48" height="30" rx="4" fill="#e74c3c"/>
    <rect x="40" y="55" width="16" height="8" rx="2" fill="#f1c40f"/><rect x="64" y="55" width="16" height="8" rx="2" fill="#f1c40f"/>
    <rect x="48" y="68" width="24" height="6" rx="2" fill="#95a5a6"/>
    <ellipse cx="22" cy="115" rx="10" ry="8" fill="#e74c3c"/>
    <ellipse cx="98" cy="115" rx="10" ry="8" fill="#e74c3c"/>
    <rect x="12" y="108" width="12" height="6" rx="3" fill="#f1c40f"/>
    <rect x="96" y="108" width="12" height="6" rx="3" fill="#f1c40f"/>
  </svg>`;
}

function spiderDomino(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="32" y="90" width="56" height="72" rx="6" fill="#c0392b"/>
    <line x1="60" y1="90" x2="60" y2="162" stroke="#1a1a2e" stroke-width="2"/>
    <path d="M38 100 Q60 130 82 100" stroke="#1a1a2e" stroke-width="1.5" fill="none"/>
    <path d="M35 115 Q60 145 85 115" stroke="#1a1a2e" stroke-width="1.5" fill="none"/>
    <path d="M38 130 Q60 155 82 130" stroke="#1a1a2e" stroke-width="1.5" fill="none"/>
    <ellipse cx="60" cy="55" rx="26" ry="28" fill="#c0392b"/>
    <ellipse cx="48" cy="52" rx="10" ry="12" fill="#fff" transform="rotate(-10 48 52)"/>
    <ellipse cx="72" cy="52" rx="10" ry="12" fill="#fff" transform="rotate(10 72 52)"/>
    <ellipse cx="48" cy="54" rx="4" ry="6" fill="#1a1008"/><ellipse cx="72" cy="54" rx="4" ry="6" fill="#1a1008"/>
    <path d="M38 68 L48 72 L52 68 L56 72 L60 68 L64 72 L68 68 L72 72 L82 68" stroke="#1a1a2e" stroke-width="1.5" fill="none"/>
    <line x1="20" y1="100" x2="32" y2="110" stroke="#c0392b" stroke-width="3"/>
    <line x1="88" y1="110" x2="100" y2="100" stroke="#c0392b" stroke-width="3"/>
  </svg>`;
}

function kaptenRoyale(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="30" y="90" width="60" height="75" rx="6" fill="#2c3e50"/>
    <rect x="34" y="90" width="52" height="12" rx="3" fill="#ecf0f1"/>
    <circle cx="60" cy="120" r="12" fill="#e74c3c"/>
    <polygon points="55,115 60,108 65,115 62,115 62,128 58,128 58,115" fill="#fff"/>
    <ellipse cx="60" cy="58" rx="26" ry="28" fill="#FDBCB4"/>
    <path d="M34 42 Q36 28 60 22 Q84 28 86 42 L82 40 L60 36 L38 40 Z" fill="#2c3e50"/>
    <rect x="34" y="30" width="52" height="14" rx="4" fill="#2c3e50"/>
    <rect x="42" y="26" width="36" height="6" rx="2" fill="#ecf0f1"/>
    <polygon points="56,28 60,22 64,28" fill="#ecf0f1"/>
    <circle cx="48" cy="58" r="4" fill="#fff"/><circle cx="72" cy="58" r="4" fill="#fff"/>
    <circle cx="48" cy="59" r="2.5" fill="#2980b9"/><circle cx="72" cy="59" r="2.5" fill="#2980b9"/>
    <path d="M52 72 Q60 78 68 72" stroke="#c0392b" stroke-width="1.5" fill="none"/>
    <rect x="8" y="105" width="22" height="6" rx="3" fill="#e74c3c"/>
    <rect x="90" y="105" width="22" height="6" rx="3" fill="#e74c3c"/>
  </svg>`;
}

function thorMeja(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="28" y="90" width="64" height="75" rx="6" fill="#2c3e50"/>
    <rect x="32" y="90" width="56" height="8" fill="#95a5a6"/>
    <circle cx="60" cy="100" r="4" fill="#f1c40f"/>
    <circle cx="48" cy="100" r="3" fill="#f1c40f"/><circle cx="72" cy="100" r="3" fill="#f1c40f"/>
    <ellipse cx="60" cy="58" rx="28" ry="30" fill="#FDBCB4"/>
    <path d="M32 50 Q38 25 60 20 Q82 25 88 50" fill="#f39c12"/>
    <path d="M30 55 Q32 50 38 52" fill="#f39c12"/><path d="M90 55 Q88 50 82 52" fill="#f39c12"/>
    <circle cx="48" cy="58" r="4" fill="#fff"/><circle cx="72" cy="58" r="4" fill="#fff"/>
    <circle cx="48" cy="59" r="2.5" fill="#2980b9"/><circle cx="72" cy="59" r="2.5" fill="#2980b9"/>
    <rect x="40" y="48" width="14" height="3" rx="1" fill="#f39c12"/><rect x="66" y="48" width="14" height="3" rx="1" fill="#f39c12"/>
    <path d="M50 72 Q60 80 70 72" stroke="#c0392b" stroke-width="2" fill="none"/>
    <path d="M52 76 Q60 70 68 76" fill="#c0392b"/>
    <rect x="95" y="85" width="8" height="40" rx="3" fill="#8B4513"/>
    <rect x="90" y="78" width="18" height="12" rx="3" fill="#95a5a6"/>
    <ellipse cx="20" cy="118" rx="14" ry="10" fill="#FDBCB4"/>
  </svg>`;
}

function hulkSmash(w, h) {
  return `<svg viewBox="0 0 120 180" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <rect x="22" y="85" width="76" height="80" rx="10" fill="#27ae60"/>
    <rect x="38" y="85" width="44" height="10" rx="3" fill="#7f8c8d" opacity="0.6"/>
    <ellipse cx="60" cy="55" rx="32" ry="32" fill="#2ecc71"/>
    <path d="M28 40 Q35 20 60 18 Q85 20 92 40" fill="#1a5e20"/>
    <rect x="38" y="52" width="16" height="7" rx="2" fill="#fff"/><rect x="66" y="52" width="16" height="7" rx="2" fill="#fff"/>
    <circle cx="48" cy="55" r="3" fill="#1a1008"/><circle cx="74" cy="55" r="3" fill="#1a1008"/>
    <rect x="36" y="46" width="20" height="4" rx="1" fill="#1a5e20"/><rect x="64" y="46" width="20" height="4" rx="1" fill="#1a5e20"/>
    <path d="M46 72 L52 68 L56 72 L60 68 L64 72 L68 68 L74 72" stroke="#1a5e20" stroke-width="2" fill="none"/>
    <ellipse cx="12" cy="110" rx="16" ry="14" fill="#2ecc71"/>
    <ellipse cx="108" cy="110" rx="16" ry="14" fill="#2ecc71"/>
    <rect x="4" y="104" width="16" height="12" rx="4" fill="#27ae60"/>
    <rect x="100" y="104" width="16" height="12" rx="4" fill="#27ae60"/>
  </svg>`;
}
