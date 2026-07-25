#!/usr/bin/env bash

if pgrep -x wezterm-gui >/dev/null; then
  /Applications/WezTerm.app/Contents/MacOS/wezterm cli spawn --new-window
else
  open -a WezTerm
fi
