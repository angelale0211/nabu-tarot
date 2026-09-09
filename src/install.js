/* ============================ install (#/install) ============================
   How to get the app on a phone. Android has two doors and they are NOT
   equal: the Play build can buy things, the downloaded .apk cannot. Play
   Billing only answers an app Play itself installed, so a sideloaded copy -
   and the site added to a home screen - look identical on the phone and can
   never reach the store. Play goes first and the .apk carries that warning in
   its own words; leaving them side by side unmarked cost a tester a day of
   tapping Buy on a build that could not answer. iPhone: Safari's Add to Home
   Screen, which is the same app and has the same limit. */
function platformOf() {
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  return 'other';
}
const isStandalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
function renderInstall() {
  const S = T(), m = $('#main'), pf = platformOf(), inApp = isStandalone() || isTWA();
  const play = CONFIG.playTestUrl ? '<div class="card"><h3>▶️ Google Play</h3><p class="muted" style="margin:6px 0 10px">' + esc(S.instPlayIntro) + '</p>'
    + '<a class="btn primary block" href="' + esc(CONFIG.playTestUrl) + '" target="_blank" rel="noopener">' + esc(S.instPlayBtn) + '</a>'
    + '<p class="hint">' + esc(S.instPlayNote) + '</p></div>' : '';
  const android = '<div class="card"><h3>🤖 Android</h3><p class="muted" style="margin:6px 0 10px">' + esc(S.instAndroidIntro) + '</p>'
    + (CONFIG.playTestUrl ? '<p class="hint err" style="margin:0 0 10px">' + esc(S.instApkWarn) + '</p>' : '')
    + '<a class="btn' + (CONFIG.playTestUrl ? '' : ' primary') + ' block" href="nabu-tarot.apk" download="nabu-tarot.apk">⬇️ ' + esc(S.instDownload) + '</a>'
    + '<ol class="steps" style="margin-top:12px">' + S.instAndroidSteps.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="hint">' + esc(S.instAndroidNote) + '</p></div>';
  const ios = '<div class="card"><h3>🍎 iPhone / iPad</h3><p class="muted" style="margin:6px 0 10px">' + esc(S.instIosIntro) + '</p>'
    + '<ol class="steps">' + S.instIosSteps.map((x) => '<li>' + esc(x) + '</li>').join('') + '</ol><p class="hint">' + esc(S.instIosNote) + '</p></div>';
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.installTitle) + '</h1><p class="muted">' + esc(S.instIntro) + '</p>'
    + (inApp ? '<div class="banner">✅ ' + esc(S.instAlready) + '</div>' : '')
    + (pf === 'ios' ? ios + play + android : play + android + ios)
    + '<div class="card"><h3>🔄 ' + esc(S.instUpdatesTitle) + '</h3><p class="muted" style="margin-top:6px">' + esc(S.instUpdates) + '</p></div>'
    + '<p class="hint" style="text-align:center">' + esc(S.instShareHint) + '</p><button class="btn block" id="instshare">🔗 ' + esc(S.instShare) + '</button>';
  $('#instshare').addEventListener('click', () => shareOrCopy(S.instShareText, appURL() + '#/install'));
}
ROUTES.install = { nav: 'me', render: renderInstall };
