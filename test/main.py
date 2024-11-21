# -*- coding: utf-8 -*-
"""
@Author:Truman.P.Du
@Date:2024-11-20
@Description:
"""
import time
from datetime import datetime
from pathlib import Path

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


start = time.time()
image = Image.open('test/ryan-gosling.jpg')
file_path = Path(image.filename)
current_time = datetime.now()

file_name_new = file_path.stem + "_" + str(int(current_time.timestamp()))  # 纯文件名
file_extension = file_path.suffix  # 文件后缀

pixel_values = transform_image(image)
ort.set_default_logger_severity(4)
session = ort.InferenceSession('model/model.onnx')
outputs = session.run(['alphas'], {'pixel_values': pixel_values})

mask = Image.fromarray((outputs[0].squeeze() * 255).astype(np.uint8))
image.putalpha(mask.resize(image.size))

image.save(f'{file_name_new}.png')
print(f"covert cost {time.time() - start}s")
