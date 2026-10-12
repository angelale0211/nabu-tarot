/// Which addresses the site may open inside the app, and which go to Safari
/// (or Mail, Instagram, the phone). The site itself and the pages its sign-in
/// and Firebase need stay inside; everything else is handed out.
const _insideHosts = {
  'nabutarot.com',
  'www.nabutarot.com',
  'accounts.google.com',
  'appleid.apple.com',
};
const _insideSuffixes = ['.firebaseapp.com', '.googleapis.com'];

bool isExternal(Uri u) {
  if (u.scheme == 'about' || u.scheme == 'data' || u.scheme == 'blob') return false;
  if (u.scheme != 'https' && u.scheme != 'http') return true;
  final h = u.host.toLowerCase();
  if (_insideHosts.contains(h)) return false;
  return !_insideSuffixes.any(h.endsWith);
}
