import re

filepath = "src/components/solutions/ProgrammaticScrollSection.tsx"
with open(filepath, "r") as f:
    code = f.read()

# Add imports for CSS components
if "import { CssPhone" not in code:
    code = code.replace(
        'import { FormatCopy } from "./FormatCopy";',
        'import { FormatCopy } from "./FormatCopy";\nimport { CssPhone, CssTablet, CssTv } from "./CssPhone";'
    )

# Replace Phone3D usage
code = re.sub(
    r'<CanvasErrorBoundary fallback={null}>\s*(?:<Suspense fallback={null}>\s*)?<Phone3D[^>]*flat=\{flat\}[^>]*/>\s*(?:</Suspense>\s*)?</CanvasErrorBoundary>',
    r'''<CanvasErrorBoundary fallback={<CssPhone mode={mode} formatId={formatId} className="h-full w-full pointer-events-none" />}>
              {use3d ? (
                <Phone3D
                  mode={mode}
                  formatId={formatId}
                  active={scene === "phone"}
                  className={className}
                  flat={false}
                />
              ) : (
                <CssPhone mode={mode} formatId={formatId} className="h-full w-full pointer-events-none" />
              )}
            </CanvasErrorBoundary>''',
    code
)

# Replace Tablet3D usage
code = re.sub(
    r'<CanvasErrorBoundary fallback={null}>\s*\{shouldWarmTablet && \(\s*<Tablet3D[^>]*flat=\{flat\}[^>]*/>\s*\)\}\s*</CanvasErrorBoundary>',
    r'''<CanvasErrorBoundary fallback={<CssTablet mode={mode} formatId={formatId} className="h-full w-full pointer-events-none" />}>
              {use3d ? (
                shouldWarmTablet && (
                  <Tablet3D
                    mode={mode}
                    formatId={formatId}
                    className={className}
                    active={scene === "tablet"}
                    flat={false}
                  />
                )
              ) : (
                shouldWarmTablet && <CssTablet mode={mode} formatId={formatId} className="h-full w-full pointer-events-none" />
              )}
            </CanvasErrorBoundary>''',
    code
)

# Replace Tv3D usage
code = re.sub(
    r'<CanvasErrorBoundary fallback={null}>\s*\{shouldWarmTv && \(\s*<Tv3D[^>]*flat=\{flat\}[^>]*/>\s*\)\}\s*</CanvasErrorBoundary>',
    r'''<CanvasErrorBoundary fallback={<CssTv mode={mode} formatId={formatId} className="h-full w-full pointer-events-none" />}>
              {use3d ? (
                shouldWarmTv && (
                  <Tv3D
                    mode={mode}
                    formatId={formatId}
                    className={className}
                    active={scene === "tv"}
                    flat={false}
                  />
                )
              ) : (
                shouldWarmTv && <CssTv mode={mode} formatId={formatId} className="h-full w-full pointer-events-none" />
              )}
            </CanvasErrorBoundary>''',
    code
)


with open(filepath, "w") as f:
    f.write(code)
