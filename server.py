from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit
import os

ROOT = Path(__file__).resolve().parent

class Handler(BaseHTTPRequestHandler):
    def do_HEAD(self):
        self.respond(False)

    def do_GET(self):
        self.respond(True)

    def respond(self, send_body):
        path = urlsplit(self.path).path.rstrip("/") or "/"
        if path in ("/", "/index.html", "/settings.css", "/settings.js", "/converter.css", "/converter.js", "/legal-assistant.css", "/legal-assistant.js", "/task-manager.js"):
            file_name = "index.html" if path == "/" else path.lstrip("/")
            data = (ROOT / file_name).read_bytes()
            self.send_response(200)
            content_type = "text/css" if path.endswith(".css") else "application/javascript" if path.endswith(".js") else "text/html"
            self.send_header("Content-Type", content_type + "; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()
            if send_body:
                self.wfile.write(data)
        elif path == "/health":
            data = b"ok"
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            if send_body:
                self.wfile.write(data)
        elif path == "/favicon.ico":
            self.send_response(204)
            self.end_headers()
        else:
            self.send_error(404)

if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", int(os.environ.get("PORT", "10000"))), Handler).serve_forever()
