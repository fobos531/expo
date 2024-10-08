#!/bin/bash

export NODE_ENV=production
export EXPO_USE_FAST_RESOLVER=1
export EXPO_NO_TELEMETRY=1

# Generate temporary app.json for `npx expo export:embed` and indicate that we want to use JSC bundling profile.
# The reason to use JSC because the bundle should be compatible with both JSC and Hermes.
cat > app.json <<EOF
{
  "expo": {
    "jsEngine": "jsc"
  }
}
EOF

# Setup arguments
if [[ ${NODE_ENV} = "production" ]]; then
  DEV_ARG="--dev false"
  RESET_CACHE_ARG="--reset-cache"
else
  DEV_ARG="--dev true"
  RESET_CACHE_ARG=""
fi

# iOS

EXPO_BUNDLE_APP=1 npx expo export:embed \
    --platform ios \
    --entry-file $(node --print "require('@expo/config/paths').resolveRelativeEntryPoint(process.cwd(), { platform: 'ios', pkg: { main: 'app/index.ts' } })") \
    --bundle-output assets/EXDevMenuApp.ios.js \
    --assets-dest ios \
    $DEV_ARG \
    $RESET_CACHE_ARG

# Android

EXPO_BUNDLE_APP=1 npx expo export:embed \
    --platform android \
    --entry-file $(node --print "require('@expo/config/paths').resolveRelativeEntryPoint(process.cwd(), { platform: 'android', pkg: { main: 'app/index.ts' } })") \
    --bundle-output assets/EXDevMenuApp.android.js \
    --assets-dest android/src/main/res \
    $DEV_ARG \
    $RESET_CACHE_ARG

# Cleanup

rm app.json
