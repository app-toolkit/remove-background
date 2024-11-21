# -*- coding: utf-8 -*-
"""
@Author:Truman.P.Du
@Date:2024-11-21
@Description:
"""
import base64
import io
import time

import numpy as np
import onnxruntime as ort
from PIL import Image

image_size = (1024, 1024)


def transform_image(image):
    # Resize image
    image = image.resize(image_size)

    # Convert image to NumPy array and normalize to [0, 1]
    image_array = np.asarray(image, dtype=np.float32) / 255.0

    # Normalize with given mean and std
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    normalized_image = (image_array - mean) / std

    # Rearrange dimensions to match tensor format (C, H, W)
    transformed_image = np.transpose(normalized_image, (2, 0, 1))

    return np.expand_dims(transformed_image, axis=0)


# 将Pillow的Image对象转换为Base64编码
def pillow_image_to_base64(image):
    buffer = io.BytesIO()  # 创建字节流对象
    image.save(buffer, format="PNG")  # 将图像保存到字节流中，指定格式（如PNG、JPEG等）
    buffer.seek(0)  # 重置指针到字节流的起始位置
    base64_encoded = base64.b64encode(buffer.getvalue()).decode("utf-8")  # 获取字节流并进行Base64编码
    return base64_encoded


def remove_bg(inputImage):
    start = time.time()
    image = Image.open(inputImage)
    print(inputImage.filename)
    pixel_values = transform_image(image)
    ort.set_default_logger_severity(4)
    session = ort.InferenceSession('model/model.onnx')
    outputs = session.run(['alphas'], {'pixel_values': pixel_values})

    mask = Image.fromarray((outputs[0].squeeze() * 255).astype(np.uint8))
    image.putalpha(mask.resize(image.size))
    print(f"covert cost {time.time() - start}s")
    buffer = io.BytesIO()  # 创建字节流对象
    image.save(buffer, format="PNG")  # 将图像保存到字节流中，指定格式（如PNG、JPEG等）
    buffer.seek(0)  # 重置指针到字节流的起始位置
    return buffer
