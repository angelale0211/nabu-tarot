"""Writes app/android_defines.json (never committed) from google-services.json,
for the Android build:

    python tool/android_defines.py C:/Users/angel/nabu-tarot-keys/google-services.json
    flutter build appbundle --release --dart-define-from-file=android_defines.json ...

Firebase for notifications (FB_*) and the site's Google web client id, which
Android's Google sign-in needs to hand out an ID token Firebase accepts.
"""
import json
import os
import sys

PACKAGE = 'app.nabutarot.twa'

src = json.load(open(sys.argv[1], encoding='utf-8'))
client = next(c for c in src['client'] if c['client_info']['android_client_info']['package_name'] == PACKAGE)
web = [o['client_id'] for o in client.get('oauth_client', []) if o.get('client_type') == 3]
web += [o['client_id'] for o in client.get('services', {}).get('appinvite_service', {}).get('other_platform_oauth_client', []) if o.get('client_type') == 3]
out = {
    'FB_SENDER_ID': src['project_info']['project_number'],
    'FB_PROJECT_ID': src['project_info']['project_id'],
    'FB_ANDROID_APP_ID': client['client_info']['mobilesdk_app_id'],
    'FB_ANDROID_API_KEY': client['api_key'][0]['current_key'],
    'GOOGLE_WEB_CLIENT_ID': web[0] if web else '',
}
dst = os.path.join(os.path.dirname(__file__), '..', 'android_defines.json')
json.dump(out, open(dst, 'w', encoding='utf-8'))
print('wrote', os.path.abspath(dst), '| web client id', 'found' if out['GOOGLE_WEB_CLIENT_ID'] else 'MISSING')
