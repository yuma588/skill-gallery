# PDF转图像 - 基于pdf-skills的完整指南

## 📋 任务

将 `chinese_document.pdf` 转换为PNG图像用于网页展示

## 🔧 pdf-skills提供的方法

### 方法1: Python + pypdfium2 (reference.md 第10-34行)

**代码示例：**
```python
import pypdfium2 as pdfium
from PIL import Image

# Load PDF
pdf = pdfium.PdfDocument("document.pdf")

# Process multiple pages
for i, page in enumerate(pdf):
    bitmap = page.render(scale=2.0)
    img = bitmap.to_pil()
    img.save(f"page_{i+1}.png", "PNG")
```

**优点：**
- 高性能
- Chromium的PDFium引擎
- 支持高级渲染选项

**要求：**
```bash
pip install pypdfium2 Pillow
```

### 方法2: Python + pdf2image (scripts/convert_pdf_to_images.py)

**pdf-skills提供的完整脚本：**
```python
import os
import sys
from pdf2image import convert_from_path

def convert(pdf_path, output_dir, max_dim=1000):
    images = convert_from_path(pdf_path, dpi=200)

    for i, image in enumerate(images):
        width, height = image.size
        if width > max_dim or height > max_dim:
            scale_factor = min(max_dim / width, max_dim / height)
            new_width = int(width * scale_factor)
            new_height = int(height * scale_factor)
            image = image.resize((new_width, new_height))

        image_path = os.path.join(output_dir, f"page_{i+1}.png")
        image.save(image_path)
        print(f"Saved page {i+1} as {image_path} (size: {image.size})")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: convert_pdf_to_images.py [input pdf] [output directory]")
        sys.exit(1)
    pdf_path = sys.argv[1]
    output_directory = sys.argv[2]
    convert(pdf_path, output_directory)
```

**优点：**
- 简单易用
- 自动处理多页
- 可调整DPI

**要求：**
```bash
pip install pdf2image
# 还需要安装poppler（pdf2image的依赖）
```

### 方法3: JavaScript + pdfjs-dist (reference.md 第174-206行)

**代码示例：**
```javascript
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

async function renderPDF() {
    const loadingTask = pdfjsLib.getDocument('document.pdf');
    const pdf = await loadingTask.promise;

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
            canvasContext: context,
            viewport: viewport
        }).promise;
    }
}
```

**优点：**
- Mozilla PDF.js引擎
- 浏览器兼容性好
- 纯JavaScript解决方案

**要求：**
```bash
npm install pdfjs-dist canvas
```

### 方法4: 命令行工具 (reference.md 第277-283行)

**pdftoppm：**
```bash
# 转换为PNG图像，300 DPI
pdftoppm -png -r 300 document.pdf output_prefix

# 转换特定页面范围
pdftoppm -png -r 600 -f 1 -l 3 document.pdf high_res_pages
```

**优点：**
- 最快的转换方法
- 无需编程
- 原生工具

**要求：**
```bash
# Ubuntu/Debian
sudo apt-get install poppler-utils

# macOS
brew install poppler

# Windows
# 从 https://github.com/oschwartz10612/poppler-windows/releases 下载
```

## ⚠️ 当前环境限制

经过多次测试，发现以下问题：

1. **Python环境** - 不可用或缺少依赖
2. **pdfjs-dist** - Node.js版本使用ESM模块，当前环境存在兼容性问题
3. **命令行工具** - 系统未安装poppler等工具

## 💡 推荐解决方案

### 方案1: 安装并使用Python（最推荐）

```bash
# 1. 安装Python（如果未安装）
# 下载地址：https://python.org

# 2. 安装依赖
pip install pypdfium2 Pillow

# 3. 创建并运行脚本
# 使用pdf-skills中提供的代码
```

### 方案2: 安装poppler并使用命令行

```bash
# 1. 下载poppler for Windows
# https://github.com/oschwartz10612/poppler-windows/releases

# 2. 解压并将bin目录添加到PATH

# 3. 运行转换命令
pdftoppm -png -r 200 chinese_document.pdf page

# 4. 重命名文件
ren page-1.png chinese_document_page_1.png
ren page-2.png chinese_document_page_2.png
```

### 方案3: 使用在线工具（最简单）

1. **Adobe在线转换器**
   - 访问：https://www.adobe.com/acrobat/online/pdf-to-png.html
   - 上传`chinese_document.pdf`
   - 下载PNG图像

2. **SmallPDF**
   - 访问：https://smallpdf.com/pdf-to-png
   - 免费转换（有限制）

3. **ILovePDF**
   - 访问：https://www.ilovepdf.com/pdf_to_png
   - 高质量输出

## 📊 质量建议（基于pdf-skills最佳实践）

### 网页展示的推荐设置：

| 用途 | DPI | 分辨率 | 文件大小 |
|:---|:---|:---|:---|
| 网页预览 | 150-200 | 1240x1754 | 200-500KB |
| 高质量展示 | 300 | 2480x3508 | 500KB-1MB |
| 缩略图 | 72 | 595x842 | 50-100KB |

### 文件命名建议：
```
chinese_document_page_1.png
chinese_document_page_2.png
```

## 🌐 网页展示代码

### HTML示例：
```html
<div class="pdf-pages">
  <img src="chinese_document_page_1.png" alt="Page 1" class="pdf-page">
  <img src="chinese_document_page_2.png" alt="Page 2" class="pdf-page">
</div>
```

### CSS优化：
```css
.pdf-pages {
  max-width: 100%;
  margin: 20px auto;
}

.pdf-page {
  width: 100%;
  height: auto;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-radius: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .pdf-page {
    margin: 10px 0;
  }
}
```

## ✅ 验证转换质量

转换完成后，检查：
- [ ] 文本清晰可读
- [ ] 图表/表格完整
- [ ] 颜色准确
- [ ] 无明显像素化
- [ ] 文件大小合理

## 📝 下一步

根据pdf-skills的指导，如果转换成功，可以：
1. 使用图片优化工具减小文件大小
2. 添加适当的alt文本提高可访问性
3. 使用懒加载提高页面性能
4. 考虑使用WebP格式以获得更好的压缩率

---

**所有方法都严格基于pdf-skills提供的代码和最佳实践。**

选择适合你环境的方法，按照步骤执行即可完成PDF到图像的转换。
