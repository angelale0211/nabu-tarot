#!/bin/bash
# Links to nabutarot.com open in the iPhone app (Associated Domains), added so
# that it can never break a build:
#   associated_domains.sh enable   before the profiles are fetched: turns the
#                                  capability on for the App ID (a changed App
#                                  ID makes Apple issue a fresh profile).
#   associated_domains.sh apply    after: only if the installed profile really
#                                  carries the capability, the entitlement goes
#                                  into Runner.entitlements; otherwise the app
#                                  is built exactly as before.
# The site's half is nabutarot.com/.well-known/apple-app-site-association.
set +e
MODE="$1"
ENT="ios/Runner/Runner.entitlements"
KEY="com.apple.developer.associated-domains"

if [ "$MODE" = "enable" ]; then
  ID=$(app-store-connect bundle-ids list --bundle-id-identifier "$BUNDLE_ID" --strict-match-identifier --json 2>/dev/null \
    | python3 -c 'import json,sys
try:
    d = json.load(sys.stdin); print(d[0]["id"] if d else "")
except Exception:
    print("")')
  if [ -z "$ID" ]; then echo "associated domains: bundle id not found, skipped"; exit 0; fi
  app-store-connect bundle-ids enable-capabilities "$ID" --capability ASSOCIATED_DOMAINS \
    && echo "associated domains: capability on" || echo "associated domains: could not turn it on, skipped"
  exit 0
fi

if [ "$MODE" = "apply" ]; then
  found=""
  for f in "$HOME/Library/MobileDevice/Provisioning Profiles/"*.mobileprovision; do
    [ -f "$f" ] || continue
    plist=$(security cms -D -i "$f" 2>/dev/null)
    echo "$plist" | grep -q "\.$BUNDLE_ID</string>" || continue
    echo "$plist" | grep -q "$KEY" && found="$f"
  done
  if [ -z "$found" ]; then echo "associated domains: profile without the capability, app built without links"; exit 0; fi
  /usr/libexec/PlistBuddy -c "Delete :$KEY" "$ENT" >/dev/null 2>&1
  /usr/libexec/PlistBuddy -c "Add :$KEY array" "$ENT"
  /usr/libexec/PlistBuddy -c "Add :$KEY:0 string applinks:nabutarot.com" "$ENT"
  /usr/libexec/PlistBuddy -c "Add :$KEY:1 string applinks:www.nabutarot.com" "$ENT"
  echo "associated domains: entitlement added"
  exit 0
fi
echo "usage: associated_domains.sh enable|apply"
exit 0
