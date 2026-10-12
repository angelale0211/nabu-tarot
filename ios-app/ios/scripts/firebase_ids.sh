#!/bin/sh
# Copies Google's iOS client id out of GoogleService-Info.plist (written from a
# Codemagic secret) into Info.plist: GIDClientID for google_sign_in, and the
# reversed id as a URL scheme so Google's sheet can come back to the app.
set -e
cd "$(dirname "$0")/../Runner"
[ -f GoogleService-Info.plist ] || { echo "no GoogleService-Info.plist: Google sign-in stays off"; exit 0; }
PB=/usr/libexec/PlistBuddy
CID=$($PB -c "Print :CLIENT_ID" GoogleService-Info.plist)
RID=$($PB -c "Print :REVERSED_CLIENT_ID" GoogleService-Info.plist)
$PB -c "Delete :GIDClientID" Info.plist 2>/dev/null || true
$PB -c "Add :GIDClientID string $CID" Info.plist
# Item 0 is the app's own nabutarot:// scheme (Info.plist); Google's goes after it.
$PB -c "Delete :CFBundleURLTypes:1" Info.plist 2>/dev/null || true
$PB -c "Add :CFBundleURLTypes:1 dict" Info.plist
$PB -c "Add :CFBundleURLTypes:1:CFBundleURLSchemes array" Info.plist
$PB -c "Add :CFBundleURLTypes:1:CFBundleURLSchemes:0 string $RID" Info.plist
echo "Google client id set"
