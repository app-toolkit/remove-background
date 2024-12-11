# remove-background

## Down model
https://huggingface.co/briaai/RMBG-2.0/blob/main/onnx/model.onnx
下载模型到 model 模型文件中

## Docker Run

1.docker build

```bash
docker build -t trumandu/remove-background .
```

2.docker run

```bash
docker run --rm -it --net=host  trumandu/remove-background
```

访问 http://127.0.0.1:8080