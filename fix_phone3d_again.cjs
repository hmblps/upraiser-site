const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

// 1. Import DeviceLoadStage
if (!code.includes('import { DeviceLoadStage }')) {
  code = code.replace(
    /import type \{ MotionValue \} from "framer-motion";/,
    'import type { MotionValue } from "framer-motion";\nimport { DeviceLoadStage } from "./DeviceLoadStage";'
  );
}

// 2. Add flat to Phone3D args
code = code.replace(
  /export const Phone3D = memo\(function Phone3D\(\{ mode, formatId, entranceProgress, className \}: Phone3DProps\) \{/,
  'export const Phone3D = memo(function Phone3D({ mode, formatId, entranceProgress, className, flat = false }: Phone3DProps) {'
);

// 3. Remove AnimatePresence import
code = code.replace(/AnimatePresence, /, '');

// 4. Remove CssFormatPhone entirely
code = code.replace(
  /\/\*\*[\s\S]*?function CssFormatPhone[\s\S]*?\}\n/g,
  ''
);

// 5. Update PhoneScene to take `flat` since we passed it in the JSX
code = code.replace(
  /onMeshReady\?: \(\) => void;\n\}\) \{/,
  'onMeshReady?: () => void;\n  flat?: boolean;\n}) {'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
