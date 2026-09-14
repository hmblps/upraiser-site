import re

filepath = "src/components/solutions/ProgrammaticScrollSectionMobile.tsx"
with open(filepath, "r") as f:
    code = f.read()

# 1. Update SectionHeader z-index
code = code.replace(
    '<div className="prog-mobile-headline section-inner">',
    '<div className="prog-mobile-headline section-inner relative z-30 bg-background">'
)

# 2. Update LaneSwitcher z-index & bg
code = code.replace(
    'className="prog-mobile-switcher section-inner mb-6 z-20 relative"',
    'className="prog-mobile-switcher section-inner mb-0 pb-6 z-30 relative bg-background"'
)

# 3. Update Sticky Device Center
device_html = '''      {/* Sticky Device Center */}
      <div className="sticky top-0 z-20 flex flex-col items-center justify-center w-full pt-[12vh] pb-[8vh] pointer-events-auto">
        {/* Background Mask to hide scrolling text */}
        <div 
          className="absolute inset-0 bg-background pointer-events-none"
          style={{ 
            maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)"
          }} 
        />
        
        {/* We move the ambience glow here so it stays behind the phone */}
        <div className="prog-mobile-ambience absolute inset-0 !top-0" style={{ position: "absolute" }} aria-hidden />

        <button
          type="button"
          className="w-full flex justify-center outline-none relative z-10"'''

code = re.sub(
    r'\{\/\* Sticky Device Center \*\/\}\s*<div className="sticky top-\[20vh\] sm:top-\[25vh\] z-0 flex flex-col items-center justify-center w-full max-w-sm mx-auto px-4 mt-8 pointer-events-auto">\s*<button\s*type="button"\s*className="w-full flex justify-center outline-none"',
    device_html,
    code
)

# 4. Remove the old prog-mobile-ambience
code = code.replace(
    '<div className="prog-mobile-ambience" aria-hidden />\n\n      <div className="prog-mobile-headline',
    '<div className="prog-mobile-headline'
)

# 5. Increase cards container top margin so it doesn't overlap on first render
code = re.sub(
    r'className="relative z-10 w-full max-w-md mx-auto px-4 mt-\[30vh\]',
    'className="relative z-10 w-full max-w-md mx-auto px-4 mt-[15vh]',
    code
)

with open(filepath, "w") as f:
    f.write(code)
