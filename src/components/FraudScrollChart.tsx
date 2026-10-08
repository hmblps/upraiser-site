
import { motion, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useRef, useEffect } from "react";

interface FraudScrollChartProps {
  progress: MotionValue<number>;
}

const metrics = [
  { label: "Bots & Farms", value: 47.0, theme: "red", color: "rgba(239, 68, 68, 1)", id: "SYS_ERR_01" },
  { label: "Click Flood", value: 35.0, theme: "red", color: "rgba(239, 68, 68, 0.8)", id: "SYS_ERR_02" },
  { label: "Verified ROAS", value: 100.0, theme: "gold", color: "rgba(212, 175, 55, 1)", id: "SECURE_01" },
  { label: "Recovered Spend", value: 18.5, theme: "gold", color: "rgba(212, 175, 55, 0.8)", id: "SECURE_02" },
] as const;

function AnimatedNumber({ value, isReducedMotion, finalValue }: { value: MotionValue<number>, isReducedMotion: boolean, finalValue: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(value, "change", (latest) => {
    if (ref.current) ref.current.textContent = latest.toFixed(1) + "%";
  });
  return <span ref={ref}>{isReducedMotion ? finalValue.toFixed(1) + "%" : "0.0%"}</span>;
}

function TrackParticles({ color, isFraud }: { color: string, isFraud: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationId: number;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', resize);
    resize();

    class Packet {
      x: number; y: number; speed: number; length: number; active: boolean; opacity: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.speed = 2 + Math.random() * 4;
        this.length = 4 + Math.random() * 15;
        this.opacity = 0.2 + Math.random() * 0.6;
        this.active = true;
      }
      reset() {
        this.x = -20;
        this.y = Math.random() * height;
        this.speed = 2 + Math.random() * 4;
        this.length = 4 + Math.random() * 15;
        this.opacity = 0.2 + Math.random() * 0.6;
      }
      update() {
        this.x += this.speed;
        if (this.x > width + 20) this.reset();
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = color.replace('1)', `${this.opacity})`).replace('0.8)', `${this.opacity})`);
        ctx.fillRect(this.x, this.y, this.length, 1);
      }
    }

    const packets = Array.from({ length: isFraud ? 25 : 15 }, () => new Packet());

    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(10, 10, 10, 0.4)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.globalCompositeOperation = 'screen';
      packets.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      ctx.globalCompositeOperation = 'source-over';
      
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [color, isFraud]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen" />;
}

export function FraudScrollChart({ progress }: FraudScrollChartProps) {
  const isReducedMotion = useReducedMotion();
  const chartOpacity = useTransform(progress, [0.32, 0.38], [0, 1]);

  return (
    <motion.div 
      className="fraud-linear-chart w-full h-full flex flex-col justify-center relative"
      style={{ opacity: chartOpacity }}
      aria-hidden
    >
      <div className="w-full max-w-[500px] ml-auto flex flex-col gap-[72px] z-10 relative" style={{ transform: "translateX(-158px)" }}>
        
        {/* Background Technical Grid aligned with bars */}
        <div className="absolute -top-[80px] -bottom-[80px] left-0 right-0 pointer-events-none flex opacity-20 z-0">
          {[25, 50, 75, 100].map(pct => (
            <div key={pct} className="h-full border-r border-dashed border-white/20 relative" style={{ width: '25%' }}>
              <span className="absolute -bottom-6 -right-4 font-mono text-[10px] text-white/40">{pct}%</span>
            </div>
          ))}
        </div>

        {metrics.map((m, i) => {
          let startDelay = 0;
          let endDelay = 0;
          
          if (i === 0) { startDelay = 0.40; endDelay = 0.50; }
          else if (i === 1) { startDelay = 0.42; endDelay = 0.52; }
          else if (i === 2) { startDelay = 0.62; endDelay = 0.74; }
          else if (i === 3) { startDelay = 0.64; endDelay = 0.76; }
          
          const barWidth = useTransform(progress, [startDelay, endDelay], ["0%", `${m.value}%`]);
          const numValue = useTransform(progress, [startDelay, endDelay], [0, m.value]);
          const glitchOpacity = useTransform(progress, [endDelay, endDelay + 0.1, endDelay + 0.2], [1, m.theme === 'red' ? 0.4 : 1, 1]);

          return (
            <div key={m.label} className="flex flex-col gap-2 relative z-10">
              <div className="flex justify-between items-end border-b border-white/10 pb-1">
                <div className="flex gap-4 items-baseline">
                  <span className="font-mono text-[9px] text-white/30 tracking-widest">{m.id}</span>
                  <span className="fold-chart-ghost-label tracking-[0.15em]" data-ghost-theme={m.theme}>{m.label}</span>
                </div>
                <span className="fold-chart-ghost-value text-2xl inline-block min-w-[4ch] text-right" data-ghost-theme={m.theme}>
                  <AnimatedNumber value={numValue} isReducedMotion={isReducedMotion} finalValue={m.value} />
                </span>
              </div>
              
              <div className="relative h-5 w-full bg-[#0a0a0a] border border-white/5 rounded-sm overflow-hidden flex items-center px-[2px]">
                <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wLDQwIEw0MCwwIiAvPjwvZz48L3N2Zz4=')] bg-repeat" />
                
                <TrackParticles color={m.color} isFraud={m.theme === 'red'} />
                
                <motion.div 
                  className="h-[50%] rounded-sm relative overflow-visible z-10"
                  style={{ 
                    backgroundColor: m.color,
                    width: isReducedMotion ? `${m.value}%` : barWidth,
                    opacity: glitchOpacity,
                    boxShadow: `0 0 16px ${m.color}`
                  }}
                >
                  <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/50 -translate-y-1/2" />
                  <div className="absolute top-[-50%] right-0 bottom-[-50%] w-1 bg-white shadow-[0_0_10px_#fff]" />
                </motion.div>
              </div>

            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
