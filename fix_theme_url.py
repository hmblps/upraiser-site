import re

filepath = "src/context/ThemeContext.tsx"
with open(filepath, "r") as f:
    code = f.read()

toggle_fn = '''  const toggleTheme = useCallback(() => {
    userChoseRef.current = true;
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("theme", next);
        window.history.replaceState({}, "", url.toString());
      }
      return next;
    });
  }, []);'''

code = re.sub(
    r'const toggleTheme = useCallback\(\(\) => \{\s*userChoseRef\.current = true;\s*setTheme\(\(t\) => \(t === "dark" \? "light" : "dark"\)\);\s*\}, \[\]\);',
    toggle_fn,
    code
)

with open(filepath, "w") as f:
    f.write(code)
