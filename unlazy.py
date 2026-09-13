with open("src/components/solutions/ProgrammaticScrollSection.tsx", "r") as f:
    code = f.read()

code = code.replace(
    'const Phone3D = lazy(() => import("./Phone3D").then((m) => ({ default: m.Phone3D })));',
    'import { Phone3D } from "./Phone3D";'
)
code = code.replace(
    'const Tablet3D = lazy(() =>\n  import("../channel-visuals/Tablet3D").then((m) => ({ default: m.Tablet3D })),\n);',
    'import { Tablet3D } from "../channel-visuals/Tablet3D";'
)
code = code.replace(
    'const Tv3D = lazy(() => import("../channel-visuals/Tv3D").then((m) => ({ default: m.Tv3D })));',
    'import { Tv3D } from "../channel-visuals/Tv3D";'
)
code = code.replace(
    'const Tablet3D = lazy(() => import("../channel-visuals/Tablet3D").then((m) => ({ default: m.Tablet3D })));',
    'import { Tablet3D } from "../channel-visuals/Tablet3D";'
)

with open("src/components/solutions/ProgrammaticScrollSection.tsx", "w") as f:
    f.write(code)

