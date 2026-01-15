#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
中文 PDF 生成脚本 - 使用 ReportLab Platypus API
支持自定义字体、布局、表格和多种样式
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether
)
from reportlab.lib import colors


# 字体路径配置
def get_font_path():
    """获取系统字体路径"""
    if os.name == 'nt':  # Windows
        return r'C:\Windows\Fonts'
    elif os.name == 'posix':
        if sys.platform == 'darwin':  # macOS
            return '/System/Library/Fonts'
        else:  # Linux
            return '/usr/share/fonts/truetype'
    return '.'


def register_fonts():
    """注册中文字体"""
    fonts_path = get_font_path()
    
    # Windows 字体注册
    if os.name == 'nt':
        font_mappings = {
            'YaHei': 'msyh.ttc',
            'SimSun': 'simsun.ttc',
            'SimHei': 'simhei.ttf',
            'KaiTi': 'simkai.ttf',
            'FangSong': 'simfang.ttf'
        }
    else:
        # 非Windows系统需要提供字体文件路径
        font_mappings = {
            'YaHei': 'msyh.ttc',  # 需要替换为实际字体文件
            'SimSun': 'simsun.ttc',
        }
    
    for font_name, font_file in font_mappings.items():
        font_path = os.path.join(fonts_path, font_file)
        if os.path.exists(font_path):
            try:
                pdfmetrics.registerFont(TTFont(font_name, font_path))
                print(f"✓ 已注册字体: {font_name}")
            except Exception as e:
                print(f"✗ 注册字体失败 {font_name}: {e}")
        else:
            print(f"⚠ 字体文件不存在: {font_path}")


def create_custom_styles():
    """创建自定义样式"""
    styles = getSampleStyleSheet()
    
    # 自定义标题样式
    styles.add(ParagraphStyle(
        name='ChineseTitle',
        fontName='YaHei',
        fontSize=24,
        leading=30,
        alignment=TA_CENTER,
        spaceAfter=20,
        textColor=colors.HexColor('#2c3e50')
    ))
    
    # 自定义副标题样式
    styles.add(ParagraphStyle(
        name='ChineseHeading1',
        fontName='YaHei',
        fontSize=18,
        leading=24,
        spaceBefore=15,
        spaceAfter=10,
        textColor=colors.HexColor('#34495e')
    ))
    
    # 自定义副副标题样式
    styles.add(ParagraphStyle(
        name='ChineseHeading2',
        fontName='SimHei',
        fontSize=14,
        leading=20,
        spaceBefore=10,
        spaceAfter=8,
        textColor=colors.HexColor('#2980b9')
    ))
    
    # 自定义正文样式
    styles.add(ParagraphStyle(
        name='ChineseBody',
        fontName='SimSun',
        fontSize=10,
        leading=16,
        alignment=TA_JUSTIFY,
        spaceAfter=10,
        textColor=colors.black
    ))
    
    # 自定义强调文本样式
    styles.add(ParagraphStyle(
        name='ChineseEmphasis',
        fontName='SimHei',
        fontSize=10,
        leading=16,
        alignment=TA_LEFT,
        spaceAfter=10,
        textColor=colors.HexColor('#e74c3c')
    ))
    
    # 自定义引用样式
    styles.add(ParagraphStyle(
        name='ChineseQuote',
        fontName='SimSun',
        fontSize=9,
        leading=14,
        leftIndent=20,
        rightIndent=20,
        textColor=colors.HexColor('#7f8c8d')
    ))
    
    return styles


def create_chinese_pdf(output_path='chinese_document.pdf'):
    """
    创建中文 PDF 文档
    
    Args:
        output_path: 输出 PDF 文件路径
    """
    # 注册中文字体
    print("正在注册中文字体...")
    register_fonts()
    
    # 创建 PDF 文档
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )
    
    # 获取样式
    styles = create_custom_styles()
    
    # 构建文档内容
    story = []
    
    # 1. 标题
    title = Paragraph("中国传统文化概述", styles['ChineseTitle'])
    story.append(title)
    story.append(Spacer(1, 0.5*cm))
    
    # 2. 引言
    intro_text = """
        中国传统文化博大精深，源远流长，是中华民族数千年文明的结晶。
        它包含了丰富的哲学思想、文学艺术、礼仪习俗、科学技术等各个方面，
        对世界文明的发展产生了深远的影响。
    """
    intro = Paragraph(intro_text, styles['ChineseBody'])
    story.append(intro)
    story.append(Spacer(1, 0.3*cm))
    
    # 3. 哲学思想
    philosophy_heading = Paragraph("一、哲学思想", styles['ChineseHeading1'])
    story.append(philosophy_heading)
    
    philosophy_text = """
        中国古代哲学以儒家、道家、法家、墨家等为代表，形成了独特的思想体系。
        儒家强调仁、义、礼、智、信，主张修身齐家治国平天下；
        道家崇尚自然无为，追求与道合一的境界；
        法家主张以法治国，强调制度的权威性。
        这些思想至今仍然影响着中国社会的发展和人们的生活方式。
    """
    philosophy = Paragraph(philosophy_text, styles['ChineseBody'])
    story.append(philosophy)
    story.append(Spacer(1, 0.3*cm))
    
    # 4. 文学艺术
    literature_heading = Paragraph("二、文学艺术", styles['ChineseHeading1'])
    story.append(literature_heading)
    
    literature_text = """
        中国文学艺术历史悠久，成果辉煌。诗歌方面，从《诗经》《楚辞》到唐诗宋词元曲，
        创作了无数千古传诵的佳作；小说方面，《红楼梦》《西游记》《三国演义》《水浒传》
        四大名著家喻户晓；书法绘画方面，王羲之、颜真卿等书法大家的作品，
        以及顾恺之、吴道子等画家的画作，都是艺术瑰宝。
    """
    literature = Paragraph(literature_text, styles['ChineseBody'])
    story.append(literature)
    story.append(Spacer(1, 0.3*cm))
    
    # 5. 传统节日表格
    festivals_heading = Paragraph("三、主要传统节日", styles['ChineseHeading1'])
    story.append(festivals_heading)
    
    festivals_data = [
        ['节日名称', '日期', '主要习俗'],
        ['春节', '农历正月初一', '贴春联、放鞭炮、吃饺子'],
        ['元宵节', '农历正月十五', '赏花灯、吃元宵、猜灯谜'],
        ['清明节', '公历4月4-6日', '扫墓祭祖、踏青郊游'],
        ['端午节', '农历五月初五', '赛龙舟、吃粽子'],
        ['中秋节', '农历八月十五', '赏月、吃月饼'],
        ['重阳节', '农历九月初九', '登高、赏菊、插茱萸']
    ]
    
    festival_table = Table(festivals_data, colWidths=[4*cm, 3*cm, 7*cm])
    festival_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3498db')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'SimHei'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'SimSun'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
    ]))
    
    story.append(festival_table)
    story.append(Spacer(1, 0.5*cm))
    
    # 6. 传统工艺
    crafts_heading = Paragraph("四、传统工艺", styles['ChineseHeading1'])
    story.append(crafts_heading)
    
    crafts_text = """
        中国传统工艺精湛绝伦，体现了劳动人民的智慧和创造力。
        陶瓷工艺如景德镇瓷器、宜兴紫砂壶享誉世界；
        纺织工艺如丝绸、刺绣、蜡染精美绝伦；
        木工工艺如榫卯结构、雕刻工艺巧夺天工；
        金银器工艺如景泰蓝、银饰制作技艺高超。
    """
    crafts = Paragraph(crafts_text, styles['ChineseBody'])
    story.append(crafts)
    story.append(Spacer(1, 0.3*cm))
    
    # 7. 中医药
    medicine_heading = Paragraph("五、中医药", styles['ChineseHeading1'])
    story.append(medicine_heading)
    
    medicine_text = """
        中医药是中华文明的瑰宝，有着几千年的历史。
        它包括中药、针灸、推拿、气功等多种治疗方法，
        强调整体观念和辨证论治。
        著名的医学典籍如《黄帝内经》《本草纲目》等，
        至今仍然对医学研究和临床实践具有重要价值。
    """
    medicine = Paragraph(medicine_text, styles['ChineseBody'])
    story.append(medicine)
    story.append(Spacer(1, 0.3*cm))
    
    # 8. 传统礼仪
    etiquette_heading = Paragraph("六、传统礼仪", styles['ChineseHeading1'])
    story.append(etiquette_heading)
    
    etiquette_text = """
        中国是礼仪之邦，传统礼仪讲究长幼有序、尊老爱幼、礼尚往来。
        从日常问候、婚丧嫁娶，到祭祀祖先、节庆活动，
        都有一套完整的礼仪规范。
        这些礼仪不仅体现了对他人的尊重，也维系着社会的和谐稳定。
    """
    etiquette = Paragraph(etiquette_text, styles['ChineseBody'])
    story.append(etiquette)
    story.append(Spacer(1, 0.3*cm))
    
    # 9. 文化传承
    heritage_heading = Paragraph("七、文化传承", styles['ChineseHeading1'])
    story.append(heritage_heading)
    
    heritage_text = """
        在现代化进程中，中国传统文化的传承与保护面临着新的挑战和机遇。
        政府和社会各界都在积极采取措施，
        如设立非物质文化遗产保护制度、开展传统文化教育、
        推广国学经典等，让传统文化在新时代焕发出新的生机与活力。
    """
    heritage = Paragraph(heritage_text, styles['ChineseBody'])
    story.append(heritage)
    story.append(Spacer(1, 0.5*cm))
    
    # 10. 结语
    conclusion_heading = Paragraph("八、结语", styles['ChineseHeading1'])
    story.append(conclusion_heading)
    
    conclusion_text = """
        中国传统文化是中华民族的精神命脉，是我们在世界文化激荡中站稳脚跟的根基。
        我们应该珍惜这份宝贵的文化遗产，在传承中创新，在创新中发展，
        让传统文化在新时代继续发挥其独特的价值和作用。
    """
    conclusion = Paragraph(conclusion_text, styles['ChineseBody'])
    story.append(conclusion)
    story.append(Spacer(1, 0.5*cm))
    
    # 页脚信息
    footer_text = Paragraph(
        "文档生成时间: 2026年1月15日",
        ParagraphStyle(
            name='Footer',
            fontName='SimSun',
            fontSize=8,
            textColor=colors.grey,
            alignment=TA_CENTER
        )
    )
    story.append(footer_text)
    
    # 构建 PDF
    print(f"正在生成 PDF: {output_path}")
    doc.build(story)
    print(f"✓ PDF 生成成功: {output_path}")


def main():
    """主函数"""
    try:
        output_file = os.path.join(os.path.dirname(__file__), 'chinese_document.pdf')
        create_chinese_pdf(output_file)
        print(f"\n文档已保存到: {output_file}")
    except Exception as e:
        print(f"✗ 生成 PDF 时出错: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
