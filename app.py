# -*- coding: utf-8 -*-
"""
@Author:Truman.P.Du
@Date:2024-11-20
@Description:
"""

from flask import Flask, render_template_string, request, send_file
from flask_cors import CORS

from remove_bg import remove_bg

app = Flask(__name__, static_folder='static', static_url_path="/")
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 限制为50MB

CORS(app)


# 路由：返回单页应用的首页
@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "No file part"
    file = request.files['file']
    if file.filename == '':
        return "No selected file"
    if file:
        img_io = remove_bg(file)
        return send_file(img_io, mimetype='image/png')


# 启动 Flask 服务
if __name__ == '__main__':
    app.run(debug=False,port=8080)
