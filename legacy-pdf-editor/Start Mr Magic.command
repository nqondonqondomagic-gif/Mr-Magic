#!/bin/bash
# Starts Mr Magic on this Mac with a tiny local web server, then opens your browser.
# Nothing is uploaded anywhere: the server binds to 127.0.0.1 only, and all document
# processing happens inside the browser page.
#
# Why a server at all? Double-clicking index.html works too, but browsers refuse to let a
# file:// page fetch local files — which is how the OCR engine loads its offline language
# model. Launching this script gives you fully offline OCR; the double-click route needs
# an internet connection the first time OCR runs.

cd "$(dirname "$0")" || exit 1

PY="$(command -v python3 || command -v python || echo /usr/bin/python3)"
if [ ! -x "$PY" ] && ! command -v "$PY" >/dev/null 2>&1; then
  echo "Could not find python3. Open index.html directly instead (OCR will use the online model)."
  exit 1
fi

PORT="$("$PY" - <<'EOF' 2>/dev/null
import socket
s = socket.socket()
s.bind(("127.0.0.1", 0))
print(s.getsockname()[1])
EOF
)"
[ -z "$PORT" ] && PORT=8642

URL="http://127.0.0.1:$PORT/index.html"
echo "  Mr Magic  →  $URL"
echo "  Leave this window open while you work. Press Ctrl-C (or close it) when you are done."

( sleep 1.2; open "$URL" ) >/dev/null 2>&1 &

exec "$PY" -m http.server "$PORT" --bind 127.0.0.1
