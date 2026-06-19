export function showModal(content, { title = '', closable = true, onClose = null } = {}) {
  const container = document.getElementById('modal-container');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  let html = '';
  if (closable) {
    html += '<button class="modal-close" aria-label="Tutup">&times;</button>';
  }
  if (title) {
    html += `<div class="modal-title">${title}</div>`;
  }
  html += '<div class="modal-body"></div>';
  modal.innerHTML = html;

  const body = modal.querySelector('.modal-body');
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof HTMLElement) {
    body.appendChild(content);
  }

  overlay.appendChild(modal);
  container.appendChild(overlay);

  function close() {
    overlay.style.animation = 'fadeOut 0.2s ease forwards';
    modal.style.animation = 'fadeOut 0.15s ease forwards';
    setTimeout(() => {
      overlay.remove();
      if (onClose) onClose();
    }, 200);
  }

  if (closable) {
    modal.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });
  }

  return { close, modal, body };
}

export function showConfirm(message, { title = 'Konfirmasi', confirmText = 'Ya', cancelText = 'Batal' } = {}) {
  return new Promise(resolve => {
    const content = document.createElement('div');
    content.innerHTML = `
      <p style="margin-bottom: var(--sp-5); color: var(--text-primary); font-size: var(--text-md);">${message}</p>
      <div class="flex gap-3" style="justify-content: flex-end;">
        <button class="btn btn-ghost" id="modal-cancel">${cancelText}</button>
        <button class="btn btn-primary" id="modal-confirm">${confirmText}</button>
      </div>
    `;

    const { close } = showModal(content, {
      title,
      closable: true,
      onClose: () => resolve(false)
    });

    content.querySelector('#modal-cancel').addEventListener('click', () => {
      close();
      resolve(false);
    });
    content.querySelector('#modal-confirm').addEventListener('click', () => {
      close();
      resolve(true);
    });
  });
}
