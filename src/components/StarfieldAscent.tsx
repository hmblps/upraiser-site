import { memo } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const ASCENT_CSS = `
@keyframes ascentSlow {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, -50%, 0); }
}

@keyframes ascentFast {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(0, -50%, 0); }
}

.animate-ascent-slow {
  animation: ascentSlow 20s linear infinite;
  will-change: transform;
}

.animate-ascent-fast {
  animation: ascentFast 12s linear infinite;
  will-change: transform;
}
`;

function StarfieldAscentComponent() {
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style>{ASCENT_CSS}</style>

      {/* Layer 1: Deep slow-moving celestial dust (distant stars) */}
      <div className={`absolute inset-x-0 top-0 h-[200%] ${reduced ? "" : "animate-ascent-slow"}`}>
        <svg className="w-full h-1/2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="63.5%" cy="3.9%" r="0.87" fill="#ffffff" opacity="0.26" />
          <circle cx="11.4%" cy="73.3%" r="1.03" fill="#e0e8ff" opacity="0.37" />
          <circle cx="4.4%" cy="22.7%" r="1.0" fill="#ffffff" opacity="0.42" />
          <circle cx="71.0%" cy="69.5%" r="0.95" fill="#f0f4ff" opacity="0.44" />
          <circle cx="80.0%" cy="2.1%" r="1.18" fill="#e0e8ff" opacity="0.37" />
          <circle cx="28.5%" cy="22.4%" r="1.16" fill="#ffffff" opacity="0.24" />
          <circle cx="10.9%" cy="83.7%" r="1.06" fill="#ffffff" opacity="0.49" />
          <circle cx="53.5%" cy="95.9%" r="0.93" fill="#e0e8ff" opacity="0.32" />
          <circle cx="62.5%" cy="87.4%" r="0.92" fill="#ffffff" opacity="0.48" />
          <circle cx="5.9%" cy="23.6%" r="0.87" fill="#ffffff" opacity="0.54" />
          <circle cx="85.5%" cy="38.4%" r="0.97" fill="#f0f4ff" opacity="0.27" />
          <circle cx="36.0%" cy="66.5%" r="1.12" fill="#e0e8ff" opacity="0.46" />
          <circle cx="60.6%" cy="18.1%" r="1.14" fill="#ffffff" opacity="0.38" />
          <circle cx="27.7%" cy="91.3%" r="1.11" fill="#ffffff" opacity="0.47" />
          <circle cx="83.3%" cy="76.8%" r="0.84" fill="#ffffff" opacity="0.52" />
          <circle cx="40.4%" cy="7.9%" r="1.25" fill="#e0e8ff" opacity="0.55" />
          <circle cx="32.0%" cy="65.1%" r="0.94" fill="#e0e8ff" opacity="0.38" />
          <circle cx="27.2%" cy="25.4%" r="1.04" fill="#f0f4ff" opacity="0.5" />
          <circle cx="43.1%" cy="58.1%" r="0.92" fill="#ffffff" opacity="0.4" />
          <circle cx="10.3%" cy="6.1%" r="0.77" fill="#e0e8ff" opacity="0.26" />
          <circle cx="67.5%" cy="59.4%" r="0.93" fill="#e0e8ff" opacity="0.6" />
          <circle cx="52.8%" cy="95.7%" r="1.22" fill="#ffffff" opacity="0.47" />
          <circle cx="12.6%" cy="87.3%" r="1.15" fill="#e0e8ff" opacity="0.34" />
          <circle cx="30.0%" cy="16.8%" r="0.7" fill="#e0e8ff" opacity="0.55" />
          <circle cx="27.0%" cy="50.1%" r="0.81" fill="#ffffff" opacity="0.55" />
          <circle cx="30.4%" cy="63.5%" r="1.07" fill="#ffffff" opacity="0.35" />
          <circle cx="17.2%" cy="94.0%" r="1.25" fill="#ffffff" opacity="0.44" />
          <circle cx="48.9%" cy="12.4%" r="0.92" fill="#f0f4ff" opacity="0.3" />
          <circle cx="24.9%" cy="56.5%" r="0.75" fill="#e0e8ff" opacity="0.39" />
          <circle cx="8.2%" cy="75.3%" r="1.16" fill="#ffffff" opacity="0.46" />
          <circle cx="93.3%" cy="17.5%" r="1.02" fill="#e0e8ff" opacity="0.37" />
          <circle cx="22.0%" cy="53.8%" r="1.14" fill="#ffffff" opacity="0.49" />
          <circle cx="40.2%" cy="66.7%" r="0.92" fill="#e0e8ff" opacity="0.38" />
          <circle cx="25.5%" cy="7.7%" r="0.71" fill="#e0e8ff" opacity="0.29" />
          <circle cx="22.9%" cy="8.4%" r="1.08" fill="#ffffff" opacity="0.23" />
          <circle cx="4.5%" cy="33.6%" r="1.01" fill="#f0f4ff" opacity="0.47" />
          <circle cx="22.3%" cy="14.3%" r="1.26" fill="#e0e8ff" opacity="0.43" />
          <circle cx="25.1%" cy="47.4%" r="0.94" fill="#ffffff" opacity="0.24" />
          <circle cx="43.3%" cy="42.6%" r="0.98" fill="#e0e8ff" opacity="0.22" />
          <circle cx="64.9%" cy="64.2%" r="0.74" fill="#e0e8ff" opacity="0.34" />
          <circle cx="85.1%" cy="25.6%" r="0.81" fill="#f0f4ff" opacity="0.26" />
          <circle cx="19.3%" cy="46.4%" r="1.22" fill="#ffffff" opacity="0.38" />
          <circle cx="85.1%" cy="54.9%" r="0.73" fill="#e0e8ff" opacity="0.53" />
          <circle cx="95.5%" cy="91.4%" r="1.21" fill="#ffffff" opacity="0.36" />
          <circle cx="48.2%" cy="85.4%" r="1.24" fill="#ffffff" opacity="0.35" />
          <circle cx="97.1%" cy="27.2%" r="1.17" fill="#f0f4ff" opacity="0.31" />
          <circle cx="69.1%" cy="72.4%" r="1.17" fill="#e0e8ff" opacity="0.49" />
          <circle cx="16.5%" cy="30.3%" r="1.28" fill="#e0e8ff" opacity="0.49" />
          <circle cx="7.4%" cy="31.9%" r="0.73" fill="#f0f4ff" opacity="0.4" />
          <circle cx="84.2%" cy="16.8%" r="1.28" fill="#ffffff" opacity="0.54" />
          <circle cx="8.1%" cy="8.1%" r="1.22" fill="#f0f4ff" opacity="0.25" />
          <circle cx="87.9%" cy="25.4%" r="1.06" fill="#e0e8ff" opacity="0.23" />
          <circle cx="65.3%" cy="56.3%" r="0.89" fill="#f0f4ff" opacity="0.28" />
          <circle cx="71.0%" cy="24.7%" r="0.94" fill="#e0e8ff" opacity="0.46" />
          <circle cx="45.9%" cy="91.6%" r="1.26" fill="#ffffff" opacity="0.38" />
          <circle cx="98.4%" cy="98.1%" r="0.74" fill="#ffffff" opacity="0.4" />
          <circle cx="14.3%" cy="35.4%" r="0.74" fill="#ffffff" opacity="0.35" />
          <circle cx="16.8%" cy="82.4%" r="1.12" fill="#e0e8ff" opacity="0.59" />
          <circle cx="79.8%" cy="52.8%" r="1.1" fill="#e0e8ff" opacity="0.32" />
          <circle cx="65.8%" cy="92.6%" r="0.78" fill="#ffffff" opacity="0.56" />
          <circle cx="73.5%" cy="16.6%" r="0.87" fill="#ffffff" opacity="0.49" />
          <circle cx="21.2%" cy="63.0%" r="0.86" fill="#f0f4ff" opacity="0.3" />
          <circle cx="89.6%" cy="6.4%" r="1.08" fill="#f0f4ff" opacity="0.22" />
          <circle cx="33.9%" cy="14.2%" r="1.29" fill="#ffffff" opacity="0.5" />
          <circle cx="55.0%" cy="43.0%" r="0.71" fill="#ffffff" opacity="0.58" />
          <circle cx="68.5%" cy="16.0%" r="0.72" fill="#f0f4ff" opacity="0.43" />
          <circle cx="15.9%" cy="13.9%" r="0.88" fill="#ffffff" opacity="0.56" />
          <circle cx="21.9%" cy="25.7%" r="0.76" fill="#e0e8ff" opacity="0.55" />
          <circle cx="40.9%" cy="61.7%" r="0.79" fill="#ffffff" opacity="0.55" />
          <circle cx="96.2%" cy="80.1%" r="1.23" fill="#ffffff" opacity="0.27" />
          <circle cx="91.2%" cy="77.4%" r="0.95" fill="#e0e8ff" opacity="0.55" />
          <circle cx="80.1%" cy="27.4%" r="1.17" fill="#ffffff" opacity="0.35" />
          <circle cx="5.3%" cy="47.2%" r="0.82" fill="#f0f4ff" opacity="0.34" />
          <circle cx="81.1%" cy="86.0%" r="0.83" fill="#e0e8ff" opacity="0.28" />
          <circle cx="33.3%" cy="85.3%" r="1.28" fill="#f0f4ff" opacity="0.34" />
          <circle cx="50.9%" cy="67.4%" r="1.21" fill="#f0f4ff" opacity="0.58" />
          <circle cx="12.7%" cy="95.6%" r="0.81" fill="#f0f4ff" opacity="0.22" />
          <circle cx="59.4%" cy="35.0%" r="1.17" fill="#f0f4ff" opacity="0.44" />
          <circle cx="51.1%" cy="38.9%" r="1.05" fill="#f0f4ff" opacity="0.22" />
          <circle cx="43.8%" cy="51.9%" r="1.18" fill="#e0e8ff" opacity="0.49" />
          <circle cx="73.5%" cy="66.6%" r="0.92" fill="#ffffff" opacity="0.58" />
          <circle cx="90.8%" cy="61.9%" r="1.1" fill="#ffffff" opacity="0.49" />
          <circle cx="30.6%" cy="31.5%" r="0.95" fill="#f0f4ff" opacity="0.48" />
          <circle cx="55.3%" cy="20.1%" r="1.1" fill="#f0f4ff" opacity="0.47" />
          <circle cx="89.1%" cy="61.2%" r="0.88" fill="#e0e8ff" opacity="0.53" />
          <circle cx="31.0%" cy="21.9%" r="1.17" fill="#e0e8ff" opacity="0.46" />
          <circle cx="46.6%" cy="44.4%" r="0.83" fill="#f0f4ff" opacity="0.52" />
          <circle cx="94.6%" cy="72.9%" r="1.1" fill="#f0f4ff" opacity="0.41" />
          <circle cx="62.9%" cy="34.0%" r="1.19" fill="#ffffff" opacity="0.47" />
          <circle cx="23.3%" cy="20.8%" r="0.71" fill="#ffffff" opacity="0.59" />
        </svg>
        <svg className="w-full h-1/2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="63.5%" cy="3.9%" r="0.87" fill="#ffffff" opacity="0.26" />
          <circle cx="11.4%" cy="73.3%" r="1.03" fill="#e0e8ff" opacity="0.37" />
          <circle cx="4.4%" cy="22.7%" r="1.0" fill="#ffffff" opacity="0.42" />
          <circle cx="71.0%" cy="69.5%" r="0.95" fill="#f0f4ff" opacity="0.44" />
          <circle cx="80.0%" cy="2.1%" r="1.18" fill="#e0e8ff" opacity="0.37" />
          <circle cx="28.5%" cy="22.4%" r="1.16" fill="#ffffff" opacity="0.24" />
          <circle cx="10.9%" cy="83.7%" r="1.06" fill="#ffffff" opacity="0.49" />
          <circle cx="53.5%" cy="95.9%" r="0.93" fill="#e0e8ff" opacity="0.32" />
          <circle cx="62.5%" cy="87.4%" r="0.92" fill="#ffffff" opacity="0.48" />
          <circle cx="5.9%" cy="23.6%" r="0.87" fill="#ffffff" opacity="0.54" />
          <circle cx="85.5%" cy="38.4%" r="0.97" fill="#f0f4ff" opacity="0.27" />
          <circle cx="36.0%" cy="66.5%" r="1.12" fill="#e0e8ff" opacity="0.46" />
          <circle cx="60.6%" cy="18.1%" r="1.14" fill="#ffffff" opacity="0.38" />
          <circle cx="27.7%" cy="91.3%" r="1.11" fill="#ffffff" opacity="0.47" />
          <circle cx="83.3%" cy="76.8%" r="0.84" fill="#ffffff" opacity="0.52" />
          <circle cx="40.4%" cy="7.9%" r="1.25" fill="#e0e8ff" opacity="0.55" />
          <circle cx="32.0%" cy="65.1%" r="0.94" fill="#e0e8ff" opacity="0.38" />
          <circle cx="27.2%" cy="25.4%" r="1.04" fill="#f0f4ff" opacity="0.5" />
          <circle cx="43.1%" cy="58.1%" r="0.92" fill="#ffffff" opacity="0.4" />
          <circle cx="10.3%" cy="6.1%" r="0.77" fill="#e0e8ff" opacity="0.26" />
          <circle cx="67.5%" cy="59.4%" r="0.93" fill="#e0e8ff" opacity="0.6" />
          <circle cx="52.8%" cy="95.7%" r="1.22" fill="#ffffff" opacity="0.47" />
          <circle cx="12.6%" cy="87.3%" r="1.15" fill="#e0e8ff" opacity="0.34" />
          <circle cx="30.0%" cy="16.8%" r="0.7" fill="#e0e8ff" opacity="0.55" />
          <circle cx="27.0%" cy="50.1%" r="0.81" fill="#ffffff" opacity="0.55" />
          <circle cx="30.4%" cy="63.5%" r="1.07" fill="#ffffff" opacity="0.35" />
          <circle cx="17.2%" cy="94.0%" r="1.25" fill="#ffffff" opacity="0.44" />
          <circle cx="48.9%" cy="12.4%" r="0.92" fill="#f0f4ff" opacity="0.3" />
          <circle cx="24.9%" cy="56.5%" r="0.75" fill="#e0e8ff" opacity="0.39" />
          <circle cx="8.2%" cy="75.3%" r="1.16" fill="#ffffff" opacity="0.46" />
          <circle cx="93.3%" cy="17.5%" r="1.02" fill="#e0e8ff" opacity="0.37" />
          <circle cx="22.0%" cy="53.8%" r="1.14" fill="#ffffff" opacity="0.49" />
          <circle cx="40.2%" cy="66.7%" r="0.92" fill="#e0e8ff" opacity="0.38" />
          <circle cx="25.5%" cy="7.7%" r="0.71" fill="#e0e8ff" opacity="0.29" />
          <circle cx="22.9%" cy="8.4%" r="1.08" fill="#ffffff" opacity="0.23" />
          <circle cx="4.5%" cy="33.6%" r="1.01" fill="#f0f4ff" opacity="0.47" />
          <circle cx="22.3%" cy="14.3%" r="1.26" fill="#e0e8ff" opacity="0.43" />
          <circle cx="25.1%" cy="47.4%" r="0.94" fill="#ffffff" opacity="0.24" />
          <circle cx="43.3%" cy="42.6%" r="0.98" fill="#e0e8ff" opacity="0.22" />
          <circle cx="64.9%" cy="64.2%" r="0.74" fill="#e0e8ff" opacity="0.34" />
          <circle cx="85.1%" cy="25.6%" r="0.81" fill="#f0f4ff" opacity="0.26" />
          <circle cx="19.3%" cy="46.4%" r="1.22" fill="#ffffff" opacity="0.38" />
          <circle cx="85.1%" cy="54.9%" r="0.73" fill="#e0e8ff" opacity="0.53" />
          <circle cx="95.5%" cy="91.4%" r="1.21" fill="#ffffff" opacity="0.36" />
          <circle cx="48.2%" cy="85.4%" r="1.24" fill="#ffffff" opacity="0.35" />
          <circle cx="97.1%" cy="27.2%" r="1.17" fill="#f0f4ff" opacity="0.31" />
          <circle cx="69.1%" cy="72.4%" r="1.17" fill="#e0e8ff" opacity="0.49" />
          <circle cx="16.5%" cy="30.3%" r="1.28" fill="#e0e8ff" opacity="0.49" />
          <circle cx="7.4%" cy="31.9%" r="0.73" fill="#f0f4ff" opacity="0.4" />
          <circle cx="84.2%" cy="16.8%" r="1.28" fill="#ffffff" opacity="0.54" />
          <circle cx="8.1%" cy="8.1%" r="1.22" fill="#f0f4ff" opacity="0.25" />
          <circle cx="87.9%" cy="25.4%" r="1.06" fill="#e0e8ff" opacity="0.23" />
          <circle cx="65.3%" cy="56.3%" r="0.89" fill="#f0f4ff" opacity="0.28" />
          <circle cx="71.0%" cy="24.7%" r="0.94" fill="#e0e8ff" opacity="0.46" />
          <circle cx="45.9%" cy="91.6%" r="1.26" fill="#ffffff" opacity="0.38" />
          <circle cx="98.4%" cy="98.1%" r="0.74" fill="#ffffff" opacity="0.4" />
          <circle cx="14.3%" cy="35.4%" r="0.74" fill="#ffffff" opacity="0.35" />
          <circle cx="16.8%" cy="82.4%" r="1.12" fill="#e0e8ff" opacity="0.59" />
          <circle cx="79.8%" cy="52.8%" r="1.1" fill="#e0e8ff" opacity="0.32" />
          <circle cx="65.8%" cy="92.6%" r="0.78" fill="#ffffff" opacity="0.56" />
          <circle cx="73.5%" cy="16.6%" r="0.87" fill="#ffffff" opacity="0.49" />
          <circle cx="21.2%" cy="63.0%" r="0.86" fill="#f0f4ff" opacity="0.3" />
          <circle cx="89.6%" cy="6.4%" r="1.08" fill="#f0f4ff" opacity="0.22" />
          <circle cx="33.9%" cy="14.2%" r="1.29" fill="#ffffff" opacity="0.5" />
          <circle cx="55.0%" cy="43.0%" r="0.71" fill="#ffffff" opacity="0.58" />
          <circle cx="68.5%" cy="16.0%" r="0.72" fill="#f0f4ff" opacity="0.43" />
          <circle cx="15.9%" cy="13.9%" r="0.88" fill="#ffffff" opacity="0.56" />
          <circle cx="21.9%" cy="25.7%" r="0.76" fill="#e0e8ff" opacity="0.55" />
          <circle cx="40.9%" cy="61.7%" r="0.79" fill="#ffffff" opacity="0.55" />
          <circle cx="96.2%" cy="80.1%" r="1.23" fill="#ffffff" opacity="0.27" />
          <circle cx="91.2%" cy="77.4%" r="0.95" fill="#e0e8ff" opacity="0.55" />
          <circle cx="80.1%" cy="27.4%" r="1.17" fill="#ffffff" opacity="0.35" />
          <circle cx="5.3%" cy="47.2%" r="0.82" fill="#f0f4ff" opacity="0.34" />
          <circle cx="81.1%" cy="86.0%" r="0.83" fill="#e0e8ff" opacity="0.28" />
          <circle cx="33.3%" cy="85.3%" r="1.28" fill="#f0f4ff" opacity="0.34" />
          <circle cx="50.9%" cy="67.4%" r="1.21" fill="#f0f4ff" opacity="0.58" />
          <circle cx="12.7%" cy="95.6%" r="0.81" fill="#f0f4ff" opacity="0.22" />
          <circle cx="59.4%" cy="35.0%" r="1.17" fill="#f0f4ff" opacity="0.44" />
          <circle cx="51.1%" cy="38.9%" r="1.05" fill="#f0f4ff" opacity="0.22" />
          <circle cx="43.8%" cy="51.9%" r="1.18" fill="#e0e8ff" opacity="0.49" />
          <circle cx="73.5%" cy="66.6%" r="0.92" fill="#ffffff" opacity="0.58" />
          <circle cx="90.8%" cy="61.9%" r="1.1" fill="#ffffff" opacity="0.49" />
          <circle cx="30.6%" cy="31.5%" r="0.95" fill="#f0f4ff" opacity="0.48" />
          <circle cx="55.3%" cy="20.1%" r="1.1" fill="#f0f4ff" opacity="0.47" />
          <circle cx="89.1%" cy="61.2%" r="0.88" fill="#e0e8ff" opacity="0.53" />
          <circle cx="31.0%" cy="21.9%" r="1.17" fill="#e0e8ff" opacity="0.46" />
          <circle cx="46.6%" cy="44.4%" r="0.83" fill="#f0f4ff" opacity="0.52" />
          <circle cx="94.6%" cy="72.9%" r="1.1" fill="#f0f4ff" opacity="0.41" />
          <circle cx="62.9%" cy="34.0%" r="1.19" fill="#ffffff" opacity="0.47" />
          <circle cx="23.3%" cy="20.8%" r="0.71" fill="#ffffff" opacity="0.59" />
        </svg>
      </div>

      {/* Layer 2: Faster mid/near stars with brand accents (#FECF09, #e63558) */}
      <div className={`absolute inset-x-0 top-0 h-[200%] ${reduced ? "" : "animate-ascent-fast"}`}>
        <svg className="w-full h-1/2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60.8%" cy="76.0%" r="1.66" fill="#93c5fd" opacity="0.74" />
          <circle cx="71.2%" cy="38.7%" r="1.6" fill="#ffffff" opacity="0.78" />
          <circle cx="2.0%" cy="74.3%" r="1.97" fill="#ffffff" opacity="0.84" />
          <circle cx="22.7%" cy="79.5%" r="1.9" fill="#FECF09" opacity="0.48" />
          <circle cx="25.7%" cy="83.8%" r="1.66" fill="#FECF09" opacity="0.78" />
          <circle cx="97.3%" cy="59.3%" r="2.15" fill="#FECF09" opacity="0.76" />
          <circle cx="71.3%" cy="50.5%" r="2.03" fill="#e63558" opacity="0.67" />
          <circle cx="16.9%" cy="85.1%" r="1.65" fill="#ffffff" opacity="0.87" />
          <circle cx="28.4%" cy="76.9%" r="1.68" fill="#ffffff" opacity="0.59" />
          <circle cx="9.0%" cy="29.2%" r="1.47" fill="#ffffff" opacity="0.9" />
          <circle cx="9.3%" cy="16.1%" r="1.58" fill="#ffffff" opacity="0.8" />
          <circle cx="7.7%" cy="41.0%" r="1.74" fill="#FECF09" opacity="0.48" />
          <circle cx="82.3%" cy="39.3%" r="1.97" fill="#93c5fd" opacity="0.46" />
          <circle cx="86.9%" cy="57.3%" r="1.68" fill="#ffffff" opacity="0.6" />
          <circle cx="39.3%" cy="88.0%" r="2.04" fill="#e63558" opacity="0.82" />
          <circle cx="54.5%" cy="60.0%" r="1.42" fill="#ffffff" opacity="0.59" />
          <circle cx="48.6%" cy="39.2%" r="1.87" fill="#FECF09" opacity="0.81" />
          <circle cx="83.0%" cy="90.7%" r="2.18" fill="#e63558" opacity="0.46" />
          <circle cx="39.7%" cy="56.2%" r="1.23" fill="#93c5fd" opacity="0.66" />
          <circle cx="85.6%" cy="19.1%" r="1.46" fill="#ffffff" opacity="0.56" />
          <circle cx="33.2%" cy="75.3%" r="1.58" fill="#FECF09" opacity="0.58" />
          <circle cx="9.4%" cy="3.4%" r="1.74" fill="#ffffff" opacity="0.56" />
          <circle cx="8.2%" cy="94.4%" r="1.24" fill="#ffffff" opacity="0.92" />
          <circle cx="20.8%" cy="3.5%" r="1.35" fill="#ffffff" opacity="0.69" />
          <circle cx="12.6%" cy="93.4%" r="1.67" fill="#ffffff" opacity="0.83" />
          <circle cx="17.8%" cy="60.4%" r="1.95" fill="#ffffff" opacity="0.84" />
          <circle cx="17.4%" cy="31.7%" r="1.78" fill="#ffffff" opacity="0.74" />
          <circle cx="89.6%" cy="37.9%" r="2.14" fill="#ffffff" opacity="0.49" />
          <circle cx="68.5%" cy="62.3%" r="1.3" fill="#ffffff" opacity="0.88" />
          <circle cx="59.7%" cy="13.2%" r="2.18" fill="#ffffff" opacity="0.62" />
          <circle cx="43.1%" cy="37.4%" r="1.71" fill="#ffffff" opacity="0.46" />
          <circle cx="42.2%" cy="49.0%" r="1.63" fill="#ffffff" opacity="0.77" />
          <circle cx="81.9%" cy="70.1%" r="1.64" fill="#93c5fd" opacity="0.71" />
          <circle cx="64.6%" cy="61.2%" r="2.12" fill="#FECF09" opacity="0.68" />
          <circle cx="81.6%" cy="59.0%" r="1.52" fill="#ffffff" opacity="0.87" />
          <circle cx="9.9%" cy="87.0%" r="1.44" fill="#FECF09" opacity="0.73" />
          <circle cx="66.3%" cy="34.1%" r="1.69" fill="#ffffff" opacity="0.54" />
          <circle cx="22.1%" cy="78.9%" r="1.54" fill="#e63558" opacity="0.8" />
          <circle cx="28.3%" cy="2.5%" r="2.15" fill="#ffffff" opacity="0.57" />
          <circle cx="40.9%" cy="55.4%" r="1.44" fill="#FECF09" opacity="0.77" />
          <circle cx="49.1%" cy="78.4%" r="1.29" fill="#ffffff" opacity="0.65" />
          <circle cx="25.1%" cy="65.9%" r="1.57" fill="#e63558" opacity="0.72" />
          <circle cx="42.8%" cy="73.9%" r="1.53" fill="#93c5fd" opacity="0.68" />
          <circle cx="31.2%" cy="23.9%" r="1.92" fill="#ffffff" opacity="0.51" />
          <circle cx="53.5%" cy="75.4%" r="1.39" fill="#ffffff" opacity="0.82" />
        </svg>
        <svg className="w-full h-1/2" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60.8%" cy="76.0%" r="1.66" fill="#93c5fd" opacity="0.74" />
          <circle cx="71.2%" cy="38.7%" r="1.6" fill="#ffffff" opacity="0.78" />
          <circle cx="2.0%" cy="74.3%" r="1.97" fill="#ffffff" opacity="0.84" />
          <circle cx="22.7%" cy="79.5%" r="1.9" fill="#FECF09" opacity="0.48" />
          <circle cx="25.7%" cy="83.8%" r="1.66" fill="#FECF09" opacity="0.78" />
          <circle cx="97.3%" cy="59.3%" r="2.15" fill="#FECF09" opacity="0.76" />
          <circle cx="71.3%" cy="50.5%" r="2.03" fill="#e63558" opacity="0.67" />
          <circle cx="16.9%" cy="85.1%" r="1.65" fill="#ffffff" opacity="0.87" />
          <circle cx="28.4%" cy="76.9%" r="1.68" fill="#ffffff" opacity="0.59" />
          <circle cx="9.0%" cy="29.2%" r="1.47" fill="#ffffff" opacity="0.9" />
          <circle cx="9.3%" cy="16.1%" r="1.58" fill="#ffffff" opacity="0.8" />
          <circle cx="7.7%" cy="41.0%" r="1.74" fill="#FECF09" opacity="0.48" />
          <circle cx="82.3%" cy="39.3%" r="1.97" fill="#93c5fd" opacity="0.46" />
          <circle cx="86.9%" cy="57.3%" r="1.68" fill="#ffffff" opacity="0.6" />
          <circle cx="39.3%" cy="88.0%" r="2.04" fill="#e63558" opacity="0.82" />
          <circle cx="54.5%" cy="60.0%" r="1.42" fill="#ffffff" opacity="0.59" />
          <circle cx="48.6%" cy="39.2%" r="1.87" fill="#FECF09" opacity="0.81" />
          <circle cx="83.0%" cy="90.7%" r="2.18" fill="#e63558" opacity="0.46" />
          <circle cx="39.7%" cy="56.2%" r="1.23" fill="#93c5fd" opacity="0.66" />
          <circle cx="85.6%" cy="19.1%" r="1.46" fill="#ffffff" opacity="0.56" />
          <circle cx="33.2%" cy="75.3%" r="1.58" fill="#FECF09" opacity="0.58" />
          <circle cx="9.4%" cy="3.4%" r="1.74" fill="#ffffff" opacity="0.56" />
          <circle cx="8.2%" cy="94.4%" r="1.24" fill="#ffffff" opacity="0.92" />
          <circle cx="20.8%" cy="3.5%" r="1.35" fill="#ffffff" opacity="0.69" />
          <circle cx="12.6%" cy="93.4%" r="1.67" fill="#ffffff" opacity="0.83" />
          <circle cx="17.8%" cy="60.4%" r="1.95" fill="#ffffff" opacity="0.84" />
          <circle cx="17.4%" cy="31.7%" r="1.78" fill="#ffffff" opacity="0.74" />
          <circle cx="89.6%" cy="37.9%" r="2.14" fill="#ffffff" opacity="0.49" />
          <circle cx="68.5%" cy="62.3%" r="1.3" fill="#ffffff" opacity="0.88" />
          <circle cx="59.7%" cy="13.2%" r="2.18" fill="#ffffff" opacity="0.62" />
          <circle cx="43.1%" cy="37.4%" r="1.71" fill="#ffffff" opacity="0.46" />
          <circle cx="42.2%" cy="49.0%" r="1.63" fill="#ffffff" opacity="0.77" />
          <circle cx="81.9%" cy="70.1%" r="1.64" fill="#93c5fd" opacity="0.71" />
          <circle cx="64.6%" cy="61.2%" r="2.12" fill="#FECF09" opacity="0.68" />
          <circle cx="81.6%" cy="59.0%" r="1.52" fill="#ffffff" opacity="0.87" />
          <circle cx="9.9%" cy="87.0%" r="1.44" fill="#FECF09" opacity="0.73" />
          <circle cx="66.3%" cy="34.1%" r="1.69" fill="#ffffff" opacity="0.54" />
          <circle cx="22.1%" cy="78.9%" r="1.54" fill="#e63558" opacity="0.8" />
          <circle cx="28.3%" cy="2.5%" r="2.15" fill="#ffffff" opacity="0.57" />
          <circle cx="40.9%" cy="55.4%" r="1.44" fill="#FECF09" opacity="0.77" />
          <circle cx="49.1%" cy="78.4%" r="1.29" fill="#ffffff" opacity="0.65" />
          <circle cx="25.1%" cy="65.9%" r="1.57" fill="#e63558" opacity="0.72" />
          <circle cx="42.8%" cy="73.9%" r="1.53" fill="#93c5fd" opacity="0.68" />
          <circle cx="31.2%" cy="23.9%" r="1.92" fill="#ffffff" opacity="0.51" />
          <circle cx="53.5%" cy="75.4%" r="1.39" fill="#ffffff" opacity="0.82" />
        </svg>
      </div>

      {/* Ambient wine glow at top — atmospheric ascent summit */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[320px] bg-[#e63558]/12 blur-[130px] rounded-full" />
    </div>
  );
}

export const StarfieldAscent = memo(StarfieldAscentComponent);
