import { useTranslation } from "react-i18next";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

interface FraudParticleFilterProps {
  progress: MotionValue<number>;
}

export function FraudParticleFilter({ progress }: FraudParticleFilterProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const unsub = progress.on("change", (v) => {
      if (v > 0.05 && v < 0.95) setOpacity(1);
      else setOpacity(0);
    });
    return unsub;
  }, [progress]);

  useEffect(() => {
    if (isReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;

    const LANES = 12; // Number of horizontal schematic data lanes
    let laneHeight = 0;

    const resize = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      laneHeight = height / LANES;
    };
    window.addEventListener('resize', resize);
    resize();

    class DataPacket {
      isFraud: boolean;
      lane: number;
      x: number;
      y: number;
      speed: number;
      length: number;
      color: string;
      active: boolean;
      destructionTimer: number;

      constructor() {
        this.isFraud = false;
        this.lane = 0;
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.length = 0;
        this.color = "";
        this.active = false;
        this.destructionTimer = 0;
        this.reset(true);
      }

      reset(randomX = false) {
        this.isFraud = Math.random() < 0.65;
        this.lane = Math.floor(Math.random() * LANES);
        this.x = randomX ? Math.random() * width : -50;
        // Center packet in its lane
        this.y = this.lane * laneHeight + laneHeight / 2;
        this.speed = (2 + Math.random() * 4) * (width / 1000);
        this.length = 8 + Math.random() * 24;
        
        this.color = this.isFraud 
          ? `rgba(255, 50, 50, ${Math.random() * 0.4 + 0.6})` 
          : `rgba(212, 175, 55, ${Math.random() * 0.4 + 0.6})`;
        this.active = true;
        this.destructionTimer = 0;
      }

      update(currentProgress: number) {
        if (!this.active) return;

        if (this.destructionTimer > 0) {
          this.destructionTimer -= 0.05;
          if (this.destructionTimer <= 0) this.reset();
          return;
        }

        this.x += this.speed;
        const shieldX = width * 0.45;

        // Schematic filtering logic
        if (this.isFraud && this.x + this.length > shieldX) {
          const shieldStrength = Math.min(1, Math.max(0, currentProgress * 2.5));
          if (Math.random() < shieldStrength) {
            // Hit the shield
            this.x = shieldX - this.length;
            this.destructionTimer = 1.0;
          }
        }

        if (this.x > width + 50) this.reset();
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (!this.active) return;

        if (this.destructionTimer > 0) {
          // Draw a schematic "blocked" or "X" effect
          ctx.strokeStyle = `rgba(255, 50, 50, ${this.destructionTimer})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          const cx = this.x + this.length;
          const cy = this.y;
          const s = 4 * this.destructionTimer;
          ctx.moveTo(cx - s, cy - s);
          ctx.lineTo(cx + s, cy + s);
          ctx.moveTo(cx + s, cy - s);
          ctx.lineTo(cx - s, cy + s);
          ctx.stroke();
          
          // Draw a glitching dash
          ctx.fillStyle = `rgba(255, 50, 50, ${this.destructionTimer * 0.5})`;
          ctx.fillRect(this.x - (1-this.destructionTimer)*10, this.y - 1, this.length, 2);
          return;
        }

        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y - 1, this.length, 2);
      }
    }

    const packets: DataPacket[] = [];
    for(let i=0; i<150; i++) packets.push(new DataPacket());

    const loop = () => {
      if (width === 0) return;
      const pVal = progress.get();

      // Sharp schematic redraw (no heavy motion blur, just slight trail)
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(10, 10, 10, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Draw faint schematic lanes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for(let i=0; i<=LANES; i++) {
        ctx.moveTo(0, i * laneHeight);
        ctx.lineTo(width, i * laneHeight);
      }
      ctx.stroke();

      const shieldX = width * 0.45;
      const shieldStrength = Math.min(1, Math.max(0, pVal * 2.5));

      // Draw schematic shield barrier (like a data firewall)
      if (shieldStrength > 0) {
        ctx.globalCompositeOperation = 'lighter';
        
        // Dashed barrier line
        ctx.strokeStyle = `rgba(212, 175, 55, ${shieldStrength})`;
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(shieldX, 0);
        ctx.lineTo(shieldX, height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Glow zone
        const grad = ctx.createLinearGradient(shieldX - 20, 0, shieldX + 20, 0);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `rgba(212, 175, 55, ${shieldStrength * 0.15})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(shieldX - 20, 0, 40, height);
      }

      ctx.globalCompositeOperation = 'screen';
      for(let i=0; i<packets.length; i++) {
        packets[i].update(pVal);
        packets[i].draw(ctx);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [progress, isReducedMotion]);

  const opacityGhost1 = useTransform(progress, [0.1, 0.3, 0.8, 0.9], [0, 1, 1, 0]);
  const opacityGhost2 = useTransform(progress, [0.2, 0.4, 0.8, 0.9], [0, 1, 1, 0]);

  return (
    <div 
      className="fraud-particle-filter"
      style={{
        position: 'absolute',
        inset: 0,
        opacity: opacity,
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none'
      }}
      ref={containerRef}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      
      <div className="fold-chart-ghosts fraud-radial-chart__ghosts">
        <motion.div 
          className="fold-chart-ghost fold-chart-ghost--float"
          style={{ opacity: opacityGhost1, top: '25%', left: '15%' }}
        >
          <span className="fold-chart-ghost-label" data-ghost-theme="red">{t("ghosts.botsFarms", "Bots & Farms")}</span>
          <span className="fold-chart-ghost-value" data-ghost-theme="red">47.0%</span>
        </motion.div>

        <motion.div 
          className="fold-chart-ghost fold-chart-ghost--float"
          style={{ opacity: opacityGhost2, top: '65%', left: '22%', animationDelay: '1s' }}
        >
          <span className="fold-chart-ghost-label" data-ghost-theme="red">{t("ghosts.spamSignups", "Spam Signups")}</span>
          <span className="fold-chart-ghost-value" data-ghost-theme="red">35.0%</span>
        </motion.div>

        <motion.div 
          className="fold-chart-ghost fold-chart-ghost--float fraud-ghost-toned"
          style={{ opacity: opacityGhost1, top: '35%', left: '60%', animationDelay: '0.5s' }}
        >
          <span className="fold-chart-ghost-label" data-ghost-theme="gold">{t("ghosts.verifiedRoas", "Verified ROAS")}</span>
          <span className="fold-chart-ghost-value" data-ghost-theme="gold">100%</span>
        </motion.div>
        
        <motion.div 
          className="fold-chart-ghost fold-chart-ghost--float fraud-ghost-toned"
          style={{ opacity: opacityGhost2, top: '70%', left: '70%', animationDelay: '1.5s' }}
        >
          <span className="fold-chart-ghost-label" data-ghost-theme="gold">{t("ghosts.recoveredSpend", "Recovered Spend")}</span>
          <span className="fold-chart-ghost-value" data-ghost-theme="gold">18.5%</span>
        </motion.div>
      </div>
    </div>
  );
}
