import { useState, SyntheticEvent, CSSProperties } from 'react';

type AutoScaledLogoProps = {
  src: string;
  alt: string;
  baseScale?: number;
  className?: string;
  /** 
   * "transform" applies CSS scale() (best for static grids).
   * "css-var" sets --logo-scale (best for CSS animations relying on height).
   */
  scaleMethod?: "transform" | "css-var";
};

/**
 * Automatically calculates optical scaling based on image aspect ratio.
 * Squares are shrunk, very wide logos are slightly boosted.
 */
export function AutoScaledLogo({
  src,
  alt,
  baseScale = 1,
  className = "",
  scaleMethod = "transform"
}: AutoScaledLogoProps) {
  const [autoScale, setAutoScale] = useState(1);
  const [isAppIcon, setIsAppIcon] = useState(false);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (!img.naturalHeight) return;

    const ratio = img.naturalWidth / img.naturalHeight;

    let opticalScale = 1;
    let square = false;
    
    // Auto-calibration thresholds based on visual mass:
    if (ratio <= 1.15) {
      // Perfect squares (App Icons, monograms)
      opticalScale = 0.68;
      square = true;
    } else if (ratio < 1.3) {
      opticalScale = 0.68; 
    } else if (ratio < 2.2) {
      // Chunky horizontal (Icon + short word)
      opticalScale = 0.82; 
    } else if (ratio > 4.5) {
      // Very wide, thin text
      opticalScale = 1.15; 
    }

    setAutoScale(opticalScale);
    setIsAppIcon(square);
  };

  const finalScale = baseScale * autoScale;

  const style: CSSProperties = scaleMethod === "css-var"
    ? { "--logo-scale": finalScale, borderRadius: isAppIcon ? "22.5%" : undefined } as CSSProperties
    : { transform: `scale(${finalScale})`, borderRadius: isAppIcon ? "22.5%" : undefined };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onLoad={handleLoad}
      style={style}
      loading="lazy"
      decoding="async"
    />
  );
}
