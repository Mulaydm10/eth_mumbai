#!/usr/bin/env bash
# Build a signed release APK. Needs TWM_KEY_PROPS = path to a key.properties
# (storeFile, storePassword, keyAlias, keyPassword). Nothing secret is printed or written to the repo.
set -euo pipefail
: "${TWM_KEY_PROPS:?set TWM_KEY_PROPS to the release key.properties}"
prop() { grep "^$1=" "$TWM_KEY_PROPS" | cut -d= -f2-; }
export SAFEMESH_KEYSTORE="$(prop storeFile)" SAFEMESH_KEYSTORE_PASSWORD="$(prop storePassword)" SAFEMESH_KEY_ALIAS="$(prop keyAlias)"
cd "$(dirname "$0")/.."
./gradlew :app:assembleRelease --console=plain "$@"
ls -1 app/build/outputs/apk/release/*.apk
