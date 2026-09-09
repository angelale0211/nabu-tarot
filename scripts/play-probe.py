"""Read-only: lists the in-app products and subscriptions (with base plans)
Play knows for app.nabutarot.twa, using the worker's service account. Prints
IDs only. Never prints the key. Each section (one-time products,
subscriptions) is attempted independently: a failure in one is reported and
does not stop the other from running. Exit 2 = every section refused with
403 (owner must link the service account, Task 0 step 4). Exit 1 = every
section failed for some other reason. Exit 0 = at least one section
succeeded (even if its result list is empty)."""
import glob, json, sys, time, urllib.request, urllib.parse, base64, urllib.error
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding

KEYS_DIR = r'C:\Users\angel\nabu-tarot-keys'
SERVICE_ACCOUNT_EMAIL = 'nabu-worker@nabutarot.iam.gserviceaccount.com'
PKG = 'app.nabutarot.twa'
API_ROOT = f'https://androidpublisher.googleapis.com/androidpublisher/v3/applications/{PKG}'


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


def api_get(path):
    """Single GET against the androidpublisher API. Returns (data, error):
    on success, error is None; on failure, data is None and error is a dict
    {'code': <int HTTP status, or None>, 'body': <short diagnostic text>}."""
    r = urllib.request.Request(f'{API_ROOT}/{path}', headers={'Authorization': 'Bearer ' + at})
    try:
        return json.load(urllib.request.urlopen(r)), None
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', 'ignore')
        return None, {'code': e.code, 'body': body[:300]}
    except Exception as e:
        return None, {'code': None, 'body': str(e)}


def paginate(base_path, list_keys):
    """GET base_path, following nextPageToken if present, collecting items
    from whichever of list_keys is present in each page. Returns
    (items, error): error is None on success, even when items ends up []."""
    items = []
    sep = '&' if '?' in base_path else '?'
    path = base_path
    while True:
        data, err = api_get(path)
        if err is not None:
            return None, err
        if not isinstance(data, dict):
            data = {}
        for k in list_keys:
            if k in data:
                items.extend(data.get(k) or [])
                break
        token = data.get('nextPageToken')
        if not token:
            break
        path = f'{base_path}{sep}pageToken={urllib.parse.quote(token)}'
    return items, None


def diagnose(section, err):
    code = err.get('code')
    body = err.get('body')
    if code is not None:
        print(f'{section}: FAILED - HTTP {code} {body}')
    else:
        print(f'{section}: FAILED - {body}')


results = {}  # section name -> True (succeeded) / err dict (failed)

# --- one-time products: try the current endpoint, fall back to legacy on 404 ---
print('== one-time products ==')
items, err = paginate('monetization/onetimeproducts', ['onetimeProducts', 'oneTimeProducts'])
endpoint_used = 'monetization/onetimeproducts'
if err is not None and err.get('code') == 404:
    endpoint_used = 'inappproducts (legacy fallback)'
    items, err = paginate('inappproducts', ['inappproduct', 'inappproducts'])
if err is None:
    print(f'  (via {endpoint_used})')
    if items:
        for p in items:
            print(' ', p.get('sku') or p.get('productId'), '|', p.get('status'), '|', p.get('purchaseType'))
    else:
        print('  no one-time products defined')
    results['one-time products'] = True
else:
    diagnose('one-time products', err)
    results['one-time products'] = err

# --- subscriptions ---
print('== subscriptions ==')
items, err = paginate('subscriptions', ['subscriptions'])
if err is None:
    if items:
        for s in items:
            plans = [(b.get('basePlanId'), b.get('state'), (b.get('autoRenewingBasePlanType') or {}).get('billingPeriodDuration'))
                     for b in (s.get('basePlans') or [])]
            print(' ', s.get('productId'), '|', plans)
    else:
        print('  no subscriptions defined')
    results['subscriptions'] = True
else:
    diagnose('subscriptions', err)
    results['subscriptions'] = err

# --- overall exit code ---
if any(v is True for v in results.values()):
    sys.exit(0)
if all(isinstance(v, dict) and v.get('code') == 403 for v in results.values()):
    sys.exit(2)
sys.exit(1)
