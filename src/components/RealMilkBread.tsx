import React, { useEffect, useRef, useState } from 'react';

interface RealMilkBreadProps {
  className?: string;
}

export const RealMilkBread: React.FC<RealMilkBreadProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/milk-bread.jpg';
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        // Remove the black background around the bread slice
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Threshold for black background
          if (r < 40 && g < 40 && b < 40) {
            data[i + 3] = 0; // Make transparent
          }
        }

        ctx.putImageData(imgData, 0, 0);
        setIsProcessed(true);
      } catch (err) {
        console.error('Milk bread canvas processing:', err);
      }
    };
  }, []);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Processed canvas with transparent background */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(180,83,9,0.25)] animate-popIn"
        style={{ display: isProcessed ? 'block' : 'none' }}
      />

      {/* Fallback image */}
      {!isProcessed && (
        <img
          src="/milk-bread.jpg"
          alt="촉촉한 우유식빵"
          className="w-full h-full object-contain rounded-2xl filter drop-shadow-md animate-popIn"
        />
      )}
    </div>
  );
};
