/* ============================ brand settings ============================
   Everything client-facing that is specific to Nabu Tarot lives here, so a
   change of handle, link or wording never touches the app code.
   After editing, run  python build.py  and push. */
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
  firebase: null,
  // e.g. firebase: { apiKey: '...', authDomain: 'nabu-tarot.firebaseapp.com', projectId: 'nabu-tarot', appId: '...' },
  adminEmails: [],
  authProviders: ['google', 'facebook', 'email'],

  // Access codes for the paid courses are signed with this. Change it once
  // (any long phrase); codes made before the change stop working.
  courseSecret: 'nabu-moon-2026-lavender-cards',

  timezone: 'Asia/Ho_Chi_Minh',
  tzLabel: { vi: 'giờ Việt Nam', en: 'Vietnam time' },

  // Booking page copy. Short sentences; this is what clients read.
  bookingNote: {
    vi: 'Bạn chọn chủ đề và giờ hẹn, rồi gửi cho Nabu. Nabu xác nhận lại với bạn trước buổi xem.',
    en: 'Choose a topic and a time, then send it to Nabu. Nabu confirms with you before the session.'
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
