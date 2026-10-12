"""Writes the certificate private key from CERTIFICATE_PRIVATE_KEY to a file
for app-store-connect (--certificate-key=@file:...).

The variable may hold the key as base64 on one line (what survives pasting
into Codemagic's form), or as the PEM text - with its line breaks, or with
them lost to spaces. Exits non-zero if what it gets is not a private key.
"""
import base64
import os
import re
import sys

raw = os.environ.get('CERTIFICATE_PRIVATE_KEY', '').strip()
out = sys.argv[1]
if not raw:
    sys.exit('CERTIFICATE_PRIVATE_KEY is empty')
if 'BEGIN' not in raw:
    try:
        raw = base64.b64decode(re.sub(r'\s+', '', raw)).decode('ascii').strip()
    except Exception:
        sys.exit('CERTIFICATE_PRIVATE_KEY is neither a PEM key nor its base64')
m = re.match(r'-----BEGIN ([A-Z ]+)-----(.*)-----END \1-----', raw, re.S)
if not m:
    sys.exit('CERTIFICATE_PRIVATE_KEY does not look like a private key')
kind, body = m.group(1), re.sub(r'\s+', '', m.group(2))
lines = [body[i:i + 64] for i in range(0, len(body), 64)]
open(out, 'w').write('-----BEGIN %s-----\n%s\n-----END %s-----\n' % (kind, '\n'.join(lines), kind))
print('certificate key ok (%s, %d characters)' % (kind, len(body)))
