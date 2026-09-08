"""Read-only: lists the in-app products and subscriptions (with base plans)
Play knows for app.nabutarot.twa, using the worker's service account. Prints
IDs only. Never prints the key. Exit 2 = permission refused (owner must link
the service account, Task 0 step 4)."""
import glob, json, sys, time, urllib.request, urllib.parse, base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

KEYS_DIR = r'C:\Users\angel\nabu-tarot-keys'
SERVICE_ACCOUNT_EMAIL = 'nabu-worker@nabutarot.iam.gserviceaccount.com'
PKG = 'app.nabutarot.twa'


def find_service_account_key(directory):
    """Pick the key file by content (has client_email + private_key for the
    expected service account), not by filename sort order."""
    for path in sorted(glob.glob(f'{directory}\\*.json')):
        try:
            with open(path, encoding='utf-8') as f:
                data = json.load(f)
        except (OSError, json.JSONDecodeError):
            continue
        if (isinstance(data, dict)
                and data.get('client_email') == SERVICE_ACCOUNT_EMAIL
                and 'private_key' in data):
            return path, data
    return None, None


KEY, sa = find_service_account_key(KEYS_DIR)
if sa is None:
    print(f'no service-account key for {SERVICE_ACCOUNT_EMAIL} found in {KEYS_DIR}')
    sys.exit(1)

try:
    b64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b'=').decode()
    now = int(time.time())
    head = b64(json.dumps({'alg': 'RS256', 'typ': 'JWT'}).encode())
    claim = b64(json.dumps({'iss': sa['client_email'], 'scope': 'https://www.googleapis.com/auth/androidpublisher',
                            'aud': 'https://oauth2.googleapis.com/token', 'iat': now, 'exp': now + 3600}).encode())
    key = serialization.load_pem_private_key(sa['private_key'].encode(), None)
    sig = key.sign(f'{head}.{claim}'.encode(), padding.PKCS1v15(), hashes.SHA256())
    tok = urllib.request.urlopen(urllib.request.Request('https://oauth2.googleapis.com/token',
          data=urllib.parse.urlencode({'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          'assertion': f'{head}.{claim}.{b64(sig)}'}).encode())).read()
    at = json.loads(tok)['access_token']
except Exception as e:
    print(f'failed to obtain OAuth token using key {KEY}: {e}')
    sys.exit(1)


def get(path):
    r = urllib.request.Request(f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{PKG}/{path}',
                               headers={'Authorization': 'Bearer ' + at})
    try: return json.load(urllib.request.urlopen(r))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'ignore')
        print('HTTP', e.code, body[:300]); sys.exit(2 if e.code == 403 else 1)
print('== one-time products ==')
for p in get('inappproducts').get('inappproduct', []):
    print(' ', p.get('sku'), '|', p.get('status'), '|', p.get('purchaseType'))
print('== subscriptions ==')
for s in get('subscriptions').get('subscriptions', []):
    plans = [(b.get('basePlanId'), b.get('state'), (b.get('autoRenewingBasePlanType') or {}).get('billingPeriodDuration'))
             for b in s.get('basePlans', [])]
    print(' ', s.get('productId'), '|', plans)
