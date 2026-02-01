const pdfjsLib = require('pdfjs-dist');
console.log('pdfjs-dist loaded');
console.log('Version:', pdfjsLib.version);
console.log('Available methods:', Object.keys(pdfjsLib).slice(0, 10));
