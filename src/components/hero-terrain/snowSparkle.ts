import type { MeshPhysicalMaterial, MeshStandardMaterial, Texture, WebGLProgramParametersWithUniforms } from "three";

export type SnowSplatMaps = {
  color: Texture;
  normal: Texture;
  rough: Texture;
  rockColor: Texture;
  rockNormal: Texture;
  debrisColor: Texture;
  debrisNormal: Texture;
};

/**
 * Slope splat: photogrammetry base + Poly Haven snow_02 (triplanar).
 * UV tiling stretches on cliffs — world-space triplanar does not.
 */
export function applySnowSparkle(
  mat: MeshStandardMaterial | MeshPhysicalMaterial,
  maps?: SnowSplatMaps,
) {
  const uSparkle = { value: 1 };

  mat.userData.uSparkle = uSparkle;
  mat.customProgramCacheKey = () => (maps ? "everest-snow-poly-v25" : "everest-snow-montfort-v24");
  mat.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uSparkle = uSparkle;
    if (maps) {
      shader.uniforms.uSnowColor = { value: maps.color };
      shader.uniforms.uSnowNormal = { value: maps.normal };
      shader.uniforms.uSnowRough = { value: maps.rough };
      shader.uniforms.uRockColor = { value: maps.rockColor };
      shader.uniforms.uRockNormal = { value: maps.rockNormal };
      shader.uniforms.uDebrisColor = { value: maps.debrisColor };
      shader.uniforms.uDebrisNormal = { value: maps.debrisNormal };
    }

    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        varying vec3 vSparkleWorld;
        varying vec3 vWorldN;`,
      )
      .replace(
        "#include <defaultnormal_vertex>",
        `#include <defaultnormal_vertex>
        vWorldN = normalize(mat3(modelMatrix) * objectNormal);`,
      )
      .replace(
        "#include <project_vertex>",
        `#include <project_vertex>
        vSparkleWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;`,
      );

    const splatUniforms = maps
      ? `
        uniform sampler2D uSnowColor;
        uniform sampler2D uSnowNormal;
        uniform sampler2D uSnowRough;
        uniform sampler2D uRockColor;
        uniform sampler2D uRockNormal;
        uniform sampler2D uDebrisColor;
        uniform sampler2D uDebrisNormal;

        vec4 triplanarSample(sampler2D tex, vec3 wp, vec3 blend, float scale) {
          return texture2D(tex, wp.zy * scale) * blend.x
            + texture2D(tex, wp.xz * scale) * blend.y
            + texture2D(tex, wp.xy * scale) * blend.z;
        }
      `
      : "";

    const splatBody = maps
      ? `
        // ТРИПЛАНАРНАЯ ТЕКСТУРА СНЕГА (Snow005)
        float snowTile = 0.08;
        vec3 polySnow = triplanarSample(uSnowColor, wp, blend, snowTile).rgb;
        
        // Смешиваем чистый процедурный базовый цвет с деталями текстуры Snow005
        // Убрали * 1.2, чтобы не выжигать снег до белого пятна
        occludedSnow = mix(occludedSnow, polySnow, 0.6);

        vec3 pn = triplanarSample(uSnowNormal, wp, blend, snowTile).xyz * 2.0 - 1.0;
        normal = normalize(normal + vec3(pn.xy, 0.0) * finalSnowMask * 0.55);

        float polyRough = triplanarSample(uSnowRough, wp, blend, snowTile).g;
        roughnessFactor = mix(roughnessFactor, mix(0.78, polyRough, 0.8), finalSnowMask);
      `
      : "";

    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uSparkle;
        varying vec3 vSparkleWorld;
        varying vec3 vWorldN;
        ${splatUniforms}

        float sparkleHash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float snowCrust(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = sparkleHash(i);
          float b = sparkleHash(i + vec2(1.0, 0.0));
          float c = sparkleHash(i + vec2(0.0, 1.0));
          float d = sparkleHash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float snowFbm(vec2 p) {
          return snowCrust(p) * 0.52
            + snowCrust(p * 2.13 + 3.1) * 0.32
            + snowCrust(p * 4.81 + 8.4) * 0.16;
        }

        float triFbm(vec3 wp, vec3 blend, float scale) {
          return snowFbm(wp.zy * scale) * blend.x
            + snowFbm(wp.xz * scale) * blend.y
            + snowFbm(wp.xy * scale) * blend.z;
        }`,
      )
      .replace(
        "#include <normal_fragment_maps>",
        `#include <normal_fragment_maps>
        vec3 wn = normalize(vWorldN);
        vec3 wp = vSparkleWorld;
        float nUp = saturate(wn.y);
        float dist = length(cameraPosition - wp);
        float close = 1.0 - smoothstep(28.0, 160.0, dist);
        float originalLuma = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
        float slopeSnow = smoothstep(0.45, 0.75, nUp);
        float altitude = smoothstep(-18.0, 36.0, wp.y);
        
        // 1. Вычисляем базовый уклон и Luma-маску
        float lumaMask = smoothstep(0.10, 0.35, originalLuma);
        
        // 2. Генерируем макро-шум ветра (используем triFbm для бесшовного 3D шума)
        // Масштаб 0.02 дает крупные пятна эрозии
        float windNoise = triFbm(wp, wn, 0.02);
        
        // 3. Рваная маска снега: ветер сдувает снег с некоторых пологих участков
        // mix(0.5, 1.0, windNoise) означает, что местами плотность снега упадет до 50%
        float erodedSlope = slopeSnow * mix(0.5, 1.0, windNoise);
        
        // 4. Собираем финальную базу, где максимальная плотность тоже дробится ветром
        float maxSnowOpacity = mix(0.75, 0.95, windNoise); 
        float baseSnowMask = mix(lumaMask, maxSnowOpacity, erodedSlope);

        // 5. Применяем высотность (на пике снега больше)
        float snowMask = baseSnowMask * mix(0.82, 1.08, altitude);

        // Защита от пересвета
        snowMask = clamp(snowMask, 0.0, 1.0);
        float rockMask = saturate(1.0 - snowMask) * smoothstep(0.80, 0.46, nUp);

        // Noise-perturbed Triplanar: ломаем геометрические швы на стыке осей
        vec3 noiseOffset = vec3(
            fract(sin(dot(wp, vec3(12.9898, 78.233, 45.164))) * 43758.5453),
            fract(sin(dot(wp, vec3(93.9898, 28.233, 23.164))) * 43758.5453),
            fract(sin(dot(wp, vec3(41.9898, 62.233, 81.164))) * 43758.5453)
        ) * 0.04;

        // Добавляем шум к весам нормалей перед возведением в степень
        vec3 blend = abs(wn) + noiseOffset;
        blend = pow(blend, vec3(16.0));
        blend /= (blend.x + blend.y + blend.z + 1.0e-5);

        float snowScale = 20.0;
        float grain = triFbm(wp, blend, snowScale);
        vec2 flowUv = vec2(wp.x * 2.4 + wp.z * 0.55, wp.y * 24.0);
        float gully = snowFbm(flowUv);
        float flowDx = snowFbm(flowUv + vec2(0.08, 0.0)) - snowFbm(flowUv - vec2(0.08, 0.0));
        float flowDy = snowFbm(flowUv + vec2(0.0, 0.08)) - snowFbm(flowUv - vec2(0.0, 0.08));
        normal = normalize(normal + vec3(flowDx, flowDy * 1.85, 0.0) * rockMask * mix(0.05, 0.2, close));

        float sugarScale = 12.0;
        vec2 sugarUv = wp.xz * sugarScale + wn.xy * 8.0 + vec2(wp.y * 0.35, wp.y * 0.51);
        float snowGrain = sparkleHash(sugarUv);
        float snowGrainFine = sparkleHash(wp.xz * 36.0 + wn.xy * 14.0 + vec2(wp.y * 0.9, wp.z * 0.4));
        // Вычисляем угол Френеля для эффекта Subsurface Scattering (просвечивание по краям)
        vec3 worldView = normalize(cameraPosition - wp);
        float ndotv = max(dot(worldView, wn), 0.0);
        float fresnelGlow = pow(1.0 - ndotv, 3.0);
        
        // Физически корректное альбедо снега + кинематографичное свечение на гранях (SSS)
        vec3 pureSnowColor = vec3(0.85, 0.88, 0.92) * mix(0.85, 1.0, snowGrain);
        pureSnowColor += fresnelGlow * 0.25; // Добавляем объем по краям
        
        vec3 shadowSnowColor = vec3(0.72, 0.80, 0.88);
        // 1. Уточняем маску снега по уклону (slope = wn.y)
        // Смягчаем маску снегопада, убивая вертикальные полосы от геометрии
        float cleanSlopeMask = smoothstep(0.3, 0.55, wn.y);
        
        // Добавляем трипланарный шум, чтобы разорвать полосы
        float stripeKiller = fract(sin(dot(wp.xz * 15.0, vec2(12.9898, 78.233))) * 43758.5453);
        cleanSlopeMask = clamp(cleanSlopeMask + (stripeKiller - 0.5) * 0.08, 0.0, 1.0);
        
        float strictSnowMask = snowMask * cleanSlopeMask;

        // Базовый цвет снега
        vec3 baseSnow = pureSnowColor;
        float subsurfaceScattering = fract(sin(dot(wp.xz * 250.0, vec2(12.9898, 78.233))) * 43758.5453);
        baseSnow -= vec3(subsurfaceScattering * 0.03); 
        
        vec3 occludedSnow = baseSnow;
        float finalSnowMask = strictSnowMask;
        
        ${splatBody}
        
        // ВОЗВРАЩАЕМ ГЛУБОКИЕ ТЕНИ ПОВЕРХ ТЕКСТУРЫ
        // Уходим от грязных серых теней к холодным синеватым ледяным теням, 
        // имитирующим рассеянный свет неба (Rayleigh scattering)
        // Делаем тени текстуры менее "неоново-синими" и более нейтральными.
        float snowShadow = smoothstep(0.0, 0.20, originalLuma);
        snowShadow = pow(snowShadow, 2.2); 
        
        // ФИКС: Отменяем фейковую тень на пологих склонах!
        // Если это плоский снег (slopeSnow ~ 1.0), тень от текстуры не применяется, 
        // работает только физическое солнце.
        snowShadow = mix(snowShadow, 1.0, slopeSnow);
        
        vec3 icyShadowColor = vec3(0.72, 0.78, 0.88) * pureSnowColor;
        occludedSnow = mix(icyShadowColor, occludedSnow, snowShadow);
        
        // Применяем снег жестко, перекрывая базу
        diffuseColor.rgb = mix(diffuseColor.rgb, occludedSnow, strictSnowMask);

        float steepRockMask = smoothstep(0.85, 0.25, nUp);
        float rockCrunch = mix(gully, snowGrain, 0.45);
        vec3 sharpRockColor = diffuseColor.rgb;

        ${maps ? `
        // ТРИПЛАНАРНАЯ ТЕКСТУРА СКАЛЫ (ФОТОРЕАЛИЗМ)
        // СТРОГИЙ СТАБИЛЬНЫЙ МИРОВОЙ МАСШТАБ (никаких dFdx, текстура стоит намертво)
        float stableRockScale = 0.12;
        
        vec3 detailRockColor = triplanarSample(uRockColor, wp, blend, stableRockScale).rgb;
        vec3 detailRockNormal = triplanarSample(uRockNormal, wp, blend, stableRockScale).rgb;
        
        // ФЕЙКОВЫЙ МИКРО-РЕЛЬЕФ (Cavity) из карты нормалей
        float rockCavity = detailRockNormal.b;
        detailRockColor *= pow(rockCavity, 3.0) * 1.5;
        
        // ОХЛАЖДАЕМ СКАЛЫ (Убираем теплый коричневый цвет)
        // Переводим в холодный сине-серый альпийский сланец
        vec3 coldSlateColor = dot(detailRockColor, vec3(0.299, 0.587, 0.114)) * vec3(0.75, 0.85, 0.95);
        detailRockColor = mix(detailRockColor, coldSlateColor, 0.85); // Сильно уводим в холодный тон
        
        // ЛОМАЕМ ТАЙЛИНГ (Triplanar Tiling Trap)
        // Используем низкочастотный triFbm чтобы создать пятна разной яркости
        float tilingBreaker = triFbm(wp, blend, 2.0);
        detailRockColor *= mix(0.6, 1.4, tilingBreaker);
        
        // --- НОВЫЙ СЛОЙ ОСЫПИ (DEBRIS) ---
        // 1. Создаем маску для переходных (косых) зон, где геометрия обычно "мажется"
        float transitionZone = smoothstep(0.2, 0.4, nUp) * (1.0 - smoothstep(0.5, 0.7, nUp));

        // 2. Сэмплим нашу третью текстуру (мелкая крошка / осыпь)
        vec3 debrisColor = triplanarSample(uDebrisColor, wp, blend, 0.4).rgb;

        // 3. Затыкаем эти проблемные зоны промежуточным слоем
        detailRockColor = mix(detailRockColor, debrisColor * 0.8, transitionZone);

        // ЖЕСТКАЯ ЗАМЕНА (Убиваем мыло)
        sharpRockColor = detailRockColor;

        // Нормалмапа скалы + нормалмапа осыпи
        vec3 debrisNormal = triplanarSample(uDebrisNormal, wp, blend, 0.4).rgb;
        detailRockNormal = mix(detailRockNormal, debrisNormal, transitionZone);
        vec3 rockN = detailRockNormal * 2.0 - 1.0;
        normal = normalize(normal + vec3(rockN.xy, 0.0) * (1.0 - strictSnowMask));
        ` : `
        // ПРОЦЕДУРНАЯ СКАЛА (ЕСЛИ НЕТ ТЕКСТУР)
        float rockDetail = triFbm(wp, blend, 28.0);
        float crispness = smoothstep(0.35, 0.85, rockDetail);
        crispness = mix(0.5, crispness, close);
        sharpRockColor = diffuseColor.rgb * mix(0.6, 1.4, crispness);
        `}
        
        // 5. Жесткое разделение: скалы (sharpRockColor) или чистый снег (occludedSnow)
        // СКАЛА ПОЯВЛЯЕТСЯ ТОЛЬКО НА ОБРЫВАХ И СРЕДНИХ СКЛОНАХ
        steepRockMask = smoothstep(0.6, 0.15, nUp);
        
        vec3 baseRock = mix(diffuseColor.rgb, sharpRockColor, steepRockMask);
        diffuseColor.rgb = mix(baseRock, occludedSnow, strictSnowMask);
        
        // Возвращаем снегу ледяную корку (glint). Вместо плоского матового 0.95
        // используем более низкий roughness + шум, чтобы солнце могло рисовать жесткие блики.
        float iceRoughness = mix(0.55, 0.85, snowGrainFine);
        roughnessFactor = mix(roughnessFactor, iceRoughness, strictSnowMask);
        
        float glitter = 0.0; // Фикс для компилятора

        float rawFresnel = 1.0 - ndotv;
        float fresnel = pow(rawFresnel, 2.0) * smoothstep(0.0, 0.15, ndotv);
        
        float mist = fresnel * altitude * (0.28 + 0.5 * strictSnowMask);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.97, 0.98, 1.0), mist * 0.14);
        float silhouette = smoothstep(0.58, 0.98, rawFresnel) * mix(0.55, 1.0, smoothstep(190.0, 270.0, dist));
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.97, 0.985, 1.0), silhouette * 0.38);`,
      )
      .replace(
        "#include <lights_physical_fragment>",
        `#include <lights_physical_fragment>`
      );
  };
}
