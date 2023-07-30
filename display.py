import json

from http.server import HTTPServer, SimpleHTTPRequestHandler
from glob import glob

host = "0.0.0.0"
port = 8000
answers_files = "answers/answer*.json"
available_files = "availableFiles.json"

file_list = glob(answers_files)

with open(available_files, "w") as f:
    f.write(json.dumps(file_list))

httpd = HTTPServer((host, port), SimpleHTTPRequestHandler)
print(f'listening on http://{host}:{port}/')
httpd.serve_forever()
