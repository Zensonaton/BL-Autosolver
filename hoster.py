# coding: utf-8

# Используется что бы хостить файл main.js, без необходимости копирования и вставки.

from flask import Flask
app = Flask(__name__)

@app.route("/file.js")
def file_hoster():
	file_contents = open("out/main.js", "r").read()

	return file_contents

if __name__ == "__main__":
	app.run()
