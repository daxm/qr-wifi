/**
 * Thin wrapper around the vendored QRCodeStyling library: forces error
 * correction level H (required so the code still decodes with a logo
 * punched into the middle) and clamps logo footprint to a scannable range.
 */

const QR_SIZE_PX = 320;
const MAX_LOGO_IMAGE_SIZE = 0.25; // 25% of QR area -- above this, scans get unreliable
const MIN_LOGO_IMAGE_SIZE = 0.10;

let qrInstance = null;

function clampLogoSize(size) {
  return Math.min(MAX_LOGO_IMAGE_SIZE, Math.max(MIN_LOGO_IMAGE_SIZE, size));
}

// data: { payload, logoDataUrl, logoSizeRatio }
function renderQr(containerEl, data) {
  const options = {
    width: QR_SIZE_PX,
    height: QR_SIZE_PX,
    data: data.payload,
    margin: 8,
    qrOptions: {
      errorCorrectionLevel: 'H',
    },
    backgroundOptions: {
      color: '#ffffff',
    },
  };

  if (data.logoDataUrl) {
    options.image = data.logoDataUrl;
    options.imageOptions = {
      hideBackgroundDots: true,
      imageSize: clampLogoSize(data.logoSizeRatio),
      margin: 6,
      crossOrigin: 'anonymous',
    };
  }

  if (!qrInstance) {
    qrInstance = new QRCodeStyling(options);
    containerEl.innerHTML = '';
    qrInstance.append(containerEl);
  } else {
    qrInstance.update(options);
  }

  return qrInstance;
}

// Resolves the underlying canvas element so export.js can composite it,
// waiting a tick since QRCodeStyling renders/updates asynchronously.
function getQrCanvas(containerEl) {
  return containerEl.querySelector('canvas');
}
