/**
 * Builds WIFI: QR payloads per the de-facto ZXing WIFI QR spec:
 * WIFI:T:<type>;S:<ssid>;P:<password>;H:<true|false>;;
 */

// Escapes \ ; , " : in a single pass so backslash-escaping can't double-escape
// characters introduced by escaping an earlier match.
function escapeWifiValue(value) {
  return value.replace(/([\\;,":])/g, '\\$1');
}

// WPA/WPA2/WPA3 all encode as the literal "WPA" token -- there is no distinct
// WPA3 token in the informal spec that scanners recognize.
const SECURITY_TOKENS = {
  wpa: 'WPA',
  wpa2: 'WPA',
  wpa3: 'WPA',
  wep: 'WEP',
  nopass: 'nopass',
};

function buildWifiPayload({ ssid, password, security, hidden }) {
  const type = SECURITY_TOKENS[security] || 'nopass';
  const parts = [`T:${type}`, `S:${escapeWifiValue(ssid || '')}`];

  if (type !== 'nopass' && password) {
    parts.push(`P:${escapeWifiValue(password)}`);
  }

  if (hidden) {
    parts.push('H:true');
  }

  return `WIFI:${parts.join(';')};;`;
}
