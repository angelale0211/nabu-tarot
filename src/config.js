/* ============================ brand settings ============================
   Everything client-facing that is specific to Nabu Tarot lives here, so a
   change of handle, link or wording never touches the app code.
   After editing, run  python build.py  and push. */
/* Small purple logo card used as the 'pick a card' icon in tiles and lists (needed before services.js). */
const PICK_ICON = '<svg class="pickico" viewBox="0 0 100 172" aria-hidden="true"><rect x="3" y="3" width="94" height="166" rx="12" fill="#3D2A6E" stroke="#3B2A5E" stroke-width="4"/><rect x="14" y="14" width="72" height="144" rx="7" fill="none" stroke="#E5BE5E" stroke-width="2"/><path d="M58 58 A28 28 0 1 0 58 114 A22 22 0 1 1 58 58 Z" fill="#E5BE5E"/><circle cx="30" cy="36" r="4" fill="#E5BE5E"/><circle cx="32" cy="138" r="4" fill="#E5BE5E"/><circle cx="72" cy="132" r="4" fill="#E5BE5E"/></svg>';

/* Draw icon for 'Rút bài': a cream card lifted at an angle with a gold sparkle. */
const DRAW_ICON = '<svg class="pickico" viewBox="0 0 100 172" aria-hidden="true"><g transform="rotate(-8 50 86)"><rect x="8" y="8" width="84" height="156" rx="12" fill="#FBF3F5" stroke="#3B2A5E" stroke-width="4"/><rect x="18" y="18" width="64" height="136" rx="7" fill="none" stroke="#E5BE5E" stroke-width="2"/><path d="M50 52 l8 22 22 8 -22 8 -8 22 -8 -22 -22 -8 22 -8z" fill="#E5BE5E"/><path d="M72 30 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#F6BBCB"/><path d="M28 132 l2.5 5.5 5.5 2.5 -5.5 2.5 -2.5 5.5 -2.5 -5.5 -5.5 -2.5 5.5 -2.5z" fill="#AFC8F0"/></g></svg>';
const CONFIG = {
  brand: 'Nabu Tarot',
  // Social handles. Leave a value empty ('') to hide that button.
  instagram: 'nabutarot',          // https://instagram.com/nabutarot  (DM: https://ig.me/m/nabutarot)
  facebookPage: '',                // the page's username, e.g. 'nabutarot' -> https://m.me/nabutarot
  facebookUrl: 'https://www.facebook.com/search/top?q=Nabu%20Tarot', // replace with the page's real address, e.g. https://www.facebook.com/nabutarot
  zalo: '',                        // phone number or Zalo id -> https://zalo.me/<id>
  email: '',                       // optional: shows a mail button on the booking screen

  // Where the feed and the availability file are published. The composer
  // (#/admin) commits them into this repository with a fine-grained token.
  repo: 'angelale0211/nabu-tarot',
  branch: 'main',
  postsPath: 'posts.json',
  schedulePath: 'schedule.json',

  // Accounts, messages and bookings need a small cloud backend. Paste the
  // Firebase web config here (Project settings -> Your apps -> Config) and
  // list the reader's login emails; see README "Turning on accounts".
  // Until this is filled in, profiles stay on the device, messaging opens
  // Instagram, and booking requests go out as a message.
  firebase: { apiKey: 'AIzaSyBGi9OEnYlMk7SIp0UD7w7PgffSwTgiKR0', authDomain: 'nabutarot.firebaseapp.com', projectId: 'nabutarot', storageBucket: 'nabutarot.firebasestorage.app', messagingSenderId: '609592701892', appId: '1:609592701892:web:55445b2a35cbaa5d1e6a91' },
  adminEmails: ['nabutarot@outlook.com', 'angela_le_@outlook.com', 'angelale_le_@outlook.com'],
  // Photo and voice attachments in chat need Firebase Storage, which new
  // projects can only switch on with the pay-as-you-go plan. Set to true
  // once Build -> Storage exists and storage.rules is published.
  attachments: false,
  // Photos in chat without Storage: shrunk on the phone and kept inside the message itself.
  chatImages: true,
  // Where booking requests are mailed as calendar invitations (an .ics the
  // mail app adds to the calendar). Sent by the worker in worker/ through
  // Resend; set bookingEndpoint to '<worker url>/booking' once deployed.
  adminNotifyEmails: ['nabutarot@outlook.com', 'angela_le_@outlook.com'],
  bookingEndpoint: '',
  // Bug reports from #/report are mailed to the same addresses through the
  // worker: set reportEndpoint to '<worker url>/report' once deployed.
  reportEndpoint: '',
  authProviders: ['google', 'facebook', 'email'],

  // Nabu AI. Leave empty to answer from the built-in knowledge base; set the
  // URL of the deployed worker (see worker/) to answer with Claude.
  aiEndpoint: '',
  // Free option: a Google AI Studio key (aistudio.google.com -> Get API key),
  // restricted to this site's address in Google Cloud console. Gemini then
  // answers straight from the browser and can search the web for facts the
  // app does not have. Leave empty to skip.
  geminiKey: '',
  geminiModel: 'gemini-3.5-flash-lite',
  // Free option: a Google AI Studio key (aistudio.google.com -> Get API key),
  // restricted to this site's address in Google Cloud console. Gemini then
  // answers straight from the browser and can search the web for facts the
  // app does not have. Leave empty to skip.
  geminiKey: '',
  geminiModel: 'gemini-3.5-flash-lite',

  // Access codes for the paid courses are signed with this. Change it once
  // (any long phrase); codes made before the change stop working.
  courseSecret: 'nabu-moon-2026-lavender-cards',

  timezone: 'Asia/Ho_Chi_Minh',
  tzLabel: { vi: 'giờ Việt Nam', en: 'Vietnam time' },

  // Booking page copy. Short sentences; this is what clients read.
  bookingNote: {
    vi: 'Bốn bước: chọn gói, chọn chủ đề (nếu gói cần), chọn giờ, bấm gửi. Nabu xác nhận lại trong ngày, và bạn theo dõi ở mục Hồ sơ.',
    en: 'Four steps: pick a package, pick a topic (if the package needs one), pick a time, tap send. Nabu confirms within the day, and you follow it under Profile.'
  },
  tagline: { vi: 'Lắng nghe và thấu hiểu', en: 'Listening and understanding' },
  about: {
    vi: 'Nabu Tarot xem bài về tình cảm, người cũ, crush, công việc và học tập. Mỗi chủ đề là một trải bài 5 lá với 5 câu hỏi rõ ràng.',
    en: 'Nabu Tarot reads on relationships, exes, crushes, career and study. Each topic is a five-card spread with five clear questions.'
  }
};

/* Interests a visitor can pick in their profile. Ids are stable; posts and
   guides carry the same ids so the home screen can match them. */
const INTERESTS = [
  { id: 'love', vi: 'Tình cảm', en: 'Love' },
  { id: 'ex', vi: 'Người cũ', en: 'An ex' },
  { id: 'crush', vi: 'Crush / mập mờ', en: 'Crush' },
  { id: 'work', vi: 'Công việc', en: 'Career' },
  { id: 'study', vi: 'Học tập', en: 'Study' },
  { id: 'money', vi: 'Tiền bạc', en: 'Money' },
  { id: 'astro', vi: 'Chiêm tinh', en: 'Astrology' },
  { id: 'tarot', vi: 'Học tarot', en: 'Learn tarot' },
  { id: 'lenormand', vi: 'Lenormand', en: 'Lenormand' },
  { id: 'manifest', vi: 'Manifestation', en: 'Manifestation' },
  { id: 'fortune', vi: 'Bói toán', en: 'Fortune telling' }
];
