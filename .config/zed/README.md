# Zed configuration

Settings and the Gruvcraft Dark Soft theme, which combines Zed's Gruvbox Dark
Soft interface with the muted syntax palette from Neocraft's `gruvcraft-dark`.

## Use

Keep `~/.config/zed` as a real, machine-local directory. Only portable settings
and themes link into this repository. To install on macOS/Linux, back up any
existing `settings.json` and `themes` entries before creating these links:

```sh
mkdir -p ~/.config/zed
ln -s ~/Projects/console-craft/dotfiles/.config/zed/settings.json ~/.config/zed/settings.json
ln -s ~/Projects/console-craft/dotfiles/.config/zed/themes ~/.config/zed/themes
```

The copied settings preserve system mode, Gruvbox Light, and Gruvcraft Dark Soft.
Use `theme selector: toggle` to try another theme.

The `prompts/` database stays in the local Zed directory, outside this repository.
It contains saved prompts/customizations, so preserve it rather than treating it
as disposable cache. Quit Zed before moving or restoring its database.

No custom `keymap.json` exists yet. If added, link it individually too. A shared
keymap can use `secondary-` (Command on macOS, Ctrl on Windows/Linux) and OS
contexts for exceptions; separate platform keymaps are not required.

On Windows, create the equivalent links under `%APPDATA%\Zed`, pointing to the
local clone of this repository. Symbolic links may require Developer Mode or
elevation. Leave state local and install the configured font/tools separately.

## Sources and mapping

- UI: [Zed v1.26.2 Gruvbox Dark Soft](https://github.com/zed-industries/zed/blob/v1.26.2/assets/themes/gruvbox/gruvbox.json).
  Backgrounds, panels, tabs, terminal, diagnostics, selections, and diff colors
  remain unchanged. Only syntax and the editor's default text color differ.
- Syntax: `nvim-neocraft/lua/neocraft/theme/gruvcraft/{palette,syntax}.lua`.
  Gold variables and brackets, sage strings, salmon numbers and booleans,
  pale-sage bold functions, cream types, muted comments, and brown delimiters.

This is a theme-only adaptation, not a language-query port. Zed's language queries
decide which categories are available: declarations and calls often share
`function`, and `return` often shares `keyword`. Their distinct Neovim styling
cannot be reproduced where Zed does not expose separate categories. Built-in
types, constants, functions, and tag details get separate styles when exposed.
