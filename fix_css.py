import re

filepath = "src/styles/programmatic-scroll-section.css"
with open(filepath, "r") as f:
    code = f.read()

# Remove the [data-scene="tv"] prefix before .prog-device-slot--tv
code = re.sub(
    r'\[data-scene="tv"\]\s*\n*\s*\n*\.prog-device-slot--tv\s*\{',
    r'.prog-device-slot--tv {',
    code
)

with open(filepath, "w") as f:
    f.write(code)
