#!/usr/bin/env bash
# PostToolUse-Hook: formatiert Java-Dateien nach jedem Edit/Write
# mit spotless-maven-plugin (palantir-java-format, Java-26-kompatibel).
set -euo pipefail

FILE=$(jq -r '.tool_input.file_path // empty')
[[ "$FILE" == *.java ]] || exit 0

BACKEND_DIR="${CLAUDE_PROJECT_DIR}/backend"

# JAVA_HOME setzen, damit der Maven Wrapper Java findet (SDKMAN nicht initialisiert).
export JAVA_HOME="$HOME/.sdkman/candidates/java/current"
export PATH="$JAVA_HOME/bin:$PATH"

cd "$BACKEND_DIR"
./mvnw spotless:apply -DspotlessFiles="$FILE" -q --no-transfer-progress
