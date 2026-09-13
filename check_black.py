from PIL import Image
img = Image.open('output_frame6.jpg')
width, height = img.size
right_10_percent = img.crop((int(width * 0.9), 0, width, height))
extrema = right_10_percent.convert("L").getextrema()
print(f"Right 10% extrema: {extrema}")

bottom_10_percent = img.crop((0, int(height * 0.9), width, height))
bottom_extrema = bottom_10_percent.convert("L").getextrema()
print(f"Bottom 10% extrema: {bottom_extrema}")
