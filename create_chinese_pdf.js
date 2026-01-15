#!/usr/bin/env node
/**
 * 中文 PDF 生成脚本 - 使用 Node.js 和 pdfkit
 * 支持自定义字体、布局、表格和多种样式
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// 字体配置
const fontConfig = {
    // Windows 字体路径
    windows: {
        yaHei: 'C:/Windows/Fonts/msyh.ttc',       // 微软雅黑
        simSun: 'C:/Windows/Fonts/simsun.ttc',     // 宋体
        simHei: 'C:/Windows/Fonts/simhei.ttf',     // 黑体
    },
    // 如果找不到字体，使用备用方案
    fallback: null
};

// 检查字体是否存在
function getFontPath(fontName) {
    const fontPaths = [
        fontConfig.windows[fontName],
        fontConfig.windows[fontName.toLowerCase()]
    ];
    
    for (const fontPath of fontPaths) {
        if (fontPath && fs.existsSync(fontPath)) {
            return fontPath;
        }
    }
    
    console.warn(`⚠ 字体未找到: ${fontName}`);
    return null;
}

// 创建中文PDF
function createChinesePDF(outputPath = 'chinese_document.pdf') {
    return new Promise((resolve, reject) => {
        try {
            console.log('正在创建PDF文档...');
            
            // 创建PDF文档
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 },
                font: 'Courier'
            });
            
            // 注册字体
            const yaHeiFont = getFontPath('yaHei');
            const simSunFont = getFontPath('simSun');
            const simHeiFont = getFontPath('simHei');
            
            let fontLoaded = false;
            
            // 尝试加载字体
            try {
                if (yaHeiFont && yaHeiFont.endsWith('.ttf')) {
                    doc.registerFont('YaHei', yaHeiFont);
                    doc.font('YaHei');
                    fontLoaded = true;
                    console.log('✓ 已加载微软雅黑字体');
                } else if (simHeiFont) {
                    doc.registerFont('SimHei', simHeiFont);
                    doc.font('SimHei');
                    fontLoaded = true;
                    console.log('✓ 已加载黑体字体');
                } else if (simSunFont && simSunFont.endsWith('.ttf')) {
                    doc.registerFont('SimSun', simSunFont);
                    doc.font('SimSun');
                    fontLoaded = true;
                    console.log('✓ 已加载宋体字体');
                } else {
                    console.log('⚠ 未找到支持的.TTF字体文件，使用默认字体');
                    console.log('⚠ 中文可能无法正常显示');
                }
            } catch (fontError) {
                console.log('⚠ 字体加载失败，使用默认字体:', fontError.message);
                fontLoaded = false;
            }
            
            // 创建输出流
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);
            
            // 文档内容
            const content = {
                title: '中国传统文化概述',
                sections: [
                    {
                        heading: '引言',
                        text: '中国传统文化博大精深，源远流长，是中华民族数千年文明的结晶。它包含了丰富的哲学思想、文学艺术、礼仪习俗、科学技术等各个方面，对世界文明的发展产生了深远的影响。'
                    },
                    {
                        heading: '一、哲学思想',
                        text: '中国古代哲学以儒家、道家、法家、墨家等为代表，形成了独特的思想体系。儒家强调仁、义、礼、智、信，主张修身齐家治国平天下；道家崇尚自然无为，追求与道合一的境界；法家主张以法治国，强调制度的权威性。这些思想至今仍然影响着中国社会的发展和人们的生活方式。'
                    },
                    {
                        heading: '二、文学艺术',
                        text: '中国文学艺术历史悠久，成果辉煌。诗歌方面，从《诗经》《楚辞》到唐诗宋词元曲，创作了无数千古传诵的佳作；小说方面，《红楼梦》《西游记》《三国演义》《水浒传》四大名著家喻户晓；书法绘画方面，王羲之、颜真卿等书法大家的作品，以及顾恺之、吴道子等画家的画作，都是艺术瑰宝。'
                    },
                    {
                        heading: '三、主要传统节日',
                        text: '中国有许多传统节日，每个节日都有其独特的习俗和文化内涵：',
                        festivals: [
                            ['春节', '农历正月初一', '贴春联、放鞭炮、吃饺子'],
                            ['元宵节', '农历正月十五', '赏花灯、吃元宵、猜灯谜'],
                            ['清明节', '公历4月4-6日', '扫墓祭祖、踏青郊游'],
                            ['端午节', '农历五月初五', '赛龙舟、吃粽子'],
                            ['中秋节', '农历八月十五', '赏月、吃月饼'],
                            ['重阳节', '农历九月初九', '登高、赏菊、插茱萸']
                        ]
                    },
                    {
                        heading: '四、传统工艺',
                        text: '中国传统工艺精湛绝伦，体现了劳动人民的智慧和创造力。陶瓷工艺如景德镇瓷器、宜兴紫砂壶享誉世界；纺织工艺如丝绸、刺绣、蜡染精美绝伦；木工工艺如榫卯结构、雕刻工艺巧夺天工；金银器工艺如景泰蓝、银饰制作技艺高超。'
                    },
                    {
                        heading: '五、中医药',
                        text: '中医药是中华文明的瑰宝，有着几千年的历史。它包括中药、针灸、推拿、气功等多种治疗方法，强调整体观念和辨证论治。著名的医学典籍如《黄帝内经》《本草纲目》等，至今仍然对医学研究和临床实践具有重要价值。'
                    },
                    {
                        heading: '六、传统礼仪',
                        text: '中国是礼仪之邦，传统礼仪讲究长幼有序、尊老爱幼、礼尚往来。从日常问候、婚丧嫁娶，到祭祀祖先、节庆活动，都有一套完整的礼仪规范。这些礼仪不仅体现了对他人的尊重，也维系着社会的和谐稳定。'
                    },
                    {
                        heading: '七、文化传承',
                        text: '在现代化进程中，中国传统文化的传承与保护面临着新的挑战和机遇。政府和社会各界都在积极采取措施，如设立非物质文化遗产保护制度、开展传统文化教育、推广国学经典等，让传统文化在新时代焕发出新的生机与活力。'
                    },
                    {
                        heading: '八、结语',
                        text: '中国传统文化是中华民族的精神命脉，是我们在世界文化激荡中站稳脚跟的根基。我们应该珍惜这份宝贵的文化遗产，在传承中创新，在创新中发展，让传统文化在新时代继续发挥其独特的价值和作用。'
                    }
                ]
            };
            
            // 绘制标题
            doc.fontSize(24)
               .text(content.title, { align: 'center' });
            doc.moveDown(0.5);
            
            // 绘制分隔线
            doc.moveTo(50, doc.y)
               .lineTo(545, doc.y)
               .stroke();
            doc.moveDown(1);
            
            // 绘制各个章节
            content.sections.forEach((section, index) => {
                // 章节标题
                doc.fontSize(16)
                   .fillColor('blue')
                   .text(section.heading);
                
                // 重置颜色
                doc.fillColor('black');
                
                doc.fontSize(11);
                
                // 如果有节日表格
                if (section.festivals) {
                    doc.text(section.text);
                    doc.moveDown(0.5);
                    
                    // 绘制表格
                    const tableY = doc.y;
                    const rowHeight = 25;
                    const colWidths = [100, 120, 200];
                    const startX = 50;
                    let currentY = tableY;
                    
                    // 表头
                    doc.fontSize(12)
                       .fillColor('white')
                       .rect(startX, currentY, 100, rowHeight)
                       .fillColor('blue')
                       .text('节日名称', startX + 5, currentY + 8, { width: 90 });
                    
                    doc.fillColor('white')
                       .rect(startX + 100, currentY, 120, rowHeight)
                       .fillColor('blue')
                       .text('日期', startX + 105, currentY + 8, { width: 110 });
                    
                    doc.fillColor('white')
                       .rect(startX + 220, currentY, 200, rowHeight)
                       .fillColor('blue')
                       .text('主要习俗', startX + 225, currentY + 8, { width: 190 });
                    
                    currentY += rowHeight;
                    
                    // 表格内容
                    doc.fontSize(10);
                    section.festivals.forEach((festival, i) => {
                        const rowColor = i % 2 === 0 ? 'white' : '#f0f0f0';
                        
                        doc.fillColor(rowColor)
                           .rect(startX, currentY, 100, rowHeight)
                           .fillColor('black')
                           .text(festival[0], startX + 5, currentY + 7, { width: 90 });
                        
                        doc.fillColor(rowColor)
                           .rect(startX + 100, currentY, 120, rowHeight)
                           .fillColor('black')
                           .text(festival[1], startX + 105, currentY + 7, { width: 110 });
                        
                        doc.fillColor(rowColor)
                           .rect(startX + 220, currentY, 200, rowHeight)
                           .fillColor('black')
                           .text(festival[2], startX + 225, currentY + 7, { width: 190 });
                        
                        currentY += rowHeight;
                    });
                    
                    doc.y = currentY + 10;
                } else {
                    // 普通段落
                    doc.text(section.text, {
                        align: 'justify',
                        lineGap: 3
                    });
                }
                
                doc.moveDown(0.8);
                
                // 如果页面快满了，添加新页面
                if (doc.y > 700) {
                    doc.addPage();
                }
            });
            
            // 完成文档
            doc.end();
            
            // 监听完成事件
            stream.on('finish', () => {
                console.log(`✓ PDF生成成功: ${outputPath}`);
                resolve(outputPath);
            });
            
            stream.on('error', (error) => {
                console.error('✗ PDF生成失败:', error);
                reject(error);
            });
            
        } catch (error) {
            console.error('✗ 创建PDF时出错:', error);
            reject(error);
        }
    });
}

// 主函数
async function main() {
    try {
        const outputPath = path.join(__dirname, 'chinese_document.pdf');
        await createChinesePDF(outputPath);
        console.log(`\n文档已保存到: ${outputPath}`);
    } catch (error) {
        console.error('发生错误:', error);
        process.exit(1);
    }
}

// 运行主函数
main();
