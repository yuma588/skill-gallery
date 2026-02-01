
import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

def create_snow_scene():
    print("Creating serene winter snow scene...")

    canvas_width = 1200
    canvas_height = 800
    image = Image.new('RGB', (canvas_width, canvas_height), color='#e8f4f8')
    draw = ImageDraw.Draw(image)

    for y in range(canvas_height):
        progress = y / canvas_height
        r = int(232 * (1-progress) + 210 * progress)
        g = int(244 * (1-progress) + 215 * progress)
        b = int(248 * (1-progress) + 220 * progress)
        draw.line([(0, y), (canvas_width, y)], fill=(r, g, b))

    mountain_x = []
    mountain_y = []
    
    num_peaks = 8
    for i in range(num_peaks + 1):
        x = (canvas_width // num_peaks) * i
        y = canvas_height // 3 + random.randint(-50, 50)
        mountain_x.append(x)
        mountain_y.append(y)
    
    for i in range(1, len(mountain_x)):
        start_x, start_y = mountain_x[i-1], mountain_y[i-1]
        end_x, end_y = mountain_x[i], mountain_y[i]
        
        for t in range(100):
            p = t / 99.0
            mid_x = start_x + p * (end_x - start_x)
            mid_y = start_y + p * (end_y - start_y)
            
            noise = math.sin(p * math.pi * 4) * 10 * (1 - abs(0.5 - p) * 2)
            current_y = mid_y + noise
            
            x = start_x + p * (end_x - start_x)
            y = current_y
            
            if i == 1:
                fill_color = (240, 248, 255)
            else:
                fill_color = (230, 238, 245)
            
            draw.line([(x, y), (x, canvas_height)], fill=fill_color, width=1)

    tree_positions = [
        (canvas_width * 0.15, canvas_height * 0.85),
        (canvas_width * 0.25, canvas_height * 0.88),
        (canvas_width * 0.5, canvas_height * 0.82),
        (canvas_width * 0.65, canvas_height * 0.87),
        (canvas_width * 0.8, canvas_height * 0.84),
    ]

    for pos in tree_positions:
        x, y = pos
        tree_height = random.randint(80, 120)
        tree_width = tree_height * 0.4
        
        trunk_width = tree_width * 0.15
        trunk_top_y = y - tree_height * 0.3
        if trunk_top_y < y:
            draw.rectangle([
                (x - trunk_width/2, trunk_top_y),
                (x + trunk_width/2, y)
            ], fill=(90, 60, 40))
        
        for i in range(3):
            radius = tree_width * (0.7 - i * 0.15)
            cy = trunk_top_y - tree_height * 0.25 * i
            draw.ellipse([
                (x - radius, cy - radius),
                (x + radius, cy + radius)
            ], fill=(200, 210, 215))
            
            draw.ellipse([
                (x - radius*0.9, cy - radius*1.1),
                (x + radius*0.9, cy + radius*0.8)
            ], fill=(245, 248, 250), outline=(230, 235, 240))

    snow_dunes = []
    num_dunes = 12
    for i in range(num_dunes):
        x = (canvas_width // num_dunes) * i
        amplitude = random.randint(15, 30)
        phase = random.uniform(0, math.pi * 2)
        snow_dunes.append((x, amplitude, phase))
    
    start_y = int(canvas_height * 0.85)
    for y in range(start_y, canvas_height):
        progress = (y - start_y) / (canvas_height - start_y)
        r = int(245 * (1-progress) + 235 * progress)
        g = int(248 * (1-progress) + 240 * progress)
        b = int(250 * (1-progress) + 242 * progress)
        
        for x in range(canvas_width):
            noise = 0
            for dune in snow_dunes:
                dune_x, amplitude, phase = dune
                distance = abs(x - dune_x)
                if distance < 80:
                    wave = math.sin((x * 0.01) + phase) * amplitude * (1 - distance / 80)
                    noise += wave
            
            if y > canvas_height * 0.9:
                noise *= 0.5
            
            if y > start_y + noise:
                draw.point((x, y), fill=(r, g, b))

    num_snowflakes = 150
    snowflakes = []
    
    for _ in range(num_snowflakes):
        x = random.randint(0, canvas_width)
        y = random.randint(0, canvas_height)
        size = random.randint(2, 5)
        opacity = random.randint(50, 200)
        speed = random.uniform(0.1, 0.4)
        wind_effect = random.uniform(-0.2, 0.2)
        snowflakes.append((x, y, size, opacity, speed, wind_effect))

    for snowflake in snowflakes:
        x, y, size, opacity, speed, wind_effect = snowflake
        
        for layer in range(3):
            layer_size = size * (1 - layer * 0.3)
            layer_opacity = int(opacity * (1 - layer * 0.4))
            if layer_opacity < 10:
                continue
            
            fill_color = (
                int(255 * (layer_opacity / 255)),
                int(255 * (layer_opacity / 255)), 
                int(255 * (layer_opacity / 255))
            )
            
            if layer == 0:
                draw.ellipse([
                    (x - layer_size, y - layer_size),
                    (x + layer_size, y + layer_size)
                ], fill=fill_color)
            elif layer == 1:
                draw.ellipse([
                    (x - layer_size*0.7, y - layer_size*0.7),
                    (x + layer_size*0.7, y + layer_size*0.7)
                ], fill=fill_color)
            else:
                draw.ellipse([
                    (x - layer_size*0.4, y - layer_size*0.4),
                    (x + layer_size*0.4, y + layer_size*0.4)
                ], fill=fill_color)
        
        if size > 3:
            for angle in range(0, 360, 45):
                radian = math.radians(angle)
                spike_length = size * 0.8
                end_x = x + math.cos(radian) * spike_length
                end_y = y + math.sin(radian) * spike_length
                
                spike_opacity = int(opacity * 0.6)
                spike_color = (
                    int(245 * (spike_opacity / 255)),
                    int(248 * (spike_opacity / 255)),
                    int(250 * (spike_opacity / 255))
                )
                
                draw.line([(x, y), (end_x, end_y)], fill=spike_color, width=1)

    try:
        font_path = "C:/Windows/Fonts/seguiemj.ttf"
        if os.path.exists(font_path):
            font = ImageFont.truetype(font_path, 12)
            text = "Snow Symphony"
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            
            text_x = canvas_width - text_width - 50
            text_y = canvas_height - text_height - 50
            
            draw.text((text_x + 1, text_y + 1), text, font=font, fill=(100, 110, 120))
            draw.text((text_x, text_y), text, font=font, fill=(200, 220, 230))
    except Exception as e:
        print(f"Font loading failed: {e}")

    output_path = os.path.join("D:/skill gallery/skill-gallery-deploy/skills/Anthropic/canvas-design", "snow-scene.png")
    image.save(output_path)
    print(f"唯美雪景已创建: {output_path}")
    return output_path

if __name__ == "__main__":
    create_snow_scene()
