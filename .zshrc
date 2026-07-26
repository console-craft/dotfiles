# On Mac this should be in .zprofile:
# eval "$(/opt/homebrew/bin/brew shellenv zsh)"

export ZSH="/Users/ovi/.oh-my-zsh"

# Keep PATH entries unique, preserving the leftmost occurrence.
typeset -U PATH path

ZSH_THEME="robbyrussell"

plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source $ZSH/oh-my-zsh.sh

export EDITOR='nvim'
export VISUAL='nvim'

# alias nvimc='NVIM_APPNAME=nvim-neocraft nvim'

if [[ $TERM == linux ]]; then
  alias ls='eza -g --icons=never'
  alias tree='eza --tree --icons=never'
else
  alias ls='eza -g --icons=always'
  alias tree='eza --tree --icons=always'
fi

# Git related aliases like `gd` (git diff) and `gds` (git diff --staged) are already provided by the zsh git plugin.
alias cat="bat --italic-text=always --theme=gruvbox-material --paging=never --decorations=never"
alias less="bat --italic-text=always --theme=gruvbox-material --paging=always --decorations=always"
alias -g -- --help='--help 2>&1 | bat --language=help --style=plain  --color=always'
alias oc="opencode"
alias sol="ttysolitaire --no-background-color"
alias python=python3
# Intentionally no `pip` alias -> Prefer `uv add`, `uv run`, `uvx`, and `uv tool install` and only use `python -m pip` (instead of just `pip` or `pip3`) when pip is specifically required.

# Fuzzy-find one or more files under the current directory, copy their paths to the clipboard, and print them to the terminal.
# Tab toggles selections, Enter accepts the current item or selected items, and Esc cancels.
ff() {
  local selected

  selected=$(
    fzf --multi --preview \
      'bat --style=numbers --color=always --line-range :500 {}'
  ) || return

  print -r -- "$selected"

  if command -v pbcopy >/dev/null 2>&1; then
    print -rn -- "$selected" | pbcopy
  elif command -v wl-copy >/dev/null 2>&1; then
    print -rn -- "$selected" | wl-copy
  elif command -v xclip >/dev/null 2>&1; then
    print -rn -- "$selected" | xclip -selection clipboard
  fi
}

eval "$(starship init zsh)"        # init starship prompt
eval "$(zoxide init zsh --cmd cd)" # init zoxide and alias `cd` to `z`
cdir() { builtin cd "$@"; }        # use `cdir` as original `cd` command

source <(fzf --zsh)
export FZF_DEFAULT_COMMAND='fd --hidden --follow --type f --type l .'
export FZF_DEFAULT_OPTS='--height 66% --border'
export FZF_CTRL_T_OPTS="--preview 'bat --style=numbers --color=always --line-range :500 {}'"

export MANPAGER="less -s -M +Gg"
export LESS_TERMCAP_mb=$'\e[1;31m'     # begin blink
export LESS_TERMCAP_md=$'\e[1;34m'     # begin bold
export LESS_TERMCAP_so=$'\e[01;43;30m' # begin stand-out mode
export LESS_TERMCAP_us=$'\e[01;32m'    # begin underline
export LESS_TERMCAP_me=$'\e[0m'        # reset blink/bold
export LESS_TERMCAP_se=$'\e[0m'        # reset stand-out mode
export LESS_TERMCAP_ue=$'\e[0m'        # reset underline
export GROFF_NO_SGR=1

# Add common tools to PATH

# Rust / Cargo
cargo_bin="${CARGO_HOME:-$HOME/.cargo}/bin"
[[ -d "$cargo_bin" ]] && path=("$cargo_bin" $path)
unset cargo_bin

# NVM
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh"
[[ -s "$NVM_DIR/bash_completion" ]] && source "$NVM_DIR/bash_completion"

# pnpm
case "$OSTYPE" in
darwin*)
  export PNPM_HOME="$HOME/Library/pnpm"
  ;;
linux*)
  export PNPM_HOME="${XDG_DATA_HOME:-$HOME/.local/share}/pnpm"
  ;;
esac

[[ -n "${PNPM_HOME:-}" && -d "$PNPM_HOME/bin" ]] &&
  path=("$PNPM_HOME/bin" $path)

# Bun
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
[[ -d "$BUN_INSTALL/bin" ]] && path=("$BUN_INSTALL/bin" $path)
[[ -r "$BUN_INSTALL/_bun" ]] && source "$BUN_INSTALL/_bun"

# OpenCode
[[ -d "$HOME/.opencode/bin" ]] &&
  path=("$HOME/.opencode/bin" $path)

# Personal scripts and user-installed CLI tools.
[[ -d "$HOME/.local/bin" ]] && path=("$HOME/.local/bin" $path)

# Shell integrations

# Worktrunk shell integration
if command -v wt >/dev/null 2>&1; then
  eval "$(wt config shell init zsh)"
fi
