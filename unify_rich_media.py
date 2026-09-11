import re

with open('src/components/solutions/Phone3D.tsx', 'r') as f:
    code = f.read()

# 1. Remove isRichMedia logic
code = code.replace('  const isRichMedia = formatId === "rich";\n', '')

# 2. Fix the pointer events in the main div
code = code.replace(
    'onPointerDown={isCssFormat || isRichMedia ? undefined : onPointerDown}',
    'onPointerDown={isCssFormat ? undefined : onPointerDown}'
)
code = code.replace(
    'onPointerMove={isCssFormat || isRichMedia ? undefined : onPointerMove}',
    'onPointerMove={isCssFormat ? undefined : onPointerMove}'
)
code = code.replace(
    'onPointerUp={isCssFormat || isRichMedia ? undefined : endDrag}',
    'onPointerUp={isCssFormat ? undefined : endDrag}'
)
code = code.replace(
    'onPointerCancel={isCssFormat || isRichMedia ? undefined : endDrag}',
    'onPointerCancel={isCssFormat ? undefined : endDrag}'
)

# 3. Remove the iframe overlay
iframe_block = """      {isRichMedia ? (
        <div className="phone-rich-on-glb" aria-hidden={false}>
          <iframe
            src="/rich-media-ad.html"
            title="ING Rich Media"
            allow="autoplay; encrypted-media"
            scrolling="no"
          />
        </div>
      ) : null}"""
code = code.replace(iframe_block, '')

# 4. Remove applyDarkScreen
code = re.sub(r'function applyDarkScreen\(root: Object3D\) \{[\s\S]*?\}\n', '', code)

# 5. Fix applyScreenTexture calls inside PhoneScene
code = code.replace(
    'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, still);',
    'applyScreenTexture(rootRef.current, still);'
)
code = code.replace(
    'if (formatId === "rich") applyDarkScreen(rootRef.current); else applyScreenTexture(rootRef.current, videoTex);',
    'applyScreenTexture(rootRef.current, videoTex);'
)
code = code.replace(
    'if (formatId === "rich") applyDarkScreen(root); else applyScreenTexture(root, still);',
    'applyScreenTexture(root, still);'
)

with open('src/components/solutions/Phone3D.tsx', 'w') as f:
    f.write(code)
