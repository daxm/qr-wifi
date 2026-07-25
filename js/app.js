/**
 * Wires the form inputs to the QR/caption render pipeline, and handles
 * logo upload, live (debounced) preview updates, PNG export, and print.
 */

(function () {
  const els = {
    ssid: document.getElementById('ssid-input'),
    ssidCount: document.getElementById('ssid-char-count'),
    password: document.getElementById('password-input'),
    togglePassword: document.getElementById('toggle-password-btn'),
    security: document.getElementById('security-select'),
    hidden: document.getElementById('hidden-checkbox'),
    logoInput: document.getElementById('logo-input'),
    logoThumb: document.getElementById('logo-thumb'),
    logoRemove: document.getElementById('logo-remove-btn'),
    logoSize: document.getElementById('logo-size-slider'),
    logoWarning: document.getElementById('logo-warning'),
    caption: document.getElementById('caption-textarea'),
    qrPreview: document.getElementById('qr-preview'),
    captionPreview: document.getElementById('caption-preview'),
    downloadBtn: document.getElementById('download-png-btn'),
    printBtn: document.getElementById('print-btn'),
  };

  const SSID_MAX_LENGTH = 32;
  const LOGO_WARNING_THRESHOLD = 0.2;

  let logoDataUrl = null;

  function debounce(fn, delay) {
    let timer = null;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  function currentFormState() {
    return {
      ssid: els.ssid.value,
      password: els.password.value,
      security: els.security.value,
      hidden: els.hidden.checked,
      logoDataUrl,
      logoSizeRatio: Number(els.logoSize.value),
      caption: els.caption.value,
    };
  }

  function render() {
    const state = currentFormState();

    els.ssidCount.textContent = `${state.ssid.length}/${SSID_MAX_LENGTH}`;
    els.password.disabled = state.security === 'nopass';
    els.logoWarning.hidden = state.logoSizeRatio <= LOGO_WARNING_THRESHOLD || !logoDataUrl;

    const payload = buildWifiPayload(state);
    renderQr(els.qrPreview, {
      payload,
      logoDataUrl: state.logoDataUrl,
      logoSizeRatio: state.logoSizeRatio,
    });
    renderCaption(els.captionPreview, state.caption);
  }

  const debouncedRender = debounce(render, 200);

  [els.ssid, els.password, els.security, els.hidden, els.logoSize, els.caption].forEach((el) => {
    el.addEventListener('input', debouncedRender);
    el.addEventListener('change', debouncedRender);
  });

  els.togglePassword.addEventListener('click', () => {
    const isPassword = els.password.type === 'password';
    els.password.type = isPassword ? 'text' : 'password';
    els.togglePassword.textContent = isPassword ? 'Hide' : 'Show';
  });

  els.logoInput.addEventListener('change', () => {
    const file = els.logoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      logoDataUrl = reader.result;
      els.logoThumb.src = logoDataUrl;
      els.logoThumb.hidden = false;
      els.logoRemove.hidden = false;
      render();
    };
    reader.readAsDataURL(file);
  });

  els.logoRemove.addEventListener('click', () => {
    logoDataUrl = null;
    els.logoInput.value = '';
    els.logoThumb.hidden = true;
    els.logoRemove.hidden = true;
    render();
  });

  els.downloadBtn.addEventListener('click', () => {
    const qrCanvas = getQrCanvas(els.qrPreview);
    if (!qrCanvas) return;
    const lines = splitCaptionLines(els.caption.value);
    exportPng(qrCanvas, lines, 'wifi-sign.png');
  });

  els.printBtn.addEventListener('click', () => {
    window.print();
  });

  render();
})();
