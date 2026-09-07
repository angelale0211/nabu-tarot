/* ==================== what happened while you were away ====================

   Nobody was ever told anything. Someone accepted a thread, someone was not
   ready to say yes, a gift arrived, a booking was confirmed - and the only way
   to learn any of it was to open the right screen at the right moment and
   notice that something looked different. People proposed and then waited, and
   heard nothing back, because there was nothing to hear it with.

   This is the bell. It keeps the last sixty things that happened to this
   person, on this device, and says how many have not been read.

   Nothing is pushed and nothing new is stored in the cloud. Every line is
   worked out from a stream the app already watches, so there is no new
   collection for anyone to read, no rules to publish, and no third party in
   between. What makes a snapshot into news is memory: this device writes down
   the state it last saw, and an entry appears only when the state has moved.
   That memory survives being closed, so a proposal answered on Tuesday is
   still news when the app is next opened on Friday.

   The one thing it cannot do is wake a phone that is not looking at Nabu. It
   catches up the moment the app opens, which is what a bell is for.
*/

const ALERT_KEEP = 60;

const ALERTS = {
  all() { const a = store.get('nabu-alerts', []); return Array.isArray(a) ? a : []; },
  /* Every entry carries an id built from the thing that happened, so the same
     gift seen in three snapshots is still one line. */
  add(item) {
    if (!item || !item.id) return false;
    const list = this.all();
    if (list.some((n) => n.id === item.id)) return false;
    list.unshift({ id: item.id, k: item.k || 'app', at: item.at || Date.now(), t: item.t || '', b: item.b || '', href: item.href || '', seen: false });
    store.set('nabu-alerts', list.slice(0, ALERT_KEEP));
    alertsBadge();
    return true;
  },
  unseen() { return this.all().filter((n) => !n.seen).length; },
  markSeen() { const l = this.all(); l.forEach((n) => { n.seen = true; }); store.set('nabu-alerts', l); alertsBadge(); },
  clear() { store.set('nabu-alerts', []); alertsBadge(); }
};

/* The state this device last saw for one thing, and the answer is the state
   before this one. A booking that read "requested" yesterday and reads
   "confirmed" now is an event; the same snapshot twice is not. Kept on the
   device, so a change made while the app was shut is still found on opening. */
/* What this device last saw, without writing anything down. */
function alertSeen(key) {
  const m = store.get('nabu-alert-state', {}) || {};
  return Object.prototype.hasOwnProperty.call(m, key) ? m[key] : null;
}

function alertWas(key, value) {
  const m = store.get('nabu-alert-state', {}) || {};
  const had = Object.prototype.hasOwnProperty.call(m, key);
  const before = had ? m[key] : null;
  if (!had || before !== value) { m[key] = value; store.set('nabu-alert-state', m); }
  return had ? before : null;
}

function alertsBadge() {
  const b = document.getElementById('bell');
  if (!b) return;
  const n = ALERTS.unseen();
  b.innerHTML = '🔔' + (n ? '<span class="ndot">' + (n > 9 ? '9+' : n) + '</span>' : '');
  b.setAttribute('aria-label', T().alertTitle + (n ? ' (' + n + ')' : ''));
}

/* Something that happens while the app is open is said out loud as well as
   written down - once, and only if the phone was asked first. */
function alertSay(item, loud) {
  if (!ALERTS.add(item)) return;
  if (!loud) return;
  toast(item.t);
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const n = new Notification(item.t, { body: item.b || '', icon: 'icon-180.png', badge: 'icon-180.png', tag: item.id });
      n.onclick = () => { window.focus(); if (item.href) location.hash = item.href; n.close(); };
    } catch (e) { /* the phone said no, and the bell is enough */ }
  }
}

/* ---------------------------------------------------------------- the streams */

let ALERT_STOP = [];
function alertsStop() { ALERT_STOP.forEach((f) => { try { f(); } catch (e) { /* already gone */ } }); ALERT_STOP = []; }

/* The thread. Four things worth hearing about happen here and three of them
   used to happen in silence: being asked, being answered, and being answered
   no. The last one is the reason this exists - people proposed and then sat
   looking at a screen that had quietly gone back to how it was before. */
function alertsWatchLove() {
  if (!LOVEDB.ok()) return;
  const me = BE.user.uid;
  let giftStop = null;
  ALERT_STOP.push(LOVEDB.watchMine((bond) => {
    const S = T();
    if (!bond) {
      /* A live query answers "nothing" for an instant before the data lands.
         Writing that instant down would turn the data's arrival into news. */
      const had = alertSeen('love.bond');
      if (had === null) return;
      alertWas('love.bond', '');
      if (had) {
        alertSay({ id: 'love-untied-' + had, k: 'love', t: S.alertUntied, b: S.alertUntiedBody, href: '#/love' }, true);
        /* Whoever untied cleared their own pages. This is the other side
           clearing theirs, the moment it hears. */
        LOVEDB.clearMyDiary(had).catch(() => {});
      }
      alertWas('love.diary', '');
      alertWas('love.state', ''); alertWas('love.ask', '');
      if (giftStop) { giftStop(); giftStop = null; }
      return;
    }
    const wasBond = alertWas('love.bond', bond.id);
    const you = LOVE.other(bond, me), name = (you && (you.name || (you.handle ? '@' + you.handle : ''))) || S.loveSomeone;

    /* A device seeing a thread for the first time - a new phone, cleared data -
       is not being told that it just happened. Only a change is news. */
    if (wasBond !== null && wasBond !== bond.id) {
      alertSay({ id: 'love-tied-' + bond.id, k: 'love', t: S.alertTied(name), b: S.alertTiedBody, href: '#/love' }, true);
    }

    /* A question, and what became of it. The ask is remembered by who wrote it
       and when, so its disappearance can be read: gone with the stage moved on
       is a yes, gone with the stage where it was is a not yet. */
    const askNow = bond.ask && bond.ask.by ? bond.ask.by + '@' + (bond.ask.at || 0) : '';
    const wasAsk = alertWas('love.ask', askNow);
    const state = bond.state || 'tied';
    const wasState = alertWas('love.state', state);

    if (askNow && askNow !== wasAsk && bond.ask.by !== me) {
      alertSay({ id: 'love-ask-' + bond.id + '-' + (bond.ask.at || 0), k: 'love', t: S.alertAsked(name), b: S.alertAskedBody, href: '#/love' }, true);
    }
    if (wasAsk && !askNow && wasAsk.split('@')[0] === me && state === wasState) {
      /* Softly. Someone has just been told no, and the app is the only thing
         in the room with them. */
      alertSay({ id: 'love-no-' + bond.id + '-' + wasAsk.split('@')[1], k: 'love', t: S.alertNo(name), b: S.alertNoBody, href: '#/love' }, true);
    }
    if (state === 'engaged' && wasState !== null && wasState !== 'engaged') {
      alertSay({ id: 'love-yes-' + bond.id + '-' + (bond.engagedOn || ''), k: 'love', t: S.alertYes(name), b: S.alertYesBody, href: '#/love' }, true);
    }
    if (state === 'married' && wasState !== null && wasState !== 'married') {
      alertSay({ id: 'love-wed-' + bond.id + '-' + (bond.marriedOn || ''), k: 'love', t: S.alertWed(name), b: S.alertWedBody, href: '#/love' }, true);
    }
    /* Asked once, at the moment somebody would want to be asked - and not at
       all if they have already paid for one. */
    if ((state === 'engaged' || state === 'married') && wasState !== null && wasState !== state
        && !ACCESS.has('wedding')) {
      ALERTS.add({ id: 'wed-ask-' + bond.id + '-' + state, k: 'love',
        t: S.alertWedAsk(name), b: S.alertWedAskBody, href: '#/wedding' });
    }

    /* Asking to share diaries, and the answer to it. Neither used to be said
       anywhere, so a request could sit unanswered for weeks. */
    const step = LOVEDB.diaryStep(bond);
    const wasStep = alertWas('love.diary', step);
    if (wasStep !== null && step !== wasStep) {
      if (step === 'invited') {
        alertSay({ id: 'diary-ask-' + bond.id + '-' + Date.now(), k: 'love', t: S.alertDiaryAsk(name), b: S.alertDiaryAskBody, href: '#/play/diary' }, true);
      } else if (step === 'on') {
        alertSay({ id: 'diary-on-' + bond.id, k: 'love', t: S.alertDiaryOn(name), b: S.alertDiaryOnBody, href: '#/play/diary' }, true);
      } else if (wasStep === 'on') {
        alertSay({ id: 'diary-off-' + bond.id + '-' + Date.now(), k: 'love', t: S.alertDiaryOff(name), b: S.alertDiaryOffBody, href: '#/play/diary' }, true);
      }
    }

    alertsAnniversary(bond, name);

    if (!giftStop) {
      /* Only what has arrived since this device last looked. A phone opening
         the thread for the first time is not owed every gift ever given. */
      giftStop = LOVEDB.watchGifts(bond.id, (gifts) => {
        const St = T(), key = 'love.gift.' + bond.id;
        const list = (gifts || []).filter((g) => g.from !== me);
        const newest = list.reduce((n, g) => Math.max(n, g.at || 0), 0);
        const since = alertSeen(key);
        alertWas(key, String(newest));
        if (since === null) return;
        list.filter((g) => (g.at || 0) > Number(since)).forEach((g) => {
          alertSay({ id: 'gift-' + g.id, k: 'gift', at: g.at || Date.now(),
            t: St.alertGift(name, giftName(g.kind)), b: g.note || St.alertGiftBody, href: '#/love' }, true);
        });
      });
      ALERT_STOP.push(giftStop);
    }
  }));

  /* Somebody asking to tie a thread with you. */
  ALERT_STOP.push(LOVEDB.watchRequests((list) => {
    const S = T();
    const first = alertSeen('love.offers') === null;
    alertWas('love.offers', '1');
    (list || []).forEach((r) => {
      /* One that was already waiting belongs on the bell, but it did not just
         happen, so it does not interrupt. */
      alertSay({ id: 'offer-' + r.uid, k: 'love', at: r.at || Date.now(),
        t: S.alertOffer(r.name || ('@' + (r.handle || ''))), b: r.note || S.alertOfferBody, href: '#/love' }, !first);
    });
  }));
}

/* The day it began, come round again. Only for couples who asked to be
   reminded - it is their day, not the app's. */
function alertsAnniversary(bond, name) {
  if (!bond || !bond.since || !LOVE.local().anniv) return;
  const S = T(), today = new Date(), since = new Date(bond.since + 'T00:00:00');
  if (isNaN(since)) return;
  const iso = isoDate(today);
  if (today.getMonth() === since.getMonth() && today.getDate() === since.getDate()) {
    const years = today.getFullYear() - since.getFullYear();
    if (years > 0) {
      ALERTS.add({ id: 'anniv-' + bond.id + '-' + iso, k: 'love', t: S.alertAnniv(name, years), b: S.alertAnnivBody, href: '#/love' });
    }
  }
  /* And the round numbers the thread page already counts towards. */
  const days = LOVE.days(bond);
  if (LOVE.marks.indexOf(days) > -1) {
    ALERTS.add({ id: 'mark-' + bond.id + '-' + days, k: 'love', t: S.alertMark(name, days), b: S.alertMarkBody, href: '#/love' });
  }
}

/* A booking answered. Nabu confirms, moves or cancels it from the dashboard,
   and until now the only way to find out was to go and look. */
function alertsWatchBookings() {
  if (!BE.enabled || !BE.user || BE.isAdmin()) return;
  ALERT_STOP.push(BE.watchMyBookings((list) => {
    const S = T();
    (list || []).forEach((b) => {
      const key = 'bk.' + b.id, now = String(b.status || '') + '|' + String(b.slot || '');
      const before = alertWas(key, now);
      if (!before || before === now) return;
      const when = String(b.slot || '').replace('T', ' ');
      if (b.status === 'confirmed') alertSay({ id: key + '-ok-' + now, k: 'book', t: S.alertBookOk, b: when, href: '#/me' }, true);
      else if (b.status === 'cancelled') alertSay({ id: key + '-no-' + now, k: 'book', t: S.alertBookNo, b: when, href: '#/me' }, true);
      else if (b.status === 'declined') alertSay({ id: key + '-dec-' + now, k: 'book', t: S.alertBookNo, b: when, href: '#/me' }, true);
    });
  }));
}

/* A message from Nabu. The count on the profile tab already knew; nothing said
   so out loud. */
function alertsWatchMessages() {
  if (!BE.enabled || !BE.user || BE.isAdmin()) return;
  ALERT_STOP.push(BE.thread().onSnapshot((d) => {
    const S = T(), t = d.exists ? d.data() : null;
    if (!t) return;
    const stamp = String(t.lastAt && t.lastAt.seconds ? t.lastAt.seconds : (t.lastAt || ''));
    const before = alertWas('msg.last', stamp);
    if (!before || before === stamp || t.lastFrom !== 'admin') return;
    alertSay({ id: 'msg-' + stamp, k: 'msg', t: S.alertMsg, b: t.lastText || '', href: '#/me' }, true);
  }, () => {}));
}

/* Things this device can see for itself: a hungry companion, and a Nabu that
   has been updated underneath them. */
function alertsLocalCheck() {
  const S = T();
  try {
    const hungry = PETS.anyHungry();
    if (hungry.length) {
      const p = hungry[0], nm = p.name || L(PET_NAMES[p.kind]);
      ALERTS.add({ id: 'pet-' + isoDate(new Date()), k: 'pet',
        t: hungry.length > 1 ? S.alertPetMany(hungry.length) : S.alertPet(nm), b: S.alertPetBody, href: '#/play/pet' });
    }
  } catch (e) { /* no companion kept yet */ }
  const v = window.APP_VERSION || '';
  const was = alertWas('app.version', v);
  if (was && was !== v) ALERTS.add({ id: 'ver-' + v, k: 'app', t: S.alertUp(v), b: S.alertUpBody, href: '#/home' });
}

/* Every room this account has a seat in. The list lives on the account, so a
   new phone still knows what you said you would come to. */
function alertsWatchWeddings() {
  const ids = store.get('nabu-weddings', []) || [];
  if (!ids.length || typeof WED === 'undefined') return;
  ids.slice(-6).forEach((id) => {
    ALERT_STOP.push(WED.watch(id, (w) => {
      if (!w) return;
      const S = T(), pair = (w.aName || '') + ' & ' + (w.bName || '');
      const day = isoDate(new Date(Number(w.startMs) || 0));
      /* Today, once. */
      if (day === isoDate(new Date()) && !w.doneAt) {
        ALERTS.add({ id: 'wed-today-' + id + '-' + day, k: 'love',
          t: S.alertWedToday(pair), b: S.alertWedTodayBody, href: '#/wedding/' + id });
      }
      /* And the moment the doors open, which is the only moment the link
         works and lasts a quarter of an hour. */
      if (WED.doorState(w) === 'open' && !w.doneAt) {
        alertSay({ id: 'wed-open-' + id + '-' + day, k: 'love',
          t: S.alertWedOpen(pair), b: S.alertWedOpenBody, href: '#/wedding/' + id }, true);
      }
    }));
  });
}

function alertsStart() {
  alertsStop();
  alertsLocalCheck();
  if (!BE.enabled || !BE.user) { alertsBadge(); return; }
  try { alertsWatchLove(); } catch (e) { /* the thread is not reachable */ }
  try { alertsWatchWeddings(); } catch (e) { /* no room is reachable */ }
  try { alertsWatchBookings(); } catch (e) { /* bookings are not reachable */ }
  try { alertsWatchMessages(); } catch (e) { /* the thread doc is not reachable */ }
  alertsBadge();
}

/* ---------------------------------------------------------------- the screen */

const ALERT_ICON = { love: '🧧', gift: '🎁', book: '📅', msg: '💬', pet: '🍚', app: '✨' };

function renderAlerts() {
  const S = T(), m = $('#main');
  const draw = () => {
    const list = ALERTS.all();
    const today = isoDate(new Date());
    const yest = isoDate(new Date(Date.now() - 86400000));
    const groups = [[S.alertToday, []], [S.alertYesterday, []], [S.alertEarlier, []]];
    list.forEach((n) => {
      const d = isoDate(new Date(n.at || 0));
      groups[d === today ? 0 : d === yest ? 1 : 2][1].push(n);
    });
    const time = (at) => { const d = new Date(at || 0); return pad2(d.getHours()) + ':' + pad2(d.getMinutes()); };
    const row = (n) => '<a class="alert' + (n.seen ? '' : ' fresh') + '" href="' + esc(n.href || '#/home') + '">'
      + '<span class="ai">' + (ALERT_ICON[n.k] || ALERT_ICON.app) + '</span>'
      + '<span class="at"><b>' + esc(n.t) + '</b>'
      + (n.b ? '<span class="ab">' + esc(n.b) + '</span>' : '')
      + '<span class="aw">' + esc(time(n.at)) + '</span></span></a>';

    m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div>'
      + '<h1 style="margin-bottom:6px">🔔 ' + esc(S.alertTitle) + '</h1>'
      + '<p class="muted">' + esc(S.alertIntro) + '</p>'
      + '<p class="hint pulltip">\u2193 ' + esc(S.alertPullTip) + '</p>'
      /* The two buttons sit above the list, not under it. With a hundred
         notifications, a button at the bottom is a button nobody reaches. */
      + (list.length
        ? '<div class="row alertacts"><button type="button" class="btn" id="alread">' + esc(S.alertReadAll) + '</button>'
          + '<button type="button" class="btn" id="alclear">' + esc(S.alertClear) + '</button></div>'
          + groups.filter((g) => g[1].length).map((g) =>
            '<h3 class="alerthead">' + esc(g[0]) + '</h3><div class="alerts">' + g[1].map(row).join('') + '</div>').join('')
        : '<div class="card"><p class="lead" style="text-align:center">🔔</p>'
          + '<p class="hint" style="text-align:center">' + esc(S.alertNone) + '</p></div>');

    if (list.length) {
      $('#alread').addEventListener('click', () => { ALERTS.markSeen(); draw(); });
      $('#alclear').addEventListener('click', () => { ALERTS.clear(); draw(); });
    }
  };
  draw();
  /* Opening the bell is reading them; the count clears on the way out so the
     visitor can still see which ones were new while they are looking. */
  const list = ALERTS.all();
  if (list.some((n) => !n.seen)) setTimeout(() => { ALERTS.markSeen(); }, 1200);
}

ROUTES.alerts = { nav: '', render: renderAlerts };
