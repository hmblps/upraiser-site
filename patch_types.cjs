const fs = require('fs');
let code = fs.readFileSync('src/components/solutions/Phone3D.tsx', 'utf8');

code = code.replace(
  /type Phone3DProps = \{/,
  'type Phone3DProps = {\n  active?: boolean;\n  flat?: boolean;'
);

code = code.replace(
  /export const Phone3D = memo\(function Phone3D\(\{\n  mode,\n  formatId,\n  entranceProgress,\n  className,\n\}: Phone3DProps\) \{/,
  'export const Phone3D = memo(function Phone3D({\n  mode,\n  formatId,\n  entranceProgress,\n  className,\n  active,\n  flat,\n}: Phone3DProps) {'
);

fs.writeFileSync('src/components/solutions/Phone3D.tsx', code);
