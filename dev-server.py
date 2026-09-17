#!/usr/bin/env python3
"""Local static server with Vercel-style clean URLs (no .html required)."""
from __future__ import annotations

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote


ROOT = os.path.dirname(os.path.abspath(__file__))


class CleanURLHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:
        parsed = urlparse(path)
        raw = unquote(parsed.path)

        # Default file mapping
        if raw in ("", "/"):
            candidate = os.path.join(ROOT, "index.html")
            if os.path.isfile(candidate):
                return candidate

        # Strip trailing slash
        clean = raw.rstrip("/")
        rel = clean.lstrip("/")

        # Exact file
        exact = os.path.join(ROOT, rel)
        if os.path.isfile(exact):
            return exact

        # Directory index
        if os.path.isdir(exact):
            index = os.path.join(exact, "index.html")
            if os.path.isfile(index):
                return index

        # Clean URL -> .html
        html = exact + ".html"
        if os.path.isfile(html):
            return html

        return super().translate_path(path)

    def log_message(self, fmt: str, *args) -> None:
        sys_stdout = __import__("sys").stderr
        sys_stdout.write("%s - %s\n" % (self.address_string(), fmt % args))


def main() -> None:
    port = int(os.environ.get("PORT", "8080"))
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", port), CleanURLHandler)
    print(f"LEVEL local server: http://127.0.0.1:{port}")
    print("Clean URLs enabled (e.g. /services/web-design)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")


if __name__ == "__main__":
    main()
