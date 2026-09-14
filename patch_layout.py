import re

def patch_file(filepath):
    with open(filepath, "r") as f:
        code = f.read()

    code = code.replace(
        '<div className="test-bypass" style={{width: "100%", height: "100%"}}>',
        '<div className="prog-device-load"><div className="prog-device-load__canvas" style={{zIndex: 1}}>'
    )
    
    # Careful not to cause syntax error like last time
    code = code.replace(
        '        </Canvas>\n      </div>\n    </div>',
        '        </Canvas>\n      </div></div>\n    </div>'
    )
    code = code.replace(
        '        ) : null}\n      </div>\n    </div>',
        '        ) : null}\n      </div></div>\n    </div>'
    )
    
    with open(filepath, "w") as f:
        f.write(code)

patch_file("src/components/channel-visuals/Tv3D.tsx")
patch_file("src/components/channel-visuals/Tablet3D.tsx")
