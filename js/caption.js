/**
 * Renders free-form multi-line caption text below the QR preview.
 * Not restricted to PSK/expiration -- any text the user types is shown as-is,
 * one <div> per line so print/screen CSS can style it consistently.
 */

function splitCaptionLines(text) {
  return (text || '').split('\n');
}

function renderCaption(containerEl, text) {
  containerEl.textContent = '';
  const lines = splitCaptionLines(text);
  lines.forEach((line) => {
    const lineEl = document.createElement('div');
    lineEl.className = 'caption-line';
    // Empty lines still need to occupy vertical space.
    lineEl.textContent = line.length ? line : ' ';
    containerEl.appendChild(lineEl);
  });
}
