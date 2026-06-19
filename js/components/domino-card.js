const PIP_POSITIONS = {
  0: [],
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]]
};

export function renderDomino(top, bottom, { skin = 'classic', horizontal = false, size = 'normal' } = {}) {
  const skinClass = skin !== 'classic' ? `domino--${skin}` : '';
  const dirClass = horizontal ? 'domino--horizontal' : '';
  const sizeStyles = size === 'small' ? 'width:32px;height:58px;' : size === 'large' ? 'width:56px;height:100px;' : '';

  const pipSize = size === 'small' ? 4 : size === 'large' ? 8 : 6;

  function renderHalf(value) {
    const positions = PIP_POSITIONS[value] || [];
    return `<div class="domino-half">
      ${positions.map(([x, y]) =>
        `<div class="domino-pip" style="left:${x}%;top:${y}%;width:${pipSize}px;height:${pipSize}px;transform:translate(-50%,-50%)"></div>`
      ).join('')}
    </div>`;
  }

  return `<div class="domino ${skinClass} ${dirClass}" style="${sizeStyles}" data-top="${top}" data-bottom="${bottom}">
    ${renderHalf(horizontal ? top : top)}
    <div class="domino-divider"></div>
    ${renderHalf(horizontal ? bottom : bottom)}
  </div>`;
}

export function renderDominoBack({ skin = 'classic', size = 'normal' } = {}) {
  const sizeStyles = size === 'small' ? 'width:32px;height:58px;' : '';
  return `<div class="domino" style="${sizeStyles}">
    <div style="flex:1;display:flex;align-items:center;justify-content:center;">
      <div style="width:70%;height:80%;border:1px solid var(--card-border);border-radius:3px;background:repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 6px)"></div>
    </div>
  </div>`;
}

export function createDominoElement(top, bottom, options = {}) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderDomino(top, bottom, options);
  return wrapper.firstElementChild;
}
