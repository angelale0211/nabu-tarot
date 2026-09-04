/* ============================ brand settings ============================
   Everything client-facing that is specific to Nabu Tarot lives here, so a
   change of handle, link or wording never touches the app code.
   After editing, run  python build.py  and push. */
const CONFIG = {
  brand: 'Nabu Tarot',
  // Social handles. Leave a value empty ('') to hide that button.
  instagram: 'nabutarot',          // https://instagram.com/nabutarot  (DM: https://ig.me/m/nabutarot)
  facebookPage: '',                // the page's username, e.g. 'nabutarot' -> https://m.me/nabutarot
  zalo: '',                        // phone number or Zalo id -> https://zalo.me/<id>
  email: '',                       // optional: shows a mail button on the booking screen

  // Where the feed is published. The composer (#/admin) commits posts.json
  // into this repository with a fine-grained GitHub token.
  repo: 'angelale0211/nabu-tarot',
  branch: 'main',
  postsPath: 'posts.json',

  // Booking page copy. Short sentences; this is what clients read.
  bookingNote: {
    vi: 'Bạn chọn chủ đề, gửi tin nhắn cho Nabu. Nabu sẽ trả lời và hẹn giờ xem bài với bạn.',
    en: 'Choose a topic and send Nabu a message. Nabu replies and sets a time for your reading.'
  },
  about: {
    vi: 'Nabu Tarot xem bài về tình cảm, người cũ, crush, công việc và học tập. Mỗi chủ đề là một trải bài 5 lá với 5 câu hỏi rõ ràng.',
    en: 'Nabu Tarot reads on relationships, exes, crushes, career and study. Each topic is a five-card spread with five clear questions.'
  }
};
