import * as THREE from 'three';
import fs from 'fs';

const startPos = [-4, 12, 188];
const midPos = [-2, 38, 140];
const endPos = [-10, 72, 122];

const startLook = [18, 28, -28];
const midLook = [14, 10, -40];
const endLook = [12, 16, -68];

const startFov = 46;
const midFov = 40;
const endFov = 34;

const posCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(...startPos),
  new THREE.Vector3(...midPos),
  new THREE.Vector3(...endPos),
]);

const lookCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(...startLook),
  new THREE.Vector3(...midLook),
  new THREE.Vector3(...endLook),
]);

const numFrames = 150;
const framesData = [];

for (let i = 0; i < numFrames; i++) {
  const t = i / (numFrames - 1);
  const pos = posCurve.getPoint(t);
  const look = lookCurve.getPoint(t);
  
  let fov = 0;
  if (t < 0.5) {
    const localT = t / 0.5;
    fov = THREE.MathUtils.lerp(startFov, midFov, localT);
  } else {
    const localT = (t - 0.5) / 0.5;
    fov = THREE.MathUtils.lerp(midFov, endFov, localT);
  }
  
  framesData.push({ frame: i + 1, pos, look, fov });
}

let py = `import bpy
import math

# Create camera
cam_data = bpy.data.cameras.new(name="HeroCamera")
cam_obj = bpy.data.objects.new("HeroCamera", cam_data)
bpy.context.scene.collection.objects.link(cam_obj)
bpy.context.scene.camera = cam_obj

# Create a look-at target
target_data = bpy.data.objects.new("HeroTarget", None)
bpy.context.scene.collection.objects.link(target_data)

# Add Track To constraint
track = cam_obj.constraints.new(type='TRACK_TO')
track.target = target_data
track.track_axis = 'TRACK_NEGATIVE_Z'
track.up_axis = 'UP_Y'

# Set scene frame range
bpy.context.scene.frame_start = 1
bpy.context.scene.frame_end = ${numFrames}

`;

framesData.forEach(d => {
  py += `
# Frame ${d.frame}
bpy.context.scene.frame_set(${d.frame})
cam_obj.location = (${d.pos.x}, ${d.pos.y}, ${d.pos.z})
cam_obj.keyframe_insert(data_path="location", index=-1)

target_data.location = (${d.look.x}, ${d.look.y}, ${d.look.z})
target_data.keyframe_insert(data_path="location", index=-1)

cam_data.angle_y = math.radians(${d.fov})
cam_data.keyframe_insert(data_path="lens", index=-1)
`;
});

fs.writeFileSync('import-camera.py', py);
console.log("Created import-camera.py! Run this script in Blender's Text Editor.");
