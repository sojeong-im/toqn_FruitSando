import React, { useRef, useEffect, useState } from 'react';
import { Mission } from '../types';
import { sounds } from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import { X, Check } from 'lucide-react';

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
  const isDrawingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('손가락이나 마우스로 긁어보세요', canvas.width / 2, canvas.height / 2 + 5);
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

    // Check progress
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentCount = 0;
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] === 0) transparentCount++;
      }
      const totalSampled = data.length / 16;
      const percent = (transparentCount / totalSampled) * 100;

      if (percent > 40 && !isRevealed) {
        setIsRevealed(true);
        sounds.playFanfare();
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
        });
      }
    } catch {
      // ignore
    }
  };

  const handleRevealAll = () => {
    setIsRevealed(true);
    sounds.playFanfare();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 relative animate-popIn text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
          미션 인증 복권
        </span>

        <h3 className="text-lg font-black text-stone-900">{mission.title}</h3>
        <p className="text-xs text-stone-500 mt-1">
          {contributorName ? `${contributorName} 님이 직접 긁어주세요` : '화면을 긁어 포인트를 확인하세요'}
        </p>

        {/* Scratch Canvas Area */}
        <div className="relative w-64 h-32 mx-auto my-4 rounded-2xl overflow-hidden shadow-inner border border-stone-200">
          <div className="absolute inset-0 bg-amber-400 flex flex-col items-center justify-center p-3 select-none">
            <span className="text-3xl font-black text-stone-900">
              +{mission.points} POINT
            </span>
            <span className="text-xs font-semibold text-stone-700 mt-1">
              과일 {mission.points}개 적립
            </span>
          </div>

          {!isRevealed && (
            <canvas
              ref={canvasRef}
              width={256}
              height={128}
              className="absolute inset-0 cursor-pointer touch-none"
              onMouseDown={(e) => {
                isDrawingRef.current = true;
                scratch(e.clientX, e.clientY);
              }}
              onMouseMove={(e) => {
                if (isDrawingRef.current) scratch(e.clientX, e.clientY);
              }}
              onMouseUp={() => {
                isDrawingRef.current = false;
              }}
              onMouseLeave={() => {
                isDrawingRef.current = false;
              }}
              onTouchStart={(e) => {
                isDrawingRef.current = true;
                const t = e.touches[0];
                if (t) scratch(t.clientX, t.clientY);
              }}
              onTouchMove={(e) => {
                if (isDrawingRef.current) {
                  const t = e.touches[0];
                  if (t) scratch(t.clientX, t.clientY);
                }
              }}
              onTouchEnd={() => {
                isDrawingRef.current = false;
              }}
            />
          )}
        </div>

        <div className="space-y-2 mt-4">
          {!isRevealed ? (
            <button
              onClick={handleRevealAll}
              className="text-xs text-stone-400 hover:text-stone-600 underline font-medium"
            >
              바로 확인하기
            </button>
          ) : (
            <button
              onClick={() => {
                onApplyPoints(mission.points, mission.title);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>+{mission.points}P 우리 구역에 적립하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
