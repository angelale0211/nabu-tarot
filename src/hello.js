/* ======================= the page a stranger arrives at =======================

   Somebody who types nabutarot.com has not decided anything yet. Dropping them
   into the app shell - a bottom tab bar, a lunar calendar, a greeting meant for
   somebody who already knows what this is - answers a question they have not
   asked. This page answers it: what the app is, what it costs (nothing, mostly),
   and one way in.

   Who sees it, and this is the whole rule: a browser, arriving with no hash at
   all, that has not been here before. So:

     - the installed app opens at ./index.html#/home  -> never sees it
     - the checks open ../index.html#/home            -> never see it
     - a bookmark or a shared link carries its hash   -> never sees it
     - nabutarot.com, typed, first time               -> sees it once

   Once is the point. A page you cannot get past is a wall, so going in is one
   tap and is remembered; coming back later goes straight to the app. */

const HELLO_SEEN = 'nabu-hello';

/* The free things first, because they are what the app mostly is. Money is
   mentioned once, at the end, without prices - a stranger deciding whether to
   look does not need a price list, and inside the installed app there is not
   supposed to be one. */
function helloHTML() {
  const S = T();
  const card = (ic, h, p) => '<div class="hcard"><span class="hic">' + ic + '</span><div><b>' + esc(h) + '</b><p>' + esc(p) + '</p></div></div>';
  return '<section class="hello-hero">'
    + '<div class="hlogo">' + LOGO + '</div>'
    + '<h1>' + esc(S.helloHead) + '</h1>'
    + '<p class="lead">' + esc(S.helloLead) + '</p>'
    + '<button type="button" class="btn primary block slidebtn" id="hellogo">'
      + '<span class="lbl">' + esc(S.helloGo) + '</span>'
      + '<i class="chev" aria-hidden="true"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg></i>'
      + '</button>'
    + '<p class="hint">' + esc(S.helloFree) + '</p>'
    + '</section>'
    + '<div class="hgrid">'
    + card('🃏', S.helloDrawH, S.helloDrawP)
    + card('📅', S.helloTodayH, S.helloTodayP)
    + card('🔮', S.helloHoroH, S.helloHoroP)
    + card('📚', S.helloLearnH, S.helloLearnP)
    + card('🎲', S.helloPlayH, S.helloPlayP)
    + card('💬', S.helloTalkH, S.helloTalkP)
    + '</div>';
}

function renderHello() {
  const m = $('#main');
  m.innerHTML = helloHTML();
  const go = () => { store.set(HELLO_SEEN, 1); location.hash = '#/home'; };
  $$('#hellogo', m).forEach((b) => b.addEventListener('click', go));
}
ROUTES.hello = { nav: '', render: renderHello };

/* Called once, from boot, before the first route is drawn. */
function helloFirst() {
  if (location.hash) return false;                 // a hash means somebody knows where they are going
  if (isTWA() || isStandalone()) return false;     // the installed app is not a stranger
  if (store.get(HELLO_SEEN, 0)) return false;      // been here before
  location.hash = '#/hello';
  return true;
}
