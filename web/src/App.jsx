/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef } from "react";
import "./App.css";
import InImg from "/input.jpg";
import OutImg from "/out.png";
import Loading from "./components/Loading";

function App() {
  const imageContainer = useRef();
  const [imageRevealFraq, setImageRevealFraq] = useState(0.5);
  const [download, setDownload] = useState(false);
  const [loading, setLoading] = useState(false);

  const [inputImage, setInputImage] = useState(InImg);
  const [downImage, setDownImage] = useState(OutImg);
  const [imageName, setImageName] = useState("");

  // 处理文件上传事件
  const handleImageUpload = async (event) => {
    const imageFile = event.target.files[0];
    if (!imageFile) {
      alert("请选择一张图片！");
      return;
    }
    // 检查 MIME 类型，排除 PNG 格式
    if (imageFile.type === "image/png") {
      alert("不支持处理 PNG 格式的图片！");
      return;
    }
    setLoading(true);

    // 创建FormData并添加图片文件
    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const imageUrl = URL.createObjectURL(imageFile);
      setInputImage(imageUrl);
      setDownImage(null);
      setImageName(imageFile.name);
      // 提交图片到后端
      const response = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("上传失败！");
      }

      // 接收二进制图片流并生成URL
      const blob = await response.blob();
      const url = URL.createObjectURL(blob); // 生成图片URL
      setDownImage(url);
      setLoading(false);
      setDownload(true);
    } catch (error) {
      console.error("上传出错：", error);
      setLoading(false);
    }
    event.target.value = null;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downImage;
    link.download = imageName;
    link.click();
    setDownload(false);
    window.URL.revokeObjectURL(downImage);
  };

  const slide = (xPosition) => {
    const containerBoundingRect =
      imageContainer.current.getBoundingClientRect();
    setImageRevealFraq(() => {
      if (xPosition < containerBoundingRect.left) {
        return 0;
      } else if (xPosition > containerBoundingRect.right) {
        return 1;
      } else {
        return (
          (xPosition - containerBoundingRect.left) / containerBoundingRect.width
        );
      }
    });
  };

  const handleTouchMove = (event) => {
    slide(event.touches.item(0).clientX);
  };

  const handleMouseDown = () => {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  };

  const handleMouseMove = (event) => {
    slide(event.clientX);
  };

  const handleMouseUp = () => {
    window.onmousemove = undefined;
    window.onmouseup = undefined;
  };
  return (
    <div className="px-4">
      <h1 className="text-center font-bold text-lg text-blue-600 mt-4">
        Remove Background
      </h1>
      <Loading show={loading} />
      <div
        ref={imageContainer}
        className="max-w-4xl w-full mx-auto mt-4 relative select-none group imgDivBackground"
      >
        <img
          style={{
            width: 948,
            maxHeight: 633,
            clipPath: `polygon(0 0, ${imageRevealFraq * 100}% 0, ${
              imageRevealFraq * 100
            }% 100%, 0 100%)`,
          }}
          src={inputImage}
          alt=""
          className="pointer-events-none"
        />
        <img
          style={{
            width: 948,
            maxHeight: 633,
          }}
          src={downImage}
          alt=""
          className="absolute inset-0 pointer-events-none"
        />
        <div
          style={{ left: `${imageRevealFraq * 100}%` }}
          className="absolute inset-y-0 group-hover:opacity-100 sm:opacity-0"
        >
          <div className="relative h-full opacity-50 hover:opacity-100">
            <div className="absolute inset-y-0 bg-white w-0.5 -ml-px"></div>
            <div
              style={{ touchAction: "none" }}
              onMouseDown={handleMouseDown}
              onTouchMove={handleTouchMove}
              className="h-12 w-12 -ml-6 -mt-6 rounded-full bg-white absolute top-1/2 shadow-xl flex items-center justify-center cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 text-gray-400 rotate-90 transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-2">
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
          Select File
          <input
            onChange={handleImageUpload}
            id="fileInput"
            type="file"
            className="hidden"
            accept="image/*"
          />
        </label>
        <button
          onClick={handleDownload}
          className="ml-4 cursor-pointer border-solid border-2 border-blue-500 hover:border-blue-700 text-blue-500 py-2 px-4 rounded disabled:opacity-50 disabled:pointer-events-none"
          disabled={!download}
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default App;
