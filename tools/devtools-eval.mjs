// Ask a question of the Nabu Tarot page running inside the Android app.
//
//   node tools/devtools-eval.mjs <adb serial> "<javascript expression>"
//   node tools/devtools-eval.mjs emulator-5554 "BILL.diag('plus')"
//
// The app is a Trusted Web Activity, so the page runs in Chrome and answers on
// Chrome's DevTools socket. Needs USB/emulator debugging and Node 22+ (built-in
// WebSocket). One caller at a time per PC: the forward is on a fixed port.
import { execSync } from 'node:child_process';

const [serial, expr] = process.argv.slice(2);
if (!serial || !expr) { console.error('usage: node tools/devtools-eval.mjs <serial> "<expression>"'); process.exit(2); }
const ADB = process.env.ADB || `${process.env.LOCALAPPDATA}\\Android\\Sdk\\platform-tools\\adb.exe`;
execSync(`"${ADB}" -s ${serial} forward tcp:9222 localabstract:chrome_devtools_remote`, { stdio: 'ignore' });

const targets = await (await fetch('http://localhost:9222/json')).json();
const page = targets.find((t) => t.type === 'page' && /nabutarot\.com/.test(t.url));
if (!page) { console.error('no nabutarot page open on', serial, '- open the app first. Targets:', targets.map((t) => t.url).join(' | ')); process.exit(1); }

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.onopen = resolve; ws.onerror = reject; });
const done = new Promise((resolve) => {
  ws.onmessage = (m) => { const j = JSON.parse(m.data); if (j.id === 1) { resolve(j); ws.close(); } };
});
ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: expr, awaitPromise: true, returnByValue: true } }));
const j = await done;
if (j.result && j.result.exceptionDetails) { console.error('threw:', JSON.stringify(j.result.exceptionDetails.exception || j.result.exceptionDetails, null, 1)); process.exit(1); }
const v = j.result && j.result.result;
console.log(v && 'value' in v ? (typeof v.value === 'string' ? v.value : JSON.stringify(v.value, null, 1)) : JSON.stringify(v, null, 1));
