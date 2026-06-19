const queue = [];
const MAX_VISIBLE = 3;
let activeCount = 0;

export function showToast(message, type = 'info', duration = 3000) {
  if (activeCount >= MAX_VISIBLE) {
    queue.push({ message, type, duration });
    return;
  }
  createToast(message, type, duration);
}

function createToast(message, type, duration) {
  activeCount++;
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span>${getIcon(type)}</span>
    <span>${message}</span>
    <div class="toast-progress" style="animation-duration: ${duration}ms"></div>
  `;

  container.appendChild(toast);

  const timer = setTimeout(() => dismiss(toast), duration);

  toast.addEventListener('click', () => {
    clearTimeout(timer);
    dismiss(toast);
  });
}

function dismiss(toast) {
  toast.classList.add('toast--exit');
  setTimeout(() => {
    toast.remove();
    activeCount--;
    if (queue.length > 0) {
      const next = queue.shift();
      createToast(next.message, next.type, next.duration);
    }
  }, 300);
}

function getIcon(type) {
  switch (type) {
    case 'success': return '✓';
    case 'error':   return '✕';
    case 'warning': return '⚠';
    default:        return 'ℹ';
  }
}
