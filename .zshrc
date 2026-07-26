# On Apple Silicon macOS, Homebrew initialization belongs in ~/.zprofile:
# eval "$(/opt/homebrew/bin/brew shellenv zsh)"

# Keep PATH entries unique, preserving the leftmost occurrence.
typeset -U PATH path

#############################################
# PATH and tool managers                    #
#############################################

# Personal scripts and user-installed CLI tools.
[[ -d "$HOME/.local/bin" ]] &&
  path=("$HOME/.local/bin" $path)

# Rust / Cargo
cargo_bin="${CARGO_HOME:-$HOME/.cargo}/bin"
[[ -d "$cargo_bin" ]] &&
  path=("$cargo_bin" $path)
unset cargo_bin

# Bun
export BUN_INSTALL="${BUN_INSTALL:-$HOME/.bun}"
[[ -d "$BUN_INSTALL/bin" ]] &&
  path=("$BUN_INSTALL/bin" $path)

# OpenCode
[[ -d "$HOME/.opencode/bin" ]] &&
  path=("$HOME/.opencode/bin" $path)

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

# NVM
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
[[ -s "$NVM_DIR/nvm.sh" ]] &&
  source "$NVM_DIR/nvm.sh"

#############################################
# Oh My Zsh                                 #
#############################################

export ZSH="$HOME/.oh-my-zsh"

# Starship provides the prompt, so do not load an Oh My Zsh theme.
ZSH_THEME=""

plugins=(
  git
  zsh-autosuggestions
  zsh-syntax-highlighting
)

source "$ZSH/oh-my-zsh.sh"

# Completions that are safest to load after Oh My Zsh initializes completion.
[[ -r "$NVM_DIR/bash_completion" ]] &&
  source "$NVM_DIR/bash_completion"

[[ -r "$BUN_INSTALL/_bun" ]] &&
  source "$BUN_INSTALL/_bun"

#############################################
# Editor                                    #
#############################################

export EDITOR='nvim'
export VISUAL='nvim'

# alias nvimc='NVIM_APPNAME=nvim-neocraft nvim'

#############################################
# Aliases                                   #
#############################################

# The Linux virtual console generally cannot render Nerd Font icons.
if [[ $TERM == linux ]]; then
  alias ls='eza -g --icons=never'
  alias tree='eza --tree --icons=never'
else
  alias ls='eza -g --icons=always'
  alias tree='eza --tree --icons=always'
fi

# Git aliases such as `gd` and `gds` come from the Oh My Zsh git plugin.
alias cat='bat --italic-text=always --theme=gruvbox-material --paging=never --decorations=never'
alias less='bat --italic-text=always --theme=gruvbox-material --paging=always --decorations=always'
alias -g -- --help='--help 2>&1 | bat --language=help --style=plain --color=always'

alias oc='opencode'
alias sol='ttysolitaire --no-background-color'
alias python='python3'

# Intentionally no `pip` alias. Prefer `uv add`, `uv run`, `uvx`, and
# `uv tool install`. Use `python -m pip` when pip is specifically required.

#############################################
# FZF                                       #
#############################################

export FZF_DEFAULT_COMMAND='fd --hidden --follow --type f --type l .'
export FZF_DEFAULT_OPTS='--height 66% --border'
export FZF_CTRL_T_OPTS="--preview 'bat --style=numbers --color=always --line-range :500 {}'"

if command -v fzf >/dev/null 2>&1; then
  source <(fzf --zsh)
fi

# Fuzzy-find one or more files under the current directory, copy their paths
# to the clipboard, and print them to the terminal.
# Tab toggles selections, Enter accepts, and Esc cancels.
ff() {
  local selected

  selected=$(
    fzf --multi \
      --preview 'bat --style=numbers --color=always --line-range :500 {}'
  ) || return

  print -r -- "$selected"

  if command -v pbcopy >/dev/null 2>&1; then
    print -rn -- "$selected" | pbcopy
  elif command -v wl-copy >/dev/null 2>&1; then
    print -rn -- "$selected" | wl-copy
  elif command -v xclip >/dev/null 2>&1; then
    print -rn -- "$selected" | xclip -selection clipboard
  elif command -v clip.exe >/dev/null 2>&1; then
    print -rn -- "$selected" | clip.exe
  fi
}

#############################################
# Man pages                                 #
#############################################

export MANPAGER='less -s -M +Gg'

export LESS_TERMCAP_mb=$'\e[1;31m'     # begin blink
export LESS_TERMCAP_md=$'\e[1;34m'     # begin bold
export LESS_TERMCAP_so=$'\e[01;43;30m' # begin standout mode
export LESS_TERMCAP_us=$'\e[01;32m'    # begin underline
export LESS_TERMCAP_me=$'\e[0m'        # reset blink/bold
export LESS_TERMCAP_se=$'\e[0m'        # reset standout mode
export LESS_TERMCAP_ue=$'\e[0m'        # reset underline

export GROFF_NO_SGR=1

#############################################
# Shell integrations                        #
#############################################

if command -v zoxide >/dev/null 2>&1; then
  eval "$(zoxide init zsh --cmd cd)"
fi

# Access the original cd command when zoxide replaces `cd`.
cdir() {
  builtin cd "$@"
}

if command -v wt >/dev/null 2>&1; then
  eval "$(wt config shell init zsh)"
fi

# Prompt initialization should remain near the end.
if command -v starship >/dev/null 2>&1; then
  eval "$(starship init zsh)"
fi
