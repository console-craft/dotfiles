#############################################
# !!! SAMPLE - NEVER SYMLINK THIS FILE !!!  #
#############################################

# Manually install and edit the secrets file:

# install -d -m 700 "$HOME/.config/private"
# touch "$HOME/.config/private/shell-secrets.zsh"
# chmod 600 "$HOME/.config/private/shell-secrets.zsh"
# "$EDITOR" "$HOME/.config/private/shell-secrets.zsh"

#############################################
# AI                                        #
#############################################

export OPENAI_API_KEY=
export ANTRHROPIC_API_KEY=

#############################################
# NVIM SONARLINT & SONARQUBE MCP            #
#############################################

export SONAR_PERSONAL_TOKEN=
export SONAR_PERSONAL_URL=
export SONAR_PERSONAL_ORGANIZATION=
export SONAR_PERSONAL_REGION=
export SONAR_PERSONAL_REPOSITORY=
export SONAR_PERSONAL_FRONTEND_PATH=
export SONAR_PERSONAL_FRONTEND_PROJECT_KEY=
# export SONAR_PERSONAL_FRONTEND_MODE=local # Forces local mode. If unset, the default is "auto" mode (use Sonar Connected mode if a connection can be established, otherwise fallback to local mode).
export SONAR_PERSONAL_BACKEND_PATH=
export SONAR_PERSONAL_BACKEND_PROJECT_KEY=
# export SONAR_PERSONAL_BACKEND_MODE=local # Forces local mode. If unset, the default is "auto" mode (use Sonar Connected mode if a connection can be established, otherwise fallback to local mode).

export SONAR_WORK_TOKEN=
export SONAR_WORK_URL=
export SONAR_WORK_REPOSITORY=
export SONAR_WORK_FRONTEND_PATH=
export SONAR_WORK_FRONTEND_PROJECT_KEY=
# export SONAR_WORK_FRONTEND_MODE=local # Forces local mode. If unset, the default is "auto" mode (use Sonar Connected mode if a connection can be established, otherwise fallback to local mode).
export SONAR_WORK_BACKEND_PATH=
export SONAR_WORK_BACKEND_PROJECT_KEY=
# export SONAR_WORK_BACKEND_MODE=local # Forces local mode. If unset, the default is "auto" mode (use Sonar Connected mode if a connection can be established, otherwise fallback to local mode).

export SONARQUBE_URL="${SONAR_WORK_URL:?SONAR_WORK_URL is not set}"
export SONARQUBE_TOKEN="${SONAR_WORK_TOKEN:?SONAR_WORK_TOKEN is not set}"
