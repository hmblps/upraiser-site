import fs from 'fs';

const path = 'src/components/channel-visuals/Macbook3DModel.tsx';
const content = fs.readFileSync(path, 'utf8');

const lines = content.split('\n');

const lightStart = lines.findIndex(l => l.includes('{!isDark && ('));
const darkStart = lines.findIndex(l => l.includes('{isDark && ('));

const modelStart = lines.findIndex(l => l.includes('export function Model'));
const modelEnd = lines.length;

const lightContent = lines.slice(lightStart + 1, darkStart - 1).join('\n');
const darkContent = lines.slice(darkStart + 1, modelEnd - 4).join('\n');

const newModel = `
function MacbookLight({ nodes }: { nodes: any }) {
  return (
${lightContent}
  );
}

function MacbookDark({ nodes }: { nodes: any }) {
  return (
${darkContent}
  );
}

export function Model(props: ThreeElements['group'] & { mode?: SiteMode }) {
  const { nodes } = useGLTF('/channels/oem/macbook-draco.glb') as any;

  const { theme } = useTheme();
  const isDark = props.mode === "hacker" || theme === "dark";

  return (
    <group {...props} dispose={null}>
      {!isDark ? <MacbookLight nodes={nodes} /> : <MacbookDark nodes={nodes} />}
    </group>
  );
}

useGLTF.preload('/channels/oem/macbook-draco.glb');
`;

const filePrefix = lines.slice(0, modelStart).join('\n');

fs.writeFileSync(path, filePrefix + '\n' + newModel);
