import React from 'react';
import { BackgroundConfig } from '../types';

interface BackgroundViewProps {
  config: BackgroundConfig;
}

export const BackgroundView: React.FC<BackgroundViewProps> = ({ config }) => {
  const {
    type = 'image',
    imageUrl = '/seismic.png',
    opacity = 1,
    blur = 6,
    color = '#08080c',
    gradient = 'radial-gradient(circle at 50% 50%, #12121e 0%, #050508 100%)',
    reflection = true,
    reflectionIntensity = 1,
  } = config;

  const bgUrl = imageUrl || '/seismic.png';
  const blurValue = typeof blur === 'number' ? blur : 6;
  const intensity = typeof reflectionIntensity === 'number' ? reflectionIntensity : 1;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#120d0d] transform-gpu will-change-transform">
      {/* Mode: Image */}
      {type === 'image' && (
        <>
          {/* Main Backdrop with Soft Silk Blur & Slightly Lighter Tone */}
          <div
            className="absolute inset-[-30px] bg-cover bg-center bg-no-repeat transform-gpu will-change-transform scale-105"
            style={{
              backgroundImage: `url(${bgUrl})`,
              opacity: opacity,
              filter: `blur(${blurValue}px) brightness(1.10) contrast(1.02)`,
              WebkitFilter: `blur(${blurValue}px) brightness(1.10) contrast(1.02)`,
            }}
          />

          {/* Luminous Warm Light Ambient Lift */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              background:
                'radial-gradient(ellipse 80% 70% at 38% 36%, rgba(255, 240, 232, 0.32) 0%, rgba(240, 195, 185, 0.12) 50%, transparent 80%)',
            }}
          />

          {/* Elegant Glass Reflection Layers */}
          {reflection && (
            <div
              className="absolute inset-0 pointer-events-none transform-gpu will-change-transform"
              style={{ opacity: intensity }}
            >
              {/* 1. Primary Diagonal Glass Specular Light Beam */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(118deg, transparent 15%, rgba(255, 255, 255, 0.08) 32%, rgba(255, 255, 255, 0.32) 44%, rgba(255, 255, 255, 0.07) 54%, transparent 72%)',
                }}
              />

              {/* 2. Secondary Soft Caustic Glare Streak */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(126deg, transparent 40%, rgba(255, 255, 255, 0.06) 50%, rgba(255, 245, 240, 0.24) 56%, rgba(255, 255, 255, 0.05) 62%, transparent 78%)',
                }}
              />

              {/* 3. Prismatic / Chromatic Dispersion Curved Reflection Glow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 90% 65% at 28% 24%, rgba(255, 255, 255, 0.32) 0%, rgba(245, 220, 230, 0.18) 35%, rgba(190, 215, 255, 0.07) 60%, transparent 82%)',
                }}
              />

              {/* 4. Glass Surface Top & Bottom Rim Highlight */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.04) 12%, transparent 35%, rgba(255, 255, 255, 0.06) 88%, rgba(255, 255, 255, 0.16) 100%)',
                }}
              />

              {/* 5. Smooth Curvature Reflection Ribbon */}
              <div
                className="absolute -inset-10 transform rotate-[-10deg]"
                style={{
                  background:
                    'radial-gradient(ellipse 110% 40% at 50% 65%, rgba(255, 255, 255, 0.16) 0%, rgba(255, 230, 240, 0.05) 50%, transparent 80%)',
                }}
              />
            </div>
          )}

          {/* Gentle Vignette for Balanced Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_55%,_rgba(0,0,0,0.22)_100%)] pointer-events-none" />
        </>
      )}

      {/* Mode: Solid Color */}
      {type === 'color' && (
        <div
          className="absolute inset-0 transition-colors duration-500"
          style={{ backgroundColor: color, opacity }}
        />
      )}

      {/* Mode: Gradient */}
      {type === 'gradient' && (
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{ background: gradient, opacity }}
        />
      )}

      {/* Mode: Cosmic Mesh */}
      {type === 'particles' && (
        <div className="absolute inset-0 bg-[#05050a]">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(30, 25, 45, 0.5) 0%, rgba(5, 5, 10, 0.9) 100%)',
            }}
          />
        </div>
      )}
    </div>
  );
};
