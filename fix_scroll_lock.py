with open("src/components/ChannelsLoader.tsx", "r") as f:
    code = f.read()

if "document.body.style.overflow = 'hidden';" not in code:
    code = code.replace(
        "const [show, setShow] = useState(true);",
        "const [show, setShow] = useState(true);\n\n  useEffect(() => {\n    if (show) {\n      document.body.style.overflow = 'hidden';\n      document.documentElement.style.overflow = 'hidden';\n    } else {\n      document.body.style.overflow = '';\n      document.documentElement.style.overflow = '';\n    }\n    return () => {\n      document.body.style.overflow = '';\n      document.documentElement.style.overflow = '';\n    };\n  }, [show]);"
    )

with open("src/components/ChannelsLoader.tsx", "w") as f:
    f.write(code)
