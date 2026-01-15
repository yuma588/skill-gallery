import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

const outputDir = 'd:/skill gallery/crawled/canvas-design/canvas-fonts';

// 定义要爬取的文件
const files = [
  {
    name: 'ArsenalSC-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/ArsenalSC-OFL.txt',
    isBinary: false
  },
  {
    name: 'ArsenalSC-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/ArsenalSC-Regular.ttf',
    isBinary: true
  },
  {
    name: 'BigShoulders-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/BigShoulders-Bold.ttf',
    isBinary: true
  },
  {
    name: 'BigShoulders-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/BigShoulders-OFL.txt',
    isBinary: false
  },
  {
    name: 'BigShoulders-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/BigShoulders-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Boldonse-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Boldonse-OFL.txt',
    isBinary: false
  },
  {
    name: 'Boldonse-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Boldonse-Regular.ttf',
    isBinary: true
  },
  {
    name: 'BricolageGrotesque-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/BricolageGrotesque-Bold.ttf',
    isBinary: true
  },
  {
    name: 'BricolageGrotesque-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/BricolageGrotesque-OFL.txt',
    isBinary: false
  },
  {
    name: 'BricolageGrotesque-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/BricolageGrotesque-Regular.ttf',
    isBinary: true
  },
  {
    name: 'CrimsonPro-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/CrimsonPro-Bold.ttf',
    isBinary: true
  },
  {
    name: 'CrimsonPro-Italic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/CrimsonPro-Italic.ttf',
    isBinary: true
  },
  {
    name: 'CrimsonPro-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/CrimsonPro-OFL.txt',
    isBinary: false
  },
  {
    name: 'CrimsonPro-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/CrimsonPro-Regular.ttf',
    isBinary: true
  },
  {
    name: 'DMMono-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/DMMono-OFL.txt',
    isBinary: false
  },
  {
    name: 'DMMono-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/DMMono-Regular.ttf',
    isBinary: true
  },
  {
    name: 'EricaOne-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/EricaOne-OFL.txt',
    isBinary: false
  },
  {
    name: 'EricaOne-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/EricaOne-Regular.ttf',
    isBinary: true
  },
  {
    name: 'GeistMono-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/GeistMono-Bold.ttf',
    isBinary: true
  },
  {
    name: 'GeistMono-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/GeistMono-OFL.txt',
    isBinary: false
  },
  {
    name: 'GeistMono-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/GeistMono-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Gloock-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Gloock-OFL.txt',
    isBinary: false
  },
  {
    name: 'Gloock-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Gloock-Regular.ttf',
    isBinary: true
  },
  {
    name: 'IBMPlexMono-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexMono-Bold.ttf',
    isBinary: true
  },
  {
    name: 'IBMPlexMono-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexMono-OFL.txt',
    isBinary: false
  },
  {
    name: 'IBMPlexMono-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexMono-Regular.ttf',
    isBinary: true
  },
  {
    name: 'IBMPlexSerif-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexSerif-Bold.ttf',
    isBinary: true
  },
  {
    name: 'IBMPlexSerif-BoldItalic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexSerif-BoldItalic.ttf',
    isBinary: true
  },
  {
    name: 'IBMPlexSerif-Italic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexSerif-Italic.ttf',
    isBinary: true
  },
  {
    name: 'IBMPlexSerif-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/IBMPlexSerif-Regular.ttf',
    isBinary: true
  },
  {
    name: 'InstrumentSans-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSans-Bold.ttf',
    isBinary: true
  },
  {
    name: 'InstrumentSans-BoldItalic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSans-BoldItalic.ttf',
    isBinary: true
  },
  {
    name: 'InstrumentSans-Italic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSans-Italic.ttf',
    isBinary: true
  },
  {
    name: 'InstrumentSans-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSans-OFL.txt',
    isBinary: false
  },
  {
    name: 'InstrumentSans-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSans-Regular.ttf',
    isBinary: true
  },
  {
    name: 'InstrumentSerif-Italic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSerif-Italic.ttf',
    isBinary: true
  },
  {
    name: 'InstrumentSerif-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/InstrumentSerif-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Italiana-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Italiana-OFL.txt',
    isBinary: false
  },
  {
    name: 'Italiana-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Italiana-Regular.ttf',
    isBinary: true
  },
  {
    name: 'JetBrainsMono-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/JetBrainsMono-Bold.ttf',
    isBinary: true
  },
  {
    name: 'JetBrainsMono-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/JetBrainsMono-OFL.txt',
    isBinary: false
  },
  {
    name: 'JetBrainsMono-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/JetBrainsMono-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Jura-Light.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Jura-Light.ttf',
    isBinary: true
  },
  {
    name: 'Jura-Medium.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Jura-Medium.ttf',
    isBinary: true
  },
  {
    name: 'Jura-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Jura-OFL.txt',
    isBinary: false
  },
  {
    name: 'LibreBaskerville-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/LibreBaskerville-OFL.txt',
    isBinary: false
  },
  {
    name: 'LibreBaskerville-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/LibreBaskerville-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Lora-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Lora-Bold.ttf',
    isBinary: true
  },
  {
    name: 'Lora-BoldItalic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Lora-BoldItalic.ttf',
    isBinary: true
  },
  {
    name: 'Lora-Italic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Lora-Italic.ttf',
    isBinary: true
  },
  {
    name: 'Lora-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Lora-OFL.txt',
    isBinary: false
  },
  {
    name: 'Lora-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Lora-Regular.ttf',
    isBinary: true
  },
  {
    name: 'NationalPark-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/NationalPark-Bold.ttf',
    isBinary: true
  },
  {
    name: 'NationalPark-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/NationalPark-OFL.txt',
    isBinary: false
  },
  {
    name: 'NationalPark-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/NationalPark-Regular.ttf',
    isBinary: true
  },
  {
    name: 'NothingYouCouldDo-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/NothingYouCouldDo-OFL.txt',
    isBinary: false
  },
  {
    name: 'NothingYouCouldDo-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/NothingYouCouldDo-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Outfit-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Outfit-Bold.ttf',
    isBinary: true
  },
  {
    name: 'Outfit-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Outfit-OFL.txt',
    isBinary: false
  },
  {
    name: 'Outfit-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Outfit-Regular.ttf',
    isBinary: true
  },
  {
    name: 'PixelifySans-Medium.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/PixelifySans-Medium.ttf',
    isBinary: true
  },
  {
    name: 'PixelifySans-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/PixelifySans-OFL.txt',
    isBinary: false
  },
  {
    name: 'PoiretOne-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/PoiretOne-OFL.txt',
    isBinary: false
  },
  {
    name: 'PoiretOne-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/PoiretOne-Regular.ttf',
    isBinary: true
  },
  {
    name: 'RedHatMono-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/RedHatMono-Bold.ttf',
    isBinary: true
  },
  {
    name: 'RedHatMono-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/RedHatMono-OFL.txt',
    isBinary: false
  },
  {
    name: 'RedHatMono-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/RedHatMono-Regular.ttf',
    isBinary: true
  },
  {
    name: 'Silkscreen-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Silkscreen-OFL.txt',
    isBinary: false
  },
  {
    name: 'Silkscreen-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Silkscreen-Regular.ttf',
    isBinary: true
  },
  {
    name: 'SmoochSans-Medium.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/SmoochSans-Medium.ttf',
    isBinary: true
  },
  {
    name: 'SmoochSans-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/SmoochSans-OFL.txt',
    isBinary: false
  },
  {
    name: 'Tektur-Medium.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Tektur-Medium.ttf',
    isBinary: true
  },
  {
    name: 'Tektur-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Tektur-OFL.txt',
    isBinary: false
  },
  {
    name: 'Tektur-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/Tektur-Regular.ttf',
    isBinary: true
  },
  {
    name: 'WorkSans-Bold.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/WorkSans-Bold.ttf',
    isBinary: true
  },
  {
    name: 'WorkSans-BoldItalic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/WorkSans-BoldItalic.ttf',
    isBinary: true
  },
  {
    name: 'WorkSans-Italic.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/WorkSans-Italic.ttf',
    isBinary: true
  },
  {
    name: 'WorkSans-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/WorkSans-OFL.txt',
    isBinary: false
  },
  {
    name: 'WorkSans-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/WorkSans-Regular.ttf',
    isBinary: true
  },
  {
    name: 'YoungSerif-OFL.txt',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/YoungSerif-OFL.txt',
    isBinary: false
  },
  {
    name: 'YoungSerif-Regular.ttf',
    rawUrl: 'https://raw.githubusercontent.com/anthropics/skills/main/skills/canvas-design/canvas-fonts/YoungSerif-Regular.ttf',
    isBinary: true
  }
];

async function main() {
  try {
    console.log('开始爬取 canvas-design 字体文件...\n');
    
    // 确保输出目录存在
    await fs.mkdir(outputDir, { recursive: true });
    
    let successCount = 0;
    let failCount = 0;
    
    // 逐个爬取文件
    for (const file of files) {
      console.log('='.repeat(60));
      console.log(`正在爬取: ${file.name}`);
      console.log(`URL: ${file.rawUrl}`);
      console.log(`类型: ${file.isBinary ? '二进制' : '文本'}`);
      console.log('='.repeat(60));
      
      try {
        const response = await axios.get(file.rawUrl, {
          responseType: file.isBinary ? 'arraybuffer' : 'text',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        const outputPath = path.join(outputDir, file.name);
        
        if (file.isBinary) {
          // 写入二进制数据
          await fs.writeFile(outputPath, Buffer.from(response.data));
          console.log(`✓ 成功爬取 ${file.name}`);
          console.log(`  - 大小: ${Buffer.byteLength(response.data)} 字节`);
        } else {
          // 写入文本数据
          await fs.writeFile(outputPath, response.data);
          console.log(`✓ 成功爬取 ${file.name}`);
          console.log(`  - 长度: ${response.data.length} 字符`);
          console.log(`  - 行数: ${response.data.split('\n').length} 行`);
        }
        
        console.log(`  - 已保存到: ${outputPath}\n`);
        successCount++;
        
        // 添加延迟以避免触发速率限制
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (error) {
        console.error(`✗ 爬取失败 ${file.name}: ${error.message}\n`);
        failCount++;
      }
    }
    
    console.log('='.repeat(60));
    console.log('✓ 爬取完成！');
    console.log(`  成功: ${successCount} 个文件`);
    console.log(`  失败: ${failCount} 个文件`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('\n✗ 脚本执行失败:', error.message);
    console.error('\n完整错误信息:');
    console.error(error);
    process.exit(1);
  }
}

main();
