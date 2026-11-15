#!/bin/sh

# The second sample measures the last second, rather than time since boot.
CPU=$(/usr/bin/top -l 2 -s 1 -n 0 | /usr/bin/awk '
  /^CPU usage:/ { idle = $7; sub(/%/, "", idle); usage = 100 - idle; found = 1 }
  END { if (found) printf "%.0f%%", usage }
')

[ -n "$CPU" ] && sketchybar --set "$NAME" label="$CPU"
