/// Which addresses the site may open inside the app, and which go to Safari
/// (or Mail, Instagram, the phone). Only the site itself loads as a page
/// inside the app: sign-in is native, so no other site needs to, and any
/// other page would sit next to the native bridge.
const _siteHosts = {'nabutarot.com', 'www.nabutarot.com'};

bool isExternal(Uri u) {
  if (u.scheme == 'about' || u.scheme == 'data' || u.scheme == 'blob') return false;
  if (u.scheme != 'https' && u.scheme != 'http') return true;
  return !_siteHosts.contains(u.host.toLowerCase());
}

/// Whether a navigation leaves the app. Frames the site embeds (Firebase's
/// hidden auth frame, a video) load where they are; only a whole page that
/// is not the site goes out.
bool opensOutside(Uri u, {required bool mainFrame}) => mainFrame && isExternal(u);

/// Whether the page asking the native bridge is the site itself.
bool isSiteOrigin(Uri? u) => u != null && u.scheme == 'https' && _siteHosts.contains(u.host.toLowerCase());
