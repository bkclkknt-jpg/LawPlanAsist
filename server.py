from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
import os
ROOT = Path(__file__).resolve().parent
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", "/index.html"):
            body = (ROOT / "index.html").read_bytes()
            self.send_response(200)
            self.send_header("Content-Type","text/html; charset=utf-8")
            self.send_header("Content-Length",str(len(body)))
            self.send_header("X-Content-Type-Options","nosniff")
            self.send_header("Cache-Control","no-cache")
            self.end_headers()
            self.wfile.write(body)
        elif self.path == "/health":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"ok")
        else:
            self.send_error(404)
if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", int(os.environ.get("PORT","10000"))),Handler).serve_forever()
