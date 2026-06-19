# Design System — GAPLE ROYALE
### Casino Premium UI · Velvet Noir Theme

---

## Overview

Gaple Royale menggunakan tema **Velvet Noir Casino** — dark luxury dengan aksen gold, tipografi serif klasik Cinzel, dan tekstur felt casino. Setiap keputusan desain terinspirasi dari kasino Las Vegas kelas atas: bukan gemerlap murahan, tapi sophistication yang dalam.

---

## Color Tokens

```css
:root {
  /* BACKGROUNDS */
  --bg-void:        #080a06;
  --bg-primary:     #0d110a;
  --bg-surface:     #141a10;
  --bg-felt:        #0f3d1e;
  --bg-felt-light:  #145a2a;
  --bg-felt-dark:   #091c10;
  --bg-elevated:    #1e2619;
  --bg-overlay:     rgba(8,10,6,0.88);

  /* GOLD (brand utama) */
  --gold-bright:    #f5c842;
  --gold-warm:      #d4a017;
  --gold-deep:      #9a7010;
  --gold-pale:      #fef0a0;
  --gold-gradient:  linear-gradient(135deg, #f5c842 0%, #d4a017 50%, #f5c842 100%);

  /* KARTU DOMINO */
  --card-ivory:     #f5f0e8;
  --card-border:    #d4b896;
  --card-pip:       #1a1008;
  --card-shadow:    rgba(0,0,0,0.6);

  /* TEKS */
  --text-primary:   #f0ead6;
  --text-secondary: rgba(240,234,214,0.55);
  --text-muted:     rgba(240,234,214,0.30);
  --text-gold:      #f5c842;
  --text-dark:      #0d110a;

  /* STATUS */
  --status-win:     #2ecc71;
  --status-lose:    #e74c3c;
  --status-neutral: #95a5a6;
  --status-warning: #f39c12;

  /* BORDER */
  --border-default: rgba(212,160,23,0.15);
  --border-gold:    rgba(212,160,23,0.45);
  --border-bright:  rgba(245,200,66,0.8);
}
```

### Color Usage Guide

| Token | Gunakan Untuk | Jangan Gunakan Untuk |
|---|---|---|
| `--bg-void` | Body background, splash screen | Panel, card |
| `--bg-felt` | Meja domino, game board | Background halaman |
| `--gold-bright` | CTA button, angka menang, aktif state | Dekorasi biasa |
| `--gold-warm` | Border premium, ikon, label | Background button |
| `--text-primary` | Semua teks body | Teks di atas background terang |
| `--card-ivory` | Permukaan kartu domino saja | Background UI |

---

## Typography

```css
/* Fonts dari Google Fonts (gratis): */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;600&display=swap');

:root {
  --font-display: 'Cinzel', serif;    /* Logo, judul, skor besar */
  --font-body:    'Crimson Pro', serif; /* Teks naratif, chat, deskripsi */
  --font-mono:    'JetBrains Mono', monospace; /* Angka coin, kode room, timer */
}
```

### Font Pairing Rationale

**Cinzel** dipilih karena akar romawi klasiknya — sama dengan nuansa signage kasino mewah di Las Vegas dan Monaco. Memberikan authority tanpa keangkuhan.

**Crimson Pro** sebagai body font: elegant serif yang nyaman dibaca dalam dark background. Italic-nya memberikan nuansa literary yang sesuai dengan karakter game naratif.

**JetBrains Mono** untuk angka teknis: monospace ensures aligned numbers (penting untuk coin counter dan timer countdown).

### Type Scale

| Nama | Size | Weight | Font | Gunakan Untuk |
|---|---|---|---|---|
| Hero | clamp(48, 8vw, 120px) | 900 | Cinzel | Judul splash, logo utama |
| Display | clamp(32, 5vw, 72px) | 700 | Cinzel | Halaman headline |
| Heading | clamp(22, 3vw, 40px) | 600 | Cinzel | Card title, modal title |
| Body LG | 20px | 400 | Crimson Pro | Lead text, karakter description |
| Body | 16px | 400 | Crimson Pro | Teks umum |
| Small | 14px | 400 | Crimson Pro | Helper text, timestamp |
| Label | 11px | 600 | Cinzel | Badge, uppercase label |
| Mono | 14-20px | 600 | JetBrains Mono | Angka coin, timer, kode room |

---

## Spacing (8pt Grid)

```css
:root {
  --sp-1: 4px;   /* Micro-optical, icon gap */
  --sp-2: 8px;   /* Tight grouping */
  --sp-3: 12px;  /* Form control internal */
  --sp-4: 16px;  /* Standard padding */
  --sp-5: 24px;  /* Card padding */
  --sp-6: 32px;  /* Section blocks */
  --sp-7: 48px;  /* Major section gap */
  --sp-8: 64px;  /* Hero section */
  --sp-9: 96px;  /* Full-bleed sections */
}
```

---

## Components

### Button

```css
/* Primary CTA — gold gradient */
.btn-primary {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--text-dark);
  background: var(--gold-gradient);
  border: none;
  border-radius: var(--radius-md);
  padding: 14px 32px;
  cursor: pointer;
  transition: filter 150ms ease, transform 100ms ease;
}
.btn-primary:hover  { filter: brightness(1.1); transform: translateY(-1px); }
.btn-primary:active { transform: translateY(0) scale(0.98); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

/* Secondary — border gold */
.btn-secondary {
  background: transparent;
  border: 1px solid var(--border-gold);
  color: var(--text-gold);
  /* ... same padding, font */
}
.btn-secondary:hover { background: rgba(212,160,23,0.08); }

/* Ghost — minimal */
.btn-ghost {
  background: transparent;
  border: none;
  color: var(--text-secondary);
}
.btn-ghost:hover { color: var(--text-primary); }
```

**States semua button:** default · hover · active (scale down) · focus (outline gold 2px) · disabled (opacity 0.4, no pointer) · loading (spinner + disabled)

### Card

```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  padding: var(--sp-5);
  transition: border-color 200ms ease, transform 200ms ease;
}
.card:hover {
  border-color: var(--border-gold);
  transform: translateY(-2px);
}
.card--premium {
  border-color: var(--border-gold);
  box-shadow: 0 0 20px rgba(212,160,23,0.1);
}
.card--glass {
  background: rgba(20,26,16,0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-color: var(--border-gold);
}
```

### Domino Card (CSS Rendered)

```css
.domino {
  width: 44px;
  height: 80px;
  background: var(--card-ivory);
  border: 1.5px solid var(--card-border);
  border-radius: 6px;
  box-shadow: 2px 3px 8px var(--card-shadow);
  display: flex;
  flex-direction: column;
  position: relative;
}
.domino__half {
  flex: 1;
  display: grid;
  place-items: center;
  padding: 4px;
}
.domino__divider {
  width: 100%;
  height: 1px;
  background: var(--card-border);
}
.domino__pip {
  width: 6px;
  height: 6px;
  background: var(--card-pip);
  border-radius: 50%;
}
/* Skin: midnight */
.domino--midnight { background: #1a1a1a; --card-pip: #f0f0f0; }
/* Skin: royal_gold */
.domino--royal_gold { border-color: var(--gold-warm); box-shadow: 0 0 8px rgba(212,160,23,0.3); }
/* Skin: emerald */
.domino--emerald { background: #e8f5e9; --card-pip: #1b5e20; }
```

### Toast

```css
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding: 12px 20px;
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--gold-warm);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 15px;
  min-width: 240px;
  max-width: 360px;
  animation: toastIn 300ms var(--ease-out) forwards;
}
.toast--success { border-left-color: var(--status-win); }
.toast--error   { border-left-color: var(--status-lose); }
.toast--warning { border-left-color: var(--status-warning); }

@keyframes toastIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);   opacity: 1; }
}
```

### Input Field

```css
.input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 16px;
  transition: border-color 150ms ease;
  outline: none;
}
.input::placeholder { color: var(--text-muted); }
.input:focus   { border-color: var(--border-bright); }
.input--error  { border-color: var(--status-lose); }
.input--valid  { border-color: var(--status-win); }

.input-label {
  font-family: var(--font-display);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-secondary);
  margin-bottom: 8px;
  display: block;
}
.input-error-msg {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--status-lose);
  margin-top: 6px;
}
```

---

## Motion System

### Principles
1. Animasi **melayani hierarchy** — elemen terpenting muncul pertama
2. Easing **tidak pernah linear** (kecuali progress bar) — selalu `ease-out` atau custom cubic-bezier
3. **Tidak ada animasi yang memblokir konten** lebih dari 600ms
4. Semua animasi menggunakan `transform` dan `opacity` — tidak pernah `top`, `left`, `width`, `height`
5. Semua animasi punya `prefers-reduced-motion` fallback

### Keyframes Utama

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes coinFall {
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
@keyframes goldShimmer {
  0%, 100% { background-position: -200% center; }
  50%       { background-position: 200% center; }
}
@keyframes characterBreathe {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-4px); }
}
@keyframes radarPulse {
  0%   { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2);   opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

---

## Karakter 2D — Spec SVG

Semua karakter dibuat dari SVG shapes murni. Tidak ada gambar eksternal.

### Raja Domino (raja_domino)
- Warna dasar kulit: `#F4C27A`
- Baju: merah tua `#8B0000`
- Mahkota: gold `#f5c842`
- Kumis: hitam tebal
- Ekspresi: percaya diri, sedikit angkuh

### Si Hoki (si_hoki)
- Warna dasar kulit: `#E8B89A`
- Topi: kuning cerah `#FFD700`, miring 15°
- Baju: kasual hijau muda
- Ekspresi: senyum lebar, friendly

### Juragan Meja (juragan_meja)
- Warna dasar kulit: `#C68642`
- Baju: batik pattern (CSS pattern sederhana)
- Postur: besar, tangan di atas meja
- Ekspresi: serius, berwibawa

### Sang Bluffer (sang_bluffer)
- Warna dasar kulit: `#FDBCB4`
- Kacamata: hitam bulat
- Baju: jas hitam, dasi merah
- Props: kartu domino di tangan
- Ekspresi: misterius, satu alis naik

---

## Accessibility

| Requirement | Implementasi |
|---|---|
| Kontras teks | Semua teks `--text-primary` (#f0ead6) di atas `--bg-primary` (#0d110a): rasio 13.2:1 ✓ |
| Focus visible | Semua interactive element: `outline: 2px solid var(--gold-bright); outline-offset: 2px;` |
| ARIA labels | Icon-only buttons wajib punya `aria-label` |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` di semua animasi |
| Keyboard nav | Tab order mengikuti visual order |
| Min touch target | 44×44px untuk semua interactive element di mobile |

---

## Responsive Breakpoints

```css
/* Mobile first */
/* xs: 0-374px   — small phones */
/* sm: 375px     — standard mobile */
/* md: 768px     — tablet */
/* lg: 1024px    — small desktop */
/* xl: 1280px    — standard desktop */

@media (max-width: 767px) {
  /* Bottom navigation aktif */
  /* Sidebar hidden */
  /* Game board compressed */
  /* Kartu lebih kecil */
}
@media (min-width: 768px) {
  /* Sidebar visible */
  /* Bottom nav hidden */
}
```
