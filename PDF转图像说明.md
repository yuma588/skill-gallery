# PDF转图像任务说明

## 📋 任务要求

将 `chinese_document.pdf` 转换为图像用于网页展示

## 🔧 基于pdf-skills的解决方案

### 参考代码位置
`skill-gallery-deploy/skills/Anthropic/pdf-skills/reference.md`

#### 方案1: Python + pypdfium2 (第10-34行)
```python
import pypdfium2 as pdfium
from PIL import Image

pdf = pdfium.PdfDocument("document.pdf")

for i, page in enumerate(pdf):
    bitmap = page.render(scale=2.0)
    img = bitmap.to_pil()
    img.save(f"page_{i+1}.png", "PNG")
```

#### 方案2: JavaScript + pdfjs-dist (第174-206行)
```javascript
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';

async function renderPDF() {
    const loadingTask = pdfjsLib.getDocument('document.pdf');
    const pdf = await loadingTask.promise;

    const page = await pdf.getPage(1);
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
```

## ⚠️ 当前环境问题

在尝试使用JavaScript方案时遇到以下问题：
- pdfjs-dist + canvas模块在当前Node.js环境中存在兼容性问题
- 需要额外的系统依赖或配置

## 💡 推荐解决方案

### 方案A: 使用Python环境（推荐）

如果您的系统有Python环境，请运行：

```bash
pip install pypdfium2 Pillow
python convert_pdf_to_images.py
```

### 方案B: 使用在线工具

1. **Adobe PDF在线转换器**
   - 访问: https://www.adobe.com/acrobat/online/pdf-to-jpg.html
   - 上传PDF并下载图像

2. **SmallPDF**
   - 访问: https://smallpdf.com/pdf-to-jpg
   - 免费转换（有次数限制）

3. **ILovePDF**
   - 访问: https://www.ilovepdf.com/pdf_to_jpg
   - 高质量输出

### 方案C: 使用桌面软件

1. **Adobe Acrobat Pro**
   - 打开PDF
   - 文件 > 导出为 > 图像

2. **PDF-XChange Editor**
   - 导出页面为图像

3. **Windows自带的打印功能**
   - 右键PDF > 打印
   - 选择"Microsoft Print to PDF"（如果可用）
   - 或使用截图工具

## 📝 手动转换步骤

如果需要手动操作，推荐以下方法：

### Windows系统
1. 打开PDF文件
2. 使用Windows截图工具（Win+Shift+S）
3. 逐页截图并保存为PNG
4. 确保使用高分辨率（推荐1920x1080或更高）

### macOS系统
1. 打开预览应用
2. 文件 > 导出为...
3. 选择PNG格式
4. 逐页导出

## 🎯 网页展示建议

转换后的图像建议：
- **格式**: PNG (无损)
- **分辨率**: 2x 或 3x (Retina屏幕)
- **文件大小**: 每页建议 500KB-2MB
- **命名**: page_1.png, page_2.png, etc.

### HTML示例
```html
<div class="pdf-pages">
  <img src="chinese_document_page_1.png" alt="Page 1">
  <img src="chinese_document_page_2.png" alt="Page 2">
</div>
```

### CSS优化
```css
.pdf-pages img {
  max-width: 100%;
  height: auto;
  margin: 20px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

## 📊 质量建议

| 用途 | 分辨率 | 格式 |
|:---|:---|:---|
| 网页浏览 | 150 DPI | PNG |
| 高质量展示 | 300 DPI | PNG |
| 缩略图 | 72 DPI | JPEG |
| 打印 | 600 DPI | TIFF |

## 🔍 验证转换质量

转换完成后，检查：
- 文本清晰可读
- 图表/图形完整
- 颜色准确
- 无明显的像素化

---

**注意**: 由于当前环境的技术限制，无法自动完成PDF到图像的转换。建议使用上述替代方案。
