"""用 rembg (ML 背景移除) 把 12 个基模 PNG 图片的背景抠成透明。"""
from rembg import remove
from PIL import Image
import os

SRC_DIR = r"E:\项目\个人网站简历\public\models\garment-bases-v1"

def process(src_path, dst_path):
    with open(src_path, "rb") as f:
        input_bytes = f.read()
    output_bytes = remove(input_bytes)
    with open(dst_path, "wb") as f:
        f.write(output_bytes)
    print(f"  done: {os.path.basename(dst_path)}")

def main():
    files = sorted(f for f in os.listdir(SRC_DIR) if f.endswith(".png"))
    for f in files:
        src = os.path.join(SRC_DIR, f)
        print(f"processing {f}...")
        process(src, src)
    print(f"\n处理完成：{len(files)} 个文件")

if __name__ == "__main__":
    main()