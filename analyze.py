from PIL import Image
img = Image.open('/tmp/img7522_frame.png')
w, h = img.size
pixels = img.load()
print(f"Size: {w}x{h}")
red_y = -1
for y in range(h//4):
    for x in range(w):
        r,g,b = pixels[x,y]
        if r > 200 and g < 50 and b < 50:
            red_y = y
            break
print(f"Lowest red pixel is at y={red_y}")
