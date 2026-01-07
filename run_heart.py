# 直接执行代码
import sys
import os
import math
import random

# 设置路径
os.chdir(r'd:\frontend-design\skills\slack-gif-creator-SKILL')
sys.path.insert(0, os.getcwd())

from core.gif_builder import GIFBuilder
from PIL import Image, ImageDraw

def draw_heart(draw, center_x, center_y, size, color, outline_color=None, outline_width=2):
    """绘制爱心"""
    heart_points = []
    for i in range(100):
        t = 2 * math.pi * i / 100
        x = 16 * (math.sin(t) ** 3)
        y = 13 * math.cos(t) - 5 * math.cos(2*t) - 2 * math.cos(3*t) - math.cos(4*t)
        heart_points.append((center_x + x * size / 35, center_y - y * size / 35))

    draw.polygon(heart_points, fill=color, outline=outline_color, width=outline_width)
    return heart_points

class Particle:
    def __init__(self, center_x, center_y, heart_size):
        angle = random.uniform(0, 2 * math.pi)
        distance = heart_size / 2 + random.uniform(0, 20)
        self.x = center_x + math.cos(angle) * distance
        self.y = center_y - math.sin(angle) * distance

        speed = random.uniform(2, 5)
        self.vx = math.cos(angle) * speed
        self.vy = -math.sin(angle) * speed

        self.size = random.uniform(2, 5)
        self.alpha = random.uniform(150, 255)
        self.fade_speed = random.uniform(3, 8)
        self.color = random.choice([
            (255, 182, 193),
            (255, 105, 180),
            (255, 20, 147),
            (255, 192, 203),
        ])

    def update(self):
        self.x += self.vx
        self.y += self.vy
        self.alpha -= self.fade_speed
        return self.alpha > 0

    def draw(self, draw):
        if self.alpha > 0:
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

builder = GIFBuilder(width=128, height=128, fps=12)
num_frames = 24
center_x, center_y = 64, 64
base_size = 50
particles = []

for i in range(num_frames):
    frame = Image.new('RGB', (128, 128), (255, 245, 250))
    draw = ImageDraw.Draw(frame)

    t = i / (num_frames - 1)
    if t < 0.15:
        scale = 1.0 + 0.15 * (t / 0.15)
    elif t < 0.25:
        scale = 1.15 - 0.1 * ((t - 0.15) / 0.10)
    elif t < 0.40:
        scale = 1.05 + 0.15 * ((t - 0.25) / 0.15)
    else:
        scale = 1.2 - 0.2 * ((t - 0.40) / 0.60)

    current_size = int(base_size * scale)

    draw_heart(draw, center_x, center_y, int(current_size * 1.1),
               color=(255, 200, 210), outline_color=None, outline_width=0)
    draw_heart(draw, center_x, center_y, current_size,
               color=(255, 105, 147), outline_color=(220, 20, 60), outline_width=2)

    highlight_size = int(current_size * 0.3)
    draw.ellipse(
        [center_x - current_size//4 - highlight_size//2,
         center_y - current_size//3 - highlight_size//2,
         center_x - current_size//4 + highlight_size//2,
         center_y - current_size//3 + highlight_size//2],
        fill=(255, 200, 220)
    )

    if 0.10 < t < 0.20 or 0.35 < t < 0.45:
        for _ in range(3):
            particles.append(Particle(center_x, center_y, current_size))

    particles = [p for p in particles if p.update()]
    for p in particles:
        p.draw(draw)

    builder.add_frame(frame)

builder.save('heart_beat.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
print("Heart beat GIF generated: heart_beat.gif")
