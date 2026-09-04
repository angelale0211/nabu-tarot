/* ============================ admin (#/admin) ============================
   Posts and availability are files in the repo, committed through the
   GitHub API with a fine-grained token. Bookings and the inbox live in
   Firestore and need an admin sign-in. */
const admin = { tab: 'posts', editing: null, cards: [], busy: false, unsubs: [] };
const ghHeaders = (token) => ({ Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' });
const b64enc = (s) => btoa(unescape(encodeURIComponent(s)));
const b64dec = (s) => decodeURIComponent(escape(atob(s.replace(/\n/g, ''))));
const ghToken = () => store.get('nabu-gh-token', '');
async function ghRead(path) {
  const r = await fetch('https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path + '?ref=' + CONFIG.branch, { headers: ghHeaders(ghToken()), cache: 'no-store' });
  if (r.status === 404) return { sha: null, json: null };
  if (!r.ok) throw new Error('GET ' + r.status);
  const j = await r.json();
  return { sha: j.sha, json: JSON.parse(b64dec(j.content)) };
}
async function ghWrite(path, obj, sha, message) {
  const body = { message: message, content: b64enc(JSON.stringify(obj, null, 1)), branch: CONFIG.branch };
  if (sha) body.sha = sha;
  const r = await fetch('https://api.github.com/repos/' + CONFIG.repo + '/contents/' + path, { method: 'PUT', headers: ghHeaders(ghToken()), body: JSON.stringify(body) });
  if (!r.ok) { let t = ''; try { t = (await r.json()).message; } catch (e) { /* ignore */ } throw new Error('PUT ' + r.status + ' ' + t); }
}
function adminCleanup() { admin.unsubs.forEach((u) => { try { u(); } catch (e) { /* gone */ } }); admin.unsubs = []; }

function renderAdmin() {
  adminCleanup();
  const S = T(), m = $('#main');
  m.innerHTML = '<div class="eyebrow">' + esc(CONFIG.brand) + '</div><h1 style="margin-bottom:6px">' + esc(S.adminTitle) + '</h1><p class="muted">' + esc(S.adminIntro) + '</p>'
    + '<div class="tabs" id="atabs">' + ['posts', 'schedule', 'bookings', 'inbox'].map((k) => '<button data-t="' + k + '" class="' + (admin.tab === k ? 'on' : '') + '">' + esc(S.adminTabs[k]) + '</button>').join('') + '</div>'
    + '<div class="card"><label class="f" for="gtoken">' + esc(S.token) + '</label><div class="row"><input id="gtoken" type="password" value="' + esc(ghToken()) + '" style="flex:1" autocomplete="off"><button class="btn sm" id="savetoken">' + esc(S.saveToken) + '</button></div><p class="hint">' + esc(S.tokenHint) + ' (' + esc(CONFIG.repo) + ')</p></div>'
    + '<div id="apanel"></div>';
  $('#savetoken').addEventListener('click', () => { store.set('nabu-gh-token', $('#gtoken').value.trim()); toast('✓'); show(admin.tab); });
  $$('#atabs button').forEach((b) => b.addEventListener('click', () => { admin.tab = b.getAttribute('data-t'); $$('#atabs button').forEach((x) => x.classList.toggle('on', x === b)); show(admin.tab); }));
  const show = (t) => { adminCleanup(); const p = $('#apanel'); if (t === 'posts') adminPosts(p); else if (t === 'schedule') adminSchedule(p); else if (t === 'bookings') adminBookings(p); else adminInbox(p); };
  show(admin.tab);
}

/* ---- posts ---- */
function adminPosts(p) {
  const S = T();
  p.innerHTML = '<div class="card"><h3 id="formhead" style="margin-bottom:4px">' + esc(S.newPost) + '</h3>'
    + '<label class="f" for="pdate">' + esc(S.postDate) + '</label><input id="pdate" type="date">'
    + '<label class="f" for="ptitle">' + esc(S.postTitle) + '</label><input id="ptitle">'
    + '<label class="f" for="pbody">' + esc(S.postBody) + '</label><textarea id="pbody" style="min-height:160px"></textarea><p class="hint">' + esc(S.bodyHint) + '</p>'
    + '<label class="f" for="ptitle_en">' + esc(S.postTitleEn) + '</label><input id="ptitle_en">'
    + '<label class="f" for="pbody_en">' + esc(S.postBodyEn) + '</label><textarea id="pbody_en"></textarea>'
    + '<label class="f" for="csearch">' + esc(S.postCards) + '</label><input id="csearch" placeholder="' + esc(S.searchCard) + '" style="margin-bottom:8px">'
    + '<div class="grid" id="cgrid">' + DECK[lang].map((c) => '<button data-cid="' + c.id + '" data-name="' + esc((c.name + ' ' + cardById(c.id, lang === 'vi' ? 'en' : 'vi').name).toLowerCase()) + '">' + faceSVG(c) + '</button>').join('') + '</div><div class="mini" id="csel"></div>'
    + '<label class="f">' + esc(S.postTopics) + '</label><div class="chips">' + INTERESTS.map((i) => '<button class="chip" data-topic-id="' + i.id + '">' + esc(i[lang]) + '</button>').join('') + '</div>'
    + '<label class="f" for="pinit">' + esc(S.markInitials) + '</label><input id="pinit" placeholder="C, E, H">'
    + '<label class="f">' + esc(S.markSigns) + '</label><div class="chips">' + S.zodiac.map((z, i) => '<button class="chip" data-sign="' + i + '">' + esc(z) + '</button>').join('') + '</div>'
    + '<label class="f" style="display:flex;gap:8px;align-items:center;margin-top:16px"><input type="checkbox" id="ppin" style="width:auto">' + esc(S.pinPost) + '</label>'
    + '<div class="row" style="margin-top:16px"><button class="btn primary" id="publish">' + esc(S.publish) + '</button><button class="btn" id="preview">' + esc(S.preview) + '</button><button class="btn" id="copyjson">' + esc(S.copyJson) + '</button><button class="btn" id="clear">' + esc(S.newPost) + '</button></div>'
    + '<p id="status" class="hint"></p><div id="pprev"></div></div>'
    + '<div class="card"><h3 style="margin-bottom:6px">' + esc(S.existing) + '</h3><div class="plist" id="plist"><p class="hint">…</p></div></div>';
  const status = (msg, cls) => { const s = $('#status'); s.textContent = msg; s.className = 'hint ' + (cls || ''); };
  const syncSel = () => { $$('#cgrid button').forEach((b) => b.classList.toggle('on', admin.cards.indexOf(b.getAttribute('data-cid')) > -1)); $('#csel').innerHTML = admin.cards.map((c) => miniHTML(c)).join(''); };
  const formPost = () => {
    const v = (id) => $(id).value.trim(), iso = isoDate(new Date());
    const post = { id: admin.editing || (v('#pdate') || iso) + '-' + Math.random().toString(36).slice(2, 6), date: v('#pdate') || iso,
      title: { vi: v('#ptitle'), en: v('#ptitle_en') }, body: { vi: v('#pbody'), en: v('#pbody_en') }, cards: admin.cards.slice(),
      topics: $$('[data-topic-id].on').map((b) => b.getAttribute('data-topic-id')),
      markers: { initials: v('#pinit').split(/[,\s]+/).map((x) => x.trim().toUpperCase()).filter(Boolean), signs: $$('[data-sign].on').map((b) => Number(b.getAttribute('data-sign'))) }, pinned: $('#ppin').checked };
    if (!post.title.en) delete post.title.en; if (!post.body.en) delete post.body.en;
    return post;
  };
  const fillForm = (post) => {
    admin.editing = post ? post.id : null; admin.cards = post ? (post.cards || []).slice() : [];
    $('#pdate').value = post ? post.date : ''; $('#ptitle').value = post ? L2(post.title, 'vi') : ''; $('#ptitle_en').value = post ? L2(post.title, 'en') : '';
    $('#pbody').value = post ? L2(post.body, 'vi') : ''; $('#pbody_en').value = post ? L2(post.body, 'en') : '';
    $('#pinit').value = post && post.markers && post.markers.initials ? post.markers.initials.join(', ') : '';
    const signs = post && post.markers && post.markers.signs ? post.markers.signs : [], topics = post && post.topics ? post.topics : [];
    $$('[data-sign]').forEach((b) => b.classList.toggle('on', signs.indexOf(Number(b.getAttribute('data-sign'))) > -1));
    $$('[data-topic-id]').forEach((b) => b.classList.toggle('on', topics.indexOf(b.getAttribute('data-topic-id')) > -1));
    $('#ppin').checked = !!(post && post.pinned); $('#formhead').textContent = post ? S.edit + ': ' + L2(post.title, 'vi') : S.newPost; syncSel();
  };
  $('#csearch').addEventListener('input', (e) => { const q = e.target.value.trim().toLowerCase(); $$('#cgrid button').forEach((b) => { b.style.display = !q || b.getAttribute('data-name').indexOf(q) > -1 ? '' : 'none'; }); });
  $$('#cgrid button').forEach((b) => b.addEventListener('click', () => { const id = b.getAttribute('data-cid'), i = admin.cards.indexOf(id); if (i > -1) admin.cards.splice(i, 1); else admin.cards.push(id); syncSel(); }));
  $$('[data-sign],[data-topic-id]', p).forEach((b) => b.addEventListener('click', () => b.classList.toggle('on')));
  $('#preview').addEventListener('click', () => { $('#pprev').innerHTML = postHTML(formPost(), true); bindPost($('#pprev')); });
  $('#copyjson').addEventListener('click', () => copyText(JSON.stringify(formPost(), null, 1)).then(() => toast(S.copied)));
  $('#clear').addEventListener('click', () => { fillForm(null); $('#pprev').innerHTML = ''; });
  async function refreshList() {
    const box = $('#plist'); let posts;
    if (ghToken()) { try { posts = ((await ghRead(CONFIG.postsPath)).json || { posts: [] }).posts; } catch (e) { box.innerHTML = '<p class="hint err">' + esc(String(e.message)) + '</p>'; return; } }
    else { if (POSTS == null) await loadPosts(); posts = POSTS; }
    box.innerHTML = posts.length ? posts.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).map((x) =>
      '<div class="it"><div class="tt"><div>' + (x.pinned ? '★ ' : '') + esc(L2(x.title, 'vi') || L2(x.title, 'en')) + '</div><div class="d">' + esc(x.date) + '</div></div><button class="btn sm" data-edit="' + esc(x.id) + '">' + esc(S.edit) + '</button><button class="btn sm" data-del="' + esc(x.id) + '">' + esc(S.del) + '</button></div>').join('') : '<p class="hint">' + esc(S.feedEmpty) + '</p>';
    $$('[data-edit]', box).forEach((b) => b.addEventListener('click', () => { fillForm(posts.filter((x) => x.id === b.getAttribute('data-edit'))[0]); $('#formhead').scrollIntoView({ behavior: 'smooth' }); }));
    $$('[data-del]', box).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(S.confirmDel)) return; if (!ghToken()) { status(S.needToken, 'err'); return; }
      try { const cur = await ghRead(CONFIG.postsPath); await ghWrite(CONFIG.postsPath, { posts: (cur.json.posts || []).filter((x) => x.id !== b.getAttribute('data-del')) }, cur.sha, 'Remove post'); POSTS = null; toast('✓'); refreshList(); }
      catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    }));
  }
  $('#publish').addEventListener('click', async () => {
    if (admin.busy) return;
    if (!ghToken()) { status(S.needToken, 'err'); return; }
    const post = formPost();
    if (!L2(post.title, 'vi') && !L2(post.title, 'en') || !L2(post.body, 'vi') && !L2(post.body, 'en')) { status(S.needBody, 'err'); return; }
    admin.busy = true; $('#publish').textContent = S.publishing; status('');
    try {
      const cur = await ghRead(CONFIG.postsPath), rest = ((cur.json || {}).posts || []).filter((x) => x.id !== post.id);
      await ghWrite(CONFIG.postsPath, { posts: [post].concat(rest) }, cur.sha, (admin.editing ? 'Update post: ' : 'New post: ') + (L2(post.title, 'vi') || L2(post.title, 'en')));
      status(S.published, 'ok'); POSTS = null; fillForm(null); refreshList();
    } catch (e) { status(S.publishFail + ': ' + e.message, 'err'); }
    admin.busy = false; $('#publish').textContent = S.publish;
  });
  fillForm(null); refreshList();
}

/* ---- availability ---- */
const HOURS = []; for (let h = 7; h <= 23; h++) HOURS.push(pad2(h) + ':00');
async function adminSchedule(p) {
  const S = T();
  p.innerHTML = '<p class="hint">…</p>';
  let sha = null, sch;
  if (ghToken()) { try { const r = await ghRead(CONFIG.schedulePath); sha = r.sha; sch = r.json; } catch (e) { p.innerHTML = '<p class="hint err">' + esc(e.message) + '</p>'; return; } }
  sch = sch || (await loadSchedule());
  sch.weekly = sch.weekly || {}; sch.blocked = sch.blocked || []; sch.booked = sch.booked || []; sch.extra = sch.extra || {};
  const dn = lang === 'vi' ? ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'] : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const draw = () => {
    p.innerHTML = '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.weekly) + '</h3><p class="hint" style="margin-bottom:10px">' + esc(S.weeklyHint) + '</p><div class="week">'
      + [1, 2, 3, 4, 5, 6, 0].map((d) => '<div class="wd"><b>' + esc(dn[d]) + '</b><div class="chips">' + HOURS.map((h) => '<button class="chip' + ((sch.weekly[String(d)] || []).indexOf(h) > -1 ? ' on' : '') + '" data-wd="' + d + '" data-h="' + h + '">' + h + '</button>').join('') + '</div></div>').join('') + '</div></div>'
      + '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.blocked) + '</h3><p class="hint">' + esc(S.blockedHint) + '</p><div class="chips" id="blist">' + sch.blocked.sort().map((d) => '<button class="chip on" data-unblock="' + d + '">' + d + ' ✕</button>').join('') + '</div><div class="row" style="margin-top:8px"><input type="date" id="bday" style="flex:1"><button class="btn sm" id="badd">' + esc(S.addDay) + '</button></div></div>'
      + '<div class="card"><h3 style="margin-bottom:4px">' + esc(S.bookedSlots) + '</h3><p class="hint">' + esc(S.bookedHint) + '</p><div class="chips">' + sch.booked.sort().map((k) => '<button class="chip on" data-unbook="' + k + '">' + k.replace('T', ' ') + ' ✕</button>').join('') + '</div><div class="row" style="margin-top:8px"><input type="date" id="kday" style="flex:1"><select id="khour" style="width:auto">' + HOURS.map((h) => '<option>' + h + '</option>').join('') + '</select><button class="btn sm" id="kadd">+</button></div></div>'
      + '<div class="card"><div class="row"><div style="flex:1"><label class="f">' + esc(S.leadDays) + '</label><input type="number" id="lead" min="0" value="' + (sch.leadDays == null ? 1 : sch.leadDays) + '"></div><div style="flex:1"><label class="f">' + esc(S.horizonDays) + '</label><input type="number" id="horizon" min="7" value="' + (sch.horizonDays || 42) + '"></div></div>'
      + '<button class="btn primary block" id="ssave" style="margin-top:14px">' + esc(S.saveSchedule) + '</button><p class="hint" id="sstatus"></p></div>';
    $$('[data-wd]', p).forEach((b) => b.addEventListener('click', () => { const d = b.getAttribute('data-wd'), h = b.getAttribute('data-h'); const arr = sch.weekly[d] = sch.weekly[d] || []; const i = arr.indexOf(h); if (i > -1) arr.splice(i, 1); else arr.push(h); arr.sort(); b.classList.toggle('on'); }));
    $$('[data-unblock]', p).forEach((b) => b.addEventListener('click', () => { sch.blocked = sch.blocked.filter((x) => x !== b.getAttribute('data-unblock')); draw(); }));
    $('#badd').addEventListener('click', () => { const v = $('#bday').value; if (v && sch.blocked.indexOf(v) < 0) sch.blocked.push(v); draw(); });
    $$('[data-unbook]', p).forEach((b) => b.addEventListener('click', () => { sch.booked = sch.booked.filter((x) => x !== b.getAttribute('data-unbook')); draw(); }));
    $('#kadd').addEventListener('click', () => { const v = $('#kday').value; if (!v) return; const k = v + 'T' + $('#khour').value; if (sch.booked.indexOf(k) < 0) sch.booked.push(k); draw(); });
    $('#ssave').addEventListener('click', async () => {
      sch.leadDays = Number($('#lead').value) || 0; sch.horizonDays = Number($('#horizon').value) || 42; sch.slotMinutes = sch.slotMinutes || 60;
      const st = $('#sstatus');
      if (!ghToken()) { st.textContent = S.needToken; st.className = 'hint err'; return; }
      try { await ghWrite(CONFIG.schedulePath, sch, sha, 'Update availability'); const r = await ghRead(CONFIG.schedulePath); sha = r.sha; st.textContent = S.scheduleSaved; st.className = 'hint ok'; SCHEDULE = null; }
      catch (e) { st.textContent = S.publishFail + ': ' + e.message; st.className = 'hint err'; }
    });
  };
  draw();
}

/* ---- bookings + inbox (Firestore) ---- */
function needAdmin(p) {
  const S = T();
  if (!BE.enabled) { p.innerHTML = '<p class="muted">' + esc(S.needFirebase) + '</p>'; return false; }
  if (!BE.isAdmin()) { p.innerHTML = '<p class="muted">' + esc(S.adminLogin) + '</p><a class="btn" href="#/me">' + esc(S.signIn) + '</a>'; return false; }
  return true;
}
function adminBookings(p) {
  const S = T();
  if (!needAdmin(p)) return;
  p.innerHTML = '<p class="hint">' + esc(S.bookingsIntro) + '</p><div id="bklist"></div>';
  admin.unsubs.push(BE.watchAllBookings((list) => {
    $('#bklist').innerHTML = list.length ? list.map((b) => bookingRow(b, true)).join('') : '<p class="empty">' + esc(S.noBookings) + '</p>';
    $$('[data-bk]', p).forEach((b) => b.addEventListener('click', async () => { const bk = list.filter((x) => x.id === b.getAttribute('data-id'))[0]; try { await BE.setBookingStatus(bk, b.getAttribute('data-bk')); toast('✓'); } catch (e) { toast(e.message); } }));
  }));
}
function adminInbox(p) {
  const S = T();
  if (!needAdmin(p)) return;
  p.innerHTML = '<div id="threads"></div>';
  const list = () => {
    adminCleanup();
    admin.unsubs.push(BE.watchThreads((ts) => {
      $('#threads').innerHTML = ts.length ? ts.map((t) => '<button class="topic" data-th="' + t.id + '"><div class="t"><span>' + (t.adminUnread ? '🔴 ' : '') + esc(t.name || t.email || t.id) + '</span></div><div class="hint">' + esc(t.lastText || '') + '</div></button>').join('') : '<p class="empty">' + esc(S.inboxEmpty) + '</p>';
      $$('[data-th]', p).forEach((b) => b.addEventListener('click', () => open(b.getAttribute('data-th'), ts.filter((x) => x.id === b.getAttribute('data-th'))[0])));
    }));
  };
  const open = (uid, t) => {
    adminCleanup();
    p.innerHTML = '<p><a href="#/admin" id="backin">← ' + esc(S.back) + '</a></p><h3 style="margin-bottom:8px">' + esc(t.name || t.email || uid) + ' <span class="faint">' + esc(t.email || '') + '</span></h3><div class="chat" id="achat"></div><div class="chatbar"><textarea id="atext" placeholder="' + esc(S.typeMsg) + '"></textarea><button class="btn primary" id="asend">' + esc(S.reply) + '</button></div>';
    $('#backin').addEventListener('click', (e) => { e.preventDefault(); p.innerHTML = '<div id="threads"></div>'; list(); });
    const chat = $('#achat');
    admin.unsubs.push(BE.watchMessages(uid, (msgs) => { chat.innerHTML = chatHTML(msgs, 'nabu'); chat.scrollTop = chat.scrollHeight; BE.markRead(uid, 'admin'); }));
    $('#asend').addEventListener('click', async () => { const tx = $('#atext').value.trim(); if (!tx) return; $('#atext').value = ''; try { await BE.sendMessage(tx, uid); } catch (e) { toast(e.message); } });
  };
  list();
}
ROUTES.admin = { nav: '', render: renderAdmin };
