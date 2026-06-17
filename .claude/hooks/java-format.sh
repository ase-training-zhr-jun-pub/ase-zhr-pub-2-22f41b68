#!/usr/bin/env bash
# PostToolUse hook: formats Java files after each Edit/Write
# using spotless-maven-plugin (palantir-java-format, Java-26-compatible).
set -euo pipefail

FILE=$(jq -r '.tool_input.file_path // empty')
[[ "$FILE" == *.java ]] || exit 0

BACKEND_DIR="${CLAUDE_PROJECT_DIR}/backend"

# Set JAVA_HOME so the Maven Wrapper can find Java (SDKMAN not initialized in hook shells).
export JAVA_HOME="$HOME/.sdkman/candidates/java/current"
export PATH="$JAVA_HOME/bin:$PATH"

cd "$BACKEND_DIR"
./mvnw spotless:apply -DspotlessFiles="$FILE" -q --no-transfer-progress
