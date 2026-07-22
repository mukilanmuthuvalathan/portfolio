"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

const FRAME_COUNT = 24;
const ROTATION_DURATION_MS = 9000;
const FRAME_INTERVAL_MS = ROTATION_DURATION_MS / FRAME_COUNT;
const frames = Array.from({ length: FRAME_COUNT }, (_, index) => `/brain/brain-${String(index + 1).padStart(2, "0")}.webp`);

export function BrainHologram() {
  const [frame, setFrame] = useState(0);
  const [ready, setReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const lastTick = useRef(0);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 75, damping: 18 });
  const smoothY = useSpring(pointerY, { stiffness: 75, damping: 18 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-7, 7]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(frames.map(src => new Promise<void>(resolve => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src; }))).then(() => !cancelled && setReady(true));
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    let raf = 0;
    const tick = (time: number) => {
      if (!document.hidden && time - lastTick.current >= FRAME_INTERVAL_MS) {
        lastTick.current = time;
        frameRef.current = (frameRef.current + 1) % FRAME_COUNT;
        setFrame(frameRef.current);
        const next = new Image(); next.src = frames[(frameRef.current + 1) % FRAME_COUNT];
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  const onMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  }, [pointerX, pointerY]);

  return <motion.div ref={stageRef} className="brainStage" style={{ rotateX, rotateY }} onPointerMove={onMove} onPointerLeave={() => { pointerX.set(0); pointerY.set(0); }} aria-label="Continuously rotating 360 degree AI brain hologram">
    <div className="brainGlow"/><div className="energyRing ringA"/><div className="energyRing ringB"/>
    <div className="brainViewport">{frames.map((src, index) => <img key={src} src={src} alt="" aria-hidden="true" decoding="async" fetchPriority={index < 3 ? "high" : "auto"} className={index === frame ? "brainFrame visible" : "brainFrame"}/>) }<div className="scan"/><div className="nodes"><i/><i/><i/><i/><i/></div></div>
    <div className="platform"><i/><i/><i/></div><div className="hud"><b>{ready ? "NEURAL CORE ONLINE" : "LOADING NEURAL CORE"}</b><span>24 FRAMES / SLOW 360°</span></div>
  </motion.div>;
}
