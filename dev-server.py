#!/usr/bin/env python3
"""Local dev server with clean URL rewrites matching vercel.json."""

import re
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = 8080

REWRITES = (
    (re.compile(r"^/work/([^/.]+)/?$"), r"/projects/\1.html"),
    (re.compile(r"^/journal/([^/.]+)/?$"), r"/articles/\1.html"),
    (re.compile(r"^/services/([^/.]+)/?$"), r"/services/\1.html"),
    (re.compile(r"^/privacy/?$"), r"/legal/privacy.html"),
    (re.compile(r"^/terms/?$"), r"/legal/terms.html"),
    (re.compile(r"^/modern-slavery/?$"), r"/legal/modern-slavery.html"),
    (re.compile(r"^/favicon\.ico$"), r"/favicon.png"),
)


class DevHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path, _, query = self.path.partition("?")
        for pattern, replacement in REWRITES:
            if pattern.match(path):
                path = pattern.sub(replacement, path)
                break
        self.path = path + ("?" + query if query else "")
        return super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("", PORT), DevHandler)
    print(f"Serving at http://localhost:{PORT} (clean URLs enabled)")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
