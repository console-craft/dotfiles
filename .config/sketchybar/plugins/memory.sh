#!/bin/sh

TOTAL=$(/usr/sbin/sysctl -n hw.memsize) || exit 1
# App memory (anonymous minus purgeable), wired memory, and compressed
# memory's physical footprint. File caches and swap are not counted as used RAM.
MEMORY=$(/usr/bin/vm_stat | /usr/bin/awk -v total="$TOTAL" '
  /page size of/ { page_size = $8 }
  /^Anonymous pages:/ { anonymous = $3; have_anonymous = 1 }
  /^Pages purgeable:/ { purgeable = $3 }
  /^Pages wired down:/ { wired = $4 }
  /^Pages occupied by compressor:/ { compressed = $5 }
  END {
    if (page_size > 0 && total > 0 && have_anonymous) {
      used = (anonymous - purgeable + wired + compressed) * page_size
      printf "%.0f%%", 100 * used / total
    }
  }
')

[ -n "$MEMORY" ] && sketchybar --set "$NAME" label="$MEMORY"
