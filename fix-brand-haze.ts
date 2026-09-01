import fs from "fs";
let content = fs.readFileSync("src/components/hero-terrain/BrandHazeSky.tsx", "utf-8");

const oldShader = `            vec3 dir = normalize(vWorldPos - cameraPosition);
            float h = dir.y;
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.08, 0.32, h));
            col = mix(col, uZenith, smoothstep(0.22, 0.92, h));
            float sun = pow(max(dot(dir, uSunDir), 0.0), 5.5);
            float halo = pow(max(dot(dir, uSunDir), 0.0), 1.45);
            vec3 warm = vec3(1.0, 0.82, 0.62);
            vec3 cool = uGlow;
            vec3 violet = vec3(0.78, 0.72, 1.0);
            vec3 prism = mix(cool, warm, sun);
            prism = mix(prism, violet, halo * 0.35);
            col += prism * (sun * 0.32 + halo * 0.12);
            col = mix(col, uZenith, 0.05);
            
            // If in expedition mode, just output the fog color to seamlessly blend with the blizzard!
            gl_FragColor = vec4(mix(col, uFogColor, uLite), 1.0);`;

const newShader = `            vec3 dir = normalize(vWorldPos - cameraPosition);
            float h = dir.y;
            
            // Normal base sky
            vec3 col = mix(uHorizon, uMid, smoothstep(-0.08, 0.32, h));
            col = mix(col, uZenith, smoothstep(0.22, 0.92, h));
            
            // Expedition base sky (matches fog exactly at horizon, brightens at zenith)
            vec3 expCol = mix(uFogColor, mix(uFogColor, vec3(1.0), 0.5), smoothstep(-0.1, 0.7, h));
            
            col = mix(col, expCol, uLite);
            
            // Sun & Halo computation (always visible)
            float sun = pow(max(dot(dir, uSunDir), 0.0), 5.5);
            float halo = pow(max(dot(dir, uSunDir), 0.0), 1.45);
            vec3 warm = vec3(1.0, 0.82, 0.62);
            vec3 cool = uGlow;
            vec3 violet = vec3(0.78, 0.72, 1.0);
            vec3 prism = mix(cool, warm, sun);
            prism = mix(prism, violet, halo * 0.35);
            
            // Sun is slightly diffused in blizzard
            float sunIntensity = mix(1.0, 0.8, uLite);
            col += prism * (sun * 0.35 + halo * 0.15) * sunIntensity;
            
            col = mix(col, uZenith, 0.05);
            gl_FragColor = vec4(col, 1.0);`;

content = content.replace(oldShader, newShader);
fs.writeFileSync("src/components/hero-terrain/BrandHazeSky.tsx", content);
