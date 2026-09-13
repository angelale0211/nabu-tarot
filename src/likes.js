/* ============================ likes ============================
   A heart under Nabu's own posts. Anyone reads the number; a signed-in
   person adds or takes back exactly one, and one is all they can have: the
   document is named after the post and the person together, so a second tap
   from the same phone lands on the same row rather than counting twice.
   That is the `votes` shape the polls already use, for the same reason.

   Nabu's posts only. A post synced from Facebook is carried here to be read,
   and its hearts live on Facebook where they were given; a heart here would
   be a second, smaller number for the same post, disagreeing with the one
   people can already see. The note that introduces Nabu Tarot is a welcome,
   not a conversation, so it has no heart and no comments - the same rule, in
   the same two places, as comments.js.

   Nothing here is live. A heart is not a conversation: the number is read
   once per post per session, and the reader's own tap is shown at once from
   what this module already knows, rather than by listening to the server for
   a change it just made itself. */
const LIKE_CAP = 1000;
const LIKES = {
  /* Per session: how many hearts a post has, and whether this phone gave one.
     Both are filled by fill() and kept until the app is closed. */
  counts: {},
  mine: {},
  key(id) { return 'post:' + String(id || ''); },
  /* Nabu's own post, and not the welcome note. `fb` is set in allPosts() on
     everything that came from fb.json. */
  allowed(p) { return !!(p && p.id && !p.welcome && !p.fb); },
  ok() { return !!(typeof BE !== 'undefined' && BE.enabled && BE.db); },
  col() { return BE.db.collection('likes'); },
  /* The row this person's heart on this post would be, whether or not it
     exists. Naming it rather than searching for it is what makes one heart
     per person a fact about the database instead of a promise in the app. */
  id(key, uid) { return key + '_' + uid; },
  async add(key) {
    if (!this.ok() || !BE.user) throw new Error('signin');
    await this.col().doc(this.id(key, BE.user.uid)).set({ on: key, uid: BE.user.uid,
      at: firebase.firestore.FieldValue.serverTimestamp() });
  },
  async remove(key) {
    if (!this.ok() || !BE.user) throw new Error('signin');
    await this.col().doc(this.id(key, BE.user.uid)).delete();
  },
  /* The number, and whether this phone is in it. Each is asked once per post
     per session and they are asked separately, because they stop being
     unknown at different moments: the number is read for everybody, the
     second question only means anything once somebody is signed in. Asking
     them together read the count first and returned early when it was known,
     so somebody who signed in after the feed had been drawn saw every one of
     their own hearts as empty until the app was closed and opened again.

     Offline both stay unknown and the heart shows no number, which is better
     than a zero that is not true. */
  async fill(key) {
    if (!this.ok()) return null;
    try {
      if (this.counts[key] == null) {
        const q = this.col().where('on', '==', key);
        this.counts[key] = typeof q.count === 'function' ? (await q.count().get()).data().count : (await q.limit(LIKE_CAP).get()).docs.length;
      }
      if (BE.user && this.mine[key] === undefined) {
        const d = await this.col().doc(this.id(key, BE.user.uid)).get();
        this.mine[key] = !!(d && d.exists);
      }
      return this.counts[key];
    } catch (e) { return this.counts[key] == null ? null : this.counts[key]; }
  },
  /* Signing out is not this phone's hearts going away, but it is this phone
     no longer knowing which were its own; `counts` is a public number and
     stays. Called from the same place that clears the rest of the session. */
  forget() { this.mine = {}; }
};
/* A count of nothing shows no number at all, so a post nobody has liked reads
   as an invitation rather than as a zero. */
function likeCountText(n) { return !n ? '' : (n >= LIKE_CAP ? LIKE_CAP + '+' : String(n)); }
/* `alone` when nothing else stands at the left end of the footer - on a
   post's own page, where the comment count is not repeated. */
function likeBtnHTML(p, alone) {
  const S = T(), key = LIKES.key(p.id), on = !!LIKES.mine[key];
  return '<button type="button" class="likeb' + (on ? ' on' : '') + (alone ? ' alone' : '') + '" data-like="' + esc(key) + '"'
    + ' aria-pressed="' + (on ? 'true' : 'false') + '" aria-label="' + esc(S.likeTitle) + '" title="' + esc(S.likeTitle) + '">'
    + '<span class="lk">' + (on ? '❤️' : '🤍') + '</span><span class="n">' + esc(likeCountText(LIKES.counts[key])) + '</span></button>';
}
/* The heart shows the tap before the server has heard about it, because a
   heart that waits for a round trip feels broken on a slow phone. If the
   write is refused, the button goes back to what it was and says why. */
function likeBind(root) {
  $$('[data-like]', root).forEach((b) => b.addEventListener('click', async () => {
    const S = T(), key = b.getAttribute('data-like');
    if (!BE.user) { toast(S.likeSignIn); location.hash = signinHref(); return; }
    if (b.disabled) return;
    const was = !!LIKES.mine[key], had = LIKES.counts[key] || 0;
    const show = (on, n) => {
      LIKES.mine[key] = on; LIKES.counts[key] = n;
      $$('[data-like="' + key + '"]', document).forEach((x) => {
        x.classList.toggle('on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
        const lk = $('.lk', x), num = $('.n', x);
        if (lk) lk.textContent = on ? '❤️' : '🤍';
        if (num) num.textContent = likeCountText(n);
      });
    };
    b.disabled = true;
    show(!was, Math.max(0, had + (was ? -1 : 1)));
    try { await (was ? LIKES.remove(key) : LIKES.add(key)); }
    catch (e) { show(was, had); toast(e && e.message === 'signin' ? S.likeSignIn : loveWhy(e)); }
    b.disabled = false;
  }));
}
/* The number on each post on the page. Asked once per post per session. */
function likeFill(root) {
  $$('[data-like]', root).forEach((b) => {
    const key = b.getAttribute('data-like');
    LIKES.fill(key).then((n) => {
      if (n == null) return;
      const num = $('.n', b), lk = $('.lk', b), on = !!LIKES.mine[key];
      if (num) num.textContent = likeCountText(n);
      if (lk) lk.textContent = on ? '❤️' : '🤍';
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  });
}
