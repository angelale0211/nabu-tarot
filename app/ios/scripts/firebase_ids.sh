#!/bin/sh
# Copies Google's iOS client id out of GoogleService-Info.plist (written from a
# Codemagic secret) into Info.plist: GIDClientID for google_sign_in, and the
# reversed id as a URL scheme so Google's sheet can come back to the app.
set -e
cd "$(dirname "$0")/../Runner"
[ -f GoogleService-Info.plist ] || { echo "no GoogleService-Info.plist: Google sign-in and notifications stay off"; echo "{}" > ../../firebase_defines.json; exit 0; }
PB=/usr/libexec/PlistBuddy
CID=$($PB -c "Print :CLIENT_ID" GoogleService-Info.plist 2>/dev/null || true)
RID=$($PB -c "Print :REVERSED_CLIENT_ID" GoogleService-Info.plist 2>/dev/null || true)
if [ -n "$CID" ] && [ -n "$RID" ]; then
$PB -c "Delete :GIDClientID" Info.plist 2>/dev/null || true
$PB -c "Add :GIDClientID string $CID" Info.plist
# Item 0 is the app's own nabutarot:// scheme (Info.plist); Google's goes after it.
$PB -c "Delete :CFBundleURLTypes:1" Info.plist 2>/dev/null || true
$PB -c "Add :CFBundleURLTypes:1 dict" Info.plist
$PB -c "Add :CFBundleURLTypes:1:CFBundleURLSchemes array" Info.plist
$PB -c "Add :CFBundleURLTypes:1:CFBundleURLSchemes:0 string $RID" Info.plist
else
echo "no Google client id in GoogleService-Info.plist: Google sign-in stays off"
fi
# Firebase for notifications, as build-time defines (lib/push/firebase_config.dart).
cat > ../../firebase_defines.json <<JSON
{"FB_API_KEY":"$($PB -c "Print :API_KEY" GoogleService-Info.plist)","FB_APP_ID":"$($PB -c "Print :GOOGLE_APP_ID" GoogleService-Info.plist)","FB_SENDER_ID":"$($PB -c "Print :GCM_SENDER_ID" GoogleService-Info.plist)","FB_PROJECT_ID":"$($PB -c "Print :PROJECT_ID" GoogleService-Info.plist)"}
JSON
echo "Google client id and Firebase settings set"
