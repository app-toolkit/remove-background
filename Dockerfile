FROM registry.cn-shanghai.aliyuncs.com/truman-open/linux_arm64_python:3.8-slim

WORKDIR /app

COPY ./ /app
# 安装依赖，使用无缓存模式
RUN pip install --no-cache-dir -r requirements.txt

# 暴露 Flask 的默认端口
EXPOSE 8080

CMD ["python", "app.py"]
