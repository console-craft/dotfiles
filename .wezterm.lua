local wezterm = require("wezterm")
local config = wezterm.config_builder()
local act = wezterm.action

local function send_herdr_key(sequence, key, mods)
	return wezterm.action_callback(function(window, pane)
		local process = pane:get_foreground_process_name() or ""
		local process_name = process:match("([^/\\]+)$") or process
		if process_name == "herdr" then
			pane:send_text(sequence)
		else
			window:perform_action(act.SendKey({ key = key, mods = mods }), pane)
		end
	end)
end

config.color_scheme = "Gruvbox dark, soft (base16)"
config.font = wezterm.font("JetBrains Mono")
config.font_size = 10
config.window_background_opacity = 1.00
config.window_decorations = "RESIZE"
config.enable_tab_bar = true
config.hide_tab_bar_if_only_one_tab = true
config.window_frame = {
	font_size = 12.0,
}
config.window_padding = { left = 5, right = 5, top = 5, bottom = 0 }
config.colors = { cursor_bg = "#ffffff" }

config.disable_default_key_bindings = true

config.keys = {
	-- Command Palette
	{ mods = "CTRL|ALT|CMD", key = " ", action = act.ActivateCommandPalette },

	-- Copy / Paste
	{ mods = "SUPER", key = "c", action = act.CopyTo("Clipboard") },
	{ mods = "SUPER", key = "v", action = act.PasteFrom("Clipboard") },
	{ mods = "CTRL|SHIFT", key = "c", action = act.CopyTo("ClipboardAndPrimarySelection") },
	{ mods = "CTRL|SHIFT", key = "v", action = act.PasteFrom("Clipboard") },

	-- Needed for sending this keybinds to Neovim, through Herdr
	{ mods = "CTRL", key = "[", action = send_herdr_key("\x1b[91;5u", "[", "CTRL") },
	{ mods = "CTRL", key = "/", action = send_herdr_key("\x1b[47;5u", "/", "CTRL") },
	{ mods = "ALT", key = "[", action = send_herdr_key("\x1b[91;3u", "[", "ALT") },
}

-- Herdr cannot distinguish these modifiers in legacy terminal input. Send explicit Kitty sequences while preserving normal key handling elsewhere.
local herdr_mods = "CTRL|ALT|CMD"
for key in ("hjkl[]"):gmatch(".") do
	table.insert(config.keys, {
		mods = herdr_mods,
		key = key,
		action = send_herdr_key(string.format("\x1b[%d;15u", string.byte(key)), key, herdr_mods),
	})
end

return config
