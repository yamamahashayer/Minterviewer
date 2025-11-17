'use client';
import { useEffect, useRef } from 'react';

type Variant = 'clean' | 'orbits' | 'flow';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  phase: number; // لاستخدام سلوك إضافي ناعم
  cluster?: number; // لنمط orbits
}

export function NeuralNetworkBackground({ variant = 'clean' as Variant }: { variant?: Variant }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const centersRef = useRef<{x:number,y:number}[]>([]);
  const mouseRef = useRef<{x:number,y:number,active:boolean}>({x:0,y:0,active:false});

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ============== DPI & Resize ==============
    const fit = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const w = window.innerWidth, h = window.innerHeight;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();

    // ============== Data ==============
    const area = window.innerWidth * window.innerHeight;
    const count = Math.min(110, Math.max(40, Math.floor(area / 18000)));
    const MAX_DIST = 140;

    // مراكز لأنماط معيّنة
    const clusters = variant === 'orbits' ? Math.min(4, Math.max(2, Math.floor(window.innerWidth / 500))) : 0;
    centersRef.current = Array.from({length: clusters}, () => ({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight
    }));

    // Particles
    particlesRef.current = Array.from({length: count}, (_, i): Particle => ({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      vx: (Math.random()-0.5)*0.4,
      vy: (Math.random()-0.5)*0.4,
      phase: Math.random()*Math.PI*2,
      cluster: clusters ? Math.floor(Math.random()*clusters) : undefined
    }));

    // ============== Mouse (إبعاد خفيف) ==============
    const onMove = (e: MouseEvent) => { mouseRef.current = {x:e.clientX, y:e.clientY, active:true}; };
    const onLeave = () => { mouseRef.current.active = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);

    const onResize = () => { fit(); };
    window.addEventListener('resize', onResize);

    // ============== Gradient خلفي لطيف بدون بقع ==============
    const drawBG = () => {
      // امسح بالكامل (لا trail = لا بقع)
      ctx.clearRect(0,0,window.innerWidth,window.innerHeight);

      // تدرّج خفيف يعطي عمق
      const g = ctx.createLinearGradient(0,0,0,window.innerHeight);
      g.addColorStop(0, '#0A0F1E');
      g.addColorStop(0.5, '#142032');
      g.addColorStop(1, '#0d1425');
      ctx.fillStyle = g;
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight);

      // بقع ناعمة جداً شفّافة (بدون مخلّفات)
      const r1 = ctx.createRadialGradient(
        window.innerWidth*0.75, window.innerHeight*0.2, 0,
        window.innerWidth*0.75, window.innerHeight*0.2, 400
      );
      r1.addColorStop(0, 'rgba(0,255,178,0.08)');
      r1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = r1;
      ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    };

    // ============== Animate ==============
    let t = 0;
    const step = () => {
      t += 0.016;
      drawBG();

      const ps = particlesRef.current;
      const centers = centersRef.current;

      // تحديث الحركة
      for (let i=0;i<ps.length;i++){
        const p = ps[i];

        if (variant === 'flow') {
          // انسياب موجي بدون ضجيج حاد
          const sp = 0.25;
          p.vx += Math.sin(p.y*0.005 + t)*0.01;
          p.vy += Math.cos(p.x*0.005 + t)*0.01;
          p.x += p.vx*sp; p.y += p.vy*sp;
          // تباطؤ خفيف
          p.vx *= 0.98; p.vy *= 0.98;
        }
        else if (variant === 'orbits' && typeof p.cluster === 'number' && centers[p.cluster]) {
          // مدار حول مركز
          const c = centers[p.cluster];
          const angle = p.phase + t*0.6;
          const radius = 60 + (i%7)*8;
          p.x = c.x + Math.cos(angle)*radius + Math.sin(t*0.7 + i)*6;
          p.y = c.y + Math.sin(angle)*radius + Math.cos(t*0.7 + i)*6;
        }
        else {
          // clean: حركة ناعمة + درِفت بسيط
          p.x += p.vx + Math.sin(p.phase + t*0.8)*0.15;
          p.y += p.vy + Math.cos(p.phase + t*0.8)*0.15;
        }

        // حدود
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > window.innerWidth)  { p.x = window.innerWidth; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > window.innerHeight) { p.y = window.innerHeight; p.vy *= -1; }

        // إبعاد بسيط عن الماوس
        const m = mouseRef.current;
        if (m.active){
          const dx = p.x - m.x, dy = p.y - m.y, d2 = dx*dx + dy*dy;
          if (d2 < 140*140){
            const d = Math.sqrt(d2) || 1;
            p.x += (dx/d)*1.2;
            p.y += (dy/d)*1.2;
          }
        }
      }

      // رسم الروابط
      ctx.lineWidth = 0.6;
      for (let i=0;i<ps.length;i++){
        const p = ps[i];
        for (let j=i+1;j<ps.length;j++){
          const q = ps[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST){
            const a = (1 - dist / MAX_DIST) * 0.28;
            ctx.strokeStyle = `rgba(0,255,178,${a})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // رسم النقاط (جلُو أنعم)
      for (let i=0;i<ps.length;i++){
        const p = ps[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
        ctx.fillStyle = '#00FFB2';
        ctx.shadowColor = '#00FFB2';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(step);
    };

    step();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 w-full h-full"
      style={{ background: 'linear-gradient(135deg,#0A0F1E 0%,#142032 50%,#0d1425 100%)' }}
    />
  );
}
