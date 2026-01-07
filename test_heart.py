import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from core.gif_builder import GIFBuilder
from PIL import Image, ImageDraw
import math
import random

def draw_heart(draw, center_x, center_y, size, color, outline_color=None, outline_width=2):
    """绘制爱心"""
    # 使用参数方程绘制精确爱心形状
    heart_points = []
    for i in range(100):
        t = 2 * math.pi * i / 100
        # 参数方程
        x = 16 * (math.sin(t) ** 3)
        y = 13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t)
        heart_points.append((center_x + x * size / 35, center_y - y * size / 35))

    draw.polygon(heart_points, fill=color, outline=outline_color, width=outline_width)
    return heart_points

class Particle:
    def __init__(self, center_x, center_y, heart_size):
        # 从爱心边缘随机发射
        angle = random.uniform(0, 2 * math.pi)
        distance = heart_size / 2 + random.uniform(0, 20)
        self.x = center_x + math.cos(angle) * distance
        self.y = center_y - math.sin(angle) * distance

        # 向外扩散的速度
        speed = random.uniform(2, 5)
        self.vx = math.cos(angle) * speed
        self.vy = -math.sin(angle) * speed

        # 粒子属性
        self.size = random.uniform(2, 5)
        self.alpha = random.uniform(150, 255)
        self.fade_speed = random.uniform(3, 8)
        self.color = random.choice([
            (255, 182, 193),  # 粉色
            (255, 105, 180),  # 亮粉色
            (255, 20, 147),   # 深粉色
            (255, 192, 203),  # 浅粉色
        ])

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.alpha -= self.fade_speed
        return self.alpha > 0

    def draw(self, draw):
        if self.alpha > 0:
            # 用颜色深浅模拟透明度
            fade_factor = self.alpha / 255
            faded_color = (
                int(self.color[0] * fade_factor),
                int(self.color[1] * fade_factor),
                int(self.color[2] * fade_factor)
            )
            r = int(self.size * fade_factor)
            if r >= 1:
                draw.ellipse(
                    [self.x - r, self.y - r, self.x + r, self.y + r],
                    fill=faded_color
                )

# 创建 GIF 构建器
builder = GIFBuilder(width=128, height=128, fps=12)

num_frames = 24
center_x, center_y = 64, 64
base_size = 50

# 粒子系统
particles = []

for i in range(num_frames):
    # 创建渐变背景
    frame = Image.new('RGB', (128, 128), (255, 245, 250))
    draw = ImageDraw.Draw(frame)

    # 脉冲效果（心跳）
    t = i / (num_frames - 1)
    # 模拟心跳：快速收缩两次，然后缓慢舒张
    if t < 0.15:
        scale = 1.0 + 0.15 * (t / 0.15)
    elif t < 0.25:
        scale = 1.15 - 0.1 * ((t - 0.15) / 0.10)
    elif t < 0.40:
        scale = 1.05 + 0.15 * ((t - 0.25) / 0.15)
    else:
        scale = 1.2 - 0.2 * ((t - 0.40) / 0.60)

    current_size = int(base_size * scale)

    # 绘制爱心（带发光效果）
    draw_heart(draw, center_x, center_y, int(current_size * 1.1),
               color=(255, 200, 210), outline_color=None, outline_width=0)

    # 主体爱心
    draw_heart(draw, center_x, center_y, current_size,
               color=(255, 105, 147), outline_color=(220, 20, 60), outline_width=2)

    # 高光
    highlight_size = int(current_size * 0.3)
    draw.ellipse(
        [center_x - current_size//4 - highlight_size//2,
         center_y - current_size//3 - highlight_size//2,
         center_x - current_size//4 + highlight_size//2,
         center_y - current_size//3 + highlight_size//2],
        fill=(255, 200, 220)
    )

    # 在心跳收缩时产生新粒子
    if 0.10 < t < 0.20 or 0.35 < t < 0.45:
        for _ in range(3):
            particles.append(Particle(center_x, center_y, current_size))

    # 更新和绘制粒子
    particles = [p for p in particles if p.update()]
    for p in particles:
        p.draw(draw)

    builder.add_frame(frame)

# 保存 GIF
builder.save('heart_beat.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)

print("Heart beat GIF generated: heart_beat.gif")
