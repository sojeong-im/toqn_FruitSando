import React, { useRef, useEffect, useState } from 'react';
import { Mission } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, X, Check } from 'lucide-react';

interface ScratchMissionModalProps {
  mission: Mission;
  contributorName: string;
  onClose: () => void;
  onApplyPoints: (points: number, missionTitle: string) => void;
}

export const ScratchMissionModal: React.FC<ScratchMissionModalProps> = ({
  mission,
  contributorName,
  onClose,
  onApplyPoints,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw scratchable silver coating
    ctx.fillStyle = '#CBD5E1'; // silver slate
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative pattern on scratch layer
    ctx.fillStyle = '#94A3B8';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < canvas.height; j += 20) {
        ctx.fillText('✨', i + 4, j + 14);
      }
    }

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('여기를 슥슥 긁어보세요!', canvas.width / 2, canvas.height / 2 + 5);
  }, []);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    sounds.playScratch();

    // Check scratch percent periodically
    calculatePercent();
  };

  const calculatePercent = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentCount = 0;
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) transparentCount++;
      }
      const totalSampled = data.length / 16;
      const percent = (transparentCount / totalSampled) * 100;
      setScratchPercent(percent);

      if (percent > 45 && !isRevealed) {
        setIsRevealed(true);
        sounds.playFanfare();
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 },
        });
      }
    } catch {
      // ignore
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const touch = e.touches[0];
    if (touch) scratch(touch.clientX, touch.clientY);
  };

  const handleRevealAll = () => {
    setIsRevealed(true);
    sounds.playFanfare();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-2 border-rose-300 relative animate-popIn text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-black mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          미션 성공 즉석 복권
        </div>

        <h3 className="text-xl font-black text-stone-800">{mission.title}</h3>
        <p className="text-xs text-stone-500 mt-1">
          {contributorName ? `${contributorName} 님이 직접 긁어주세요!` : '손가락이나 마우스로 긁어보세요!'}
        </p>

        {/* Scratch Canvas Area */}
        <div className="relative w-64 h-36 mx-auto my-4 rounded-2xl overflow-hidden shadow-inner border-2 border-amber-200">
          {/* Underlying Revealed Prize Content */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-rose-300 to-rose-400 flex flex-col items-center justify-center p-3 select-none">
            <span className="text-3xl">{mission.icon}</span>
            <div className="text-3xl font-black text-white drop-shadow mt-1">
              +{mission.points} POINT!
            </div>
            <span className="text-[11px] font-bold text-amber-950 mt-0.5">
              과일 {mission.points}개 누적 달성!
            </span>
          </div>

          {/* Scratchable Canvas */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              width={256}
              height={144}
              className="absolute inset-0 cursor-pointer touch-none"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
            />
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-2 mt-4">
          {!isRevealed ? (
            <button
              onClick={handleRevealAll}
              className="text-xs text-stone-400 hover:text-stone-600 underline font-medium"
            >
              한 번에 바로 확인하기
            </button>
          ) : (
            <button
              onClick={() => {
                onApplyPoints(mission.points, mission.title);
                onClose();
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-1.5 transition-all animate-bounce"
            >
              <Check className="w-5 h-5" />
              <span>+{mission.points}P 우리 구역에 적립하기!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
