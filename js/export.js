/**
 * Composites the QR canvas + caption lines into a single offscreen canvas
 * and triggers a PNG download. Kept separate from the on-screen DOM caption
 * so print/screen layout can stay pure HTML+CSS while export stays pixel-exact.
 */

const EXPORT_PADDING = 24;
const CAPTION_FONT_SIZE = 20;
const CAPTION_LINE_HEIGHT = CAPTION_FONT_SIZE * 1.4;

function exportPng(qrCanvas, captionLines, filename) {
  const qrSize = qrCanvas.width;
  const nonEmptyCaption = captionLines.some((line) => line.trim().length > 0);
  const captionBlockHeight = nonEmptyCaption
    ? captionLines.length * CAPTION_LINE_HEIGHT + EXPORT_PADDING
    : 0;

  const canvas = document.createElement('canvas');
  canvas.width = qrSize + EXPORT_PADDING * 2;
  canvas.height = qrSize + EXPORT_PADDING * 2 + captionBlockHeight;

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(qrCanvas, EXPORT_PADDING, EXPORT_PADDING, qrSize, qrSize);

  if (nonEmptyCaption) {
    ctx.fillStyle = '#000000';
    ctx.font = `${CAPTION_FONT_SIZE}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let y = EXPORT_PADDING + qrSize + EXPORT_PADDING / 2;
    captionLines.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, y);
      y += CAPTION_LINE_HEIGHT;
    });
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
