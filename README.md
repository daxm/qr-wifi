# qr-wifi

A free, open-source, client-side tool for generating printable guest WiFi
signs: a scannable WiFi QR code, an optional embedded logo, and any caption
text you like below it (PSK, expiration date, notes, etc.).

No backend, no build step, no tracking — everything runs in your browser.
Open `index.html` directly, or serve the folder as a static site.

## Usage

1. Open `index.html` in a browser (works offline, including via `file://`).
2. Fill in the SSID, security type, and password.
3. Optionally upload a logo — the slider controls how much of the QR code it
   covers. Keep it under ~25% or the code may stop scanning reliably; test
   with your phone before printing.
4. Add any caption text you'd like shown below the code.
5. Click **Download PNG** to save an image, or **Print Sign** to print
   directly from the browser (use "Save as PDF" in the print dialog for a
   PDF file).

## License

MIT — see [LICENSE](LICENSE). Uses the vendored
[qr-code-styling](https://github.com/kozakdenys/qr-code-styling) library
(MIT) — see [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md).
