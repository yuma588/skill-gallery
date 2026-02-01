const pdfjsLib = require('pdfjs-dist');
const fs = require('fs');
console.log('Step 1: pdfjs-lib loaded');

async function test() {
    try {
        console.log('Step 2: Starting PDF loading');
        const loadingTask = pdfjsLib.getDocument('chinese_document.pdf');
        console.log('Step 3: Loading task created');

        const pdf = await loadingTask.promise;
        console.log('Step 4: PDF loaded, pages:', pdf.numPages);

        const page = await pdf.getPage(1);
        console.log('Step 5: Page 1 loaded');

        const viewport = page.getViewport({ scale: 1.5 });
        console.log('Step 6: Viewport created', viewport.width, 'x', viewport.height);

        const canvas = require('canvas').createCanvas(viewport.width, viewport.height);
        console.log('Step 7: Canvas created');

        const context = canvas.getContext('2d');
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        console.log('Step 8: Render complete');

        const buffer = canvas.toBuffer('image/png');
        console.log('Step 9: Buffer created, size:', buffer.length);

        fs.writeFileSync('test_output.png', buffer);
        console.log('Step 10: File saved');

    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
    }
}

test();
