import fs from 'fs';
import { execSync } from 'child_process';

const code = `
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// We can't easily load GLB in node without a canvas environment.
// Let's just output the gltfjsx and read the nodes.
`;
