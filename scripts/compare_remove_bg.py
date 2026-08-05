"""对比多种去背景方案在同张图片上的效果，输出到 _compare/ 目录。"""
from rembg import remove, new_session
from PIL import Image
import numpy as np
import os

SRC = r"E:\图片\20260802_230510_244.png"
OUT_DIR = r"E:\图片\_compare"
os.makedirs(OUT_DIR, exist_ok=True)

img = Image.open(SRC).convert("RGB")
arr = np.array(img)

# === 方案 A：rembg u2net 默认 ===
a_path = os.path.join(OUT_DIR, "A_u2net.png")
with open(SRC, "rb") as f:
    Image.open(__import__("io").BytesIO(remove(f.read()))).save(a_path)

# === 方案 B：rembg isnet-general-use ===
session = new_session("isnet-general-use")
with open(SRC, "rb") as f:
    Image.open(__import__("io").BytesIO(remove(f.read(), session=session))).save(os.path.join(OUT_DIR, "B_isnet.png"))

# === 方案 C：rembg isnet-general-use + alpha matting ===
session2 = new_session("isnet-general-use")
with open(SRC, "rb") as f:
    Image.open(__import__("io").BytesIO(remove(
        f.read(),
        session=session2,
        alpha_matting=True,
        alpha_matting_foreground_threshold=240,
        alpha_matting_background_threshold=10,
        alpha_matting_erode_size=5,
    ))).save(os.path.join(OUT_DIR, "C_isnet_matte.png"))

# === 方案 D：纯色阈值法（基于背景色采样） ===
# 从四角采样背景色（中位数更稳）
h, w = arr.shape[:2]
corners = np.concatenate([
    arr[0:30, 0:30].reshape(-1, 3),
    arr[0:30, -30:].reshape(-1, 3),
    arr[-30:, 0:30].reshape(-1, 3),
    arr[-30:, -30:].reshape(-1, 3),
])
bg_color = np.median(corners, axis=0).astype(int)
print(f"采样背景色: RGB={tuple(bg_color)}")

# 用 CIE Lab 颜色空间算距离，对低对比度更鲁棒
img_lab = Image.open(SRC).convert("RGB")
img_lab_arr = np.array(img_lab)
# 简化：直接用欧氏距离 + 容差
diff = np.linalg.norm(arr.astype(int) - bg_color, axis=2)
# 容差 28 试试（可根据结果调整）
mask = (diff > 28).astype(np.uint8) * 255
# 平滑边缘：先轻微膨胀再腐蚀（开运算），然后高斯模糊
from PIL import ImageFilter
mask_img = Image.fromarray(mask, mode="L").filter(ImageFilter.GaussianBlur(1.2))
# 阈值化回到 0/255
mask_arr = np.array(mask_img)
final_mask = (mask_arr > 128).astype(np.uint8) * 255

rgba = np.dstack([arr, final_mask])
Image.fromarray(rgba, mode="RGBA").save(os.path.join(OUT_DIR, "D_color_threshold.png"))

# === 方案 E：纯色阈值 + alpha matting 风格的边缘羽化 ===
# 用距离作为 alpha（软边）
alpha = np.clip(diff / 50.0, 0, 1)  # 距离 50 以上完全不透明
alpha = (alpha * 255).astype(np.uint8)
# 轻微羽化
alpha_img = Image.fromarray(alpha, mode="L").filter(ImageFilter.GaussianBlur(0.8))
alpha_arr = np.array(alpha_img)
rgba2 = np.dstack([arr, alpha_arr])
Image.fromarray(rgba2, mode="RGBA").save(os.path.join(OUT_DIR, "E_color_softedge.png"))

print("对比图已生成:")
for f in sorted(os.listdir(OUT_DIR)):
    p = os.path.join(OUT_DIR, f)
    print(f"  {f}: {os.path.getsize(p)} bytes")