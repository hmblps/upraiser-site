const fs = require('fs');

const path = 'src/components/channel-visuals/Macbook3DModel.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
`export function Model(props: ThreeElements['group'] & { mode?: SiteMode }) {
  const { nodes } = useGLTF('/channels/oem/macbook-draco.glb') as any;

  const { theme } = useTheme();
  const isDark = props.mode === "hacker" || theme === "dark";`,
`export function Model(props: ThreeElements['group'] & { mode?: SiteMode }) {
  const { nodes } = useGLTF('/channels/oem/macbook-draco.glb') as any;

  const isDark = props.mode !== "growth";`
);

fs.writeFileSync(path, content);
