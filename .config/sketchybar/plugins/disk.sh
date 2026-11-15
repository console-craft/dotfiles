#!/bin/sh

# Query the writable Data volume; the sealed root volume has separate usage.
DISK=$(/bin/df -k /System/Volumes/Data | /usr/bin/awk '
  NR == 2 && $4 ~ /^[0-9]+$/ { printf "%.0fG free", $4 / 1048576 }
')

[ -n "$DISK" ] && sketchybar --set "$NAME" label="$DISK"
