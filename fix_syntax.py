import re

filepath = "src/components/channel-visuals/Tablet3D.tsx"
with open(filepath, "r") as f:
    code = f.read()

# Replace </div>\n    </div>\n  );\n} with </div></div>\n    </div>\n  );\n}
code = code.replace(
    '        ) : null}\n      </div>\n    </div>\n  );\n}',
    '        ) : null}\n      </div></div>\n    </div>\n  );\n}'
)

with open(filepath, "w") as f:
    f.write(code)
