"""批量去除 E:\图片 下所有 PNG 图片的背景，保存到 nobg 子目录。
使用 isnet-general-use 模型（对主体/背景颜色接近的图片效果优于默认 u2net）。"""
from rembg import remove, new_session
from PIL import Image
import os
import sys
import time

SRC_DIR = r"E:\图片"
DST_DIR = os.path.join(SRC_DIR, "nobg")
MODEL_NAME = "isnet-general-use"

def main():
    os.makedirs(DST_DIR, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC_DIR) if f.lower().endswith(".png"))
    total = len(files)
    print(f"模型: {MODEL_NAME}")
    print(f"共 {total} 张图片待处理\n")

    session = new_session(MODEL_NAME)
    success = 0
    failed = []
    for i, f in enumerate(files, 1):
        src = os.path.join(SRC_DIR, f)
        dst = os.path.join(DST_DIR, f)
        t0 = time.time()
        try:
            with open(src, "rb") as fp:
                input_bytes = fp.read()
            output_bytes = remove(input_bytes, session=session)
            with open(dst, "wb") as fp:
                fp.write(output_bytes)
            elapsed = time.time() - t0
            # 验证输出
            img = Image.open(dst)
            print(f"[{i}/{total}] {f}  {img.size[0]}x{img.size[1]}  {elapsed:.1f}s")
            success += 1
        except Exception as e:
            print(f"[{i}/{total}] {f}  FAILED: {e}")
            failed.append(f)

    print(f"\n完成：{success}/{total} 成功")
    if failed:
        print(f"失败：{failed}")

if __name__ == "__main__":
    main()
