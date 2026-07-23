"use client";

import { useEffect, useRef } from "react";

type Point3D = { x: number; y: number; z: number };
type Edge = [number, number];
type Coordinate = [number, number];

const NODE_COUNT = 150;
const continents: Coordinate[][] = [
  [[-168, 72], [-140, 71], [-121, 55], [-105, 27], [-82, 8], [-58, 18], [-55, 50], [-84, 70]],
  [[-82, 13], [-62, 10], [-48, -5], [-35, -25], [-55, -56], [-73, -45], [-80, -10]],
  [[-12, 72], [40, 70], [55, 48], [38, 35], [10, 36], [-12, 50]],
  [[-18, 36], [45, 35], [52, 10], [35, -35], [15, -36], [-16, 5]],
  [[35, 72], [178, 70], [165, 10], [120, 0], [95, 8], [65, 25], [40, 35]],
  [[112, -10], [155, -10], [154, -44], [113, -44]],
  [[-72, 84], [-20, 82], [-18, 60], [-50, 58]],
];

function pointInPolygon(lon: number, lat: number, polygon: Coordinate[]) {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    const [currentLon, currentLat] = polygon[current];
    const [previousLon, previousLat] = polygon[previous];
    if (currentLat > lat !== previousLat > lat && lon < ((previousLon - currentLon) * (lat - currentLat)) / (previousLat - currentLat) + currentLon) inside = !inside;
  }
  return inside;
}

function toSphere(lon: number, lat: number): Point3D {
  const longitude = lon * Math.PI / 180;
  const latitude = lat * Math.PI / 180;
  const latitudeRadius = Math.cos(latitude);
  return { x: latitudeRadius * Math.cos(longitude), y: Math.sin(latitude), z: latitudeRadius * Math.sin(longitude) };
}

function createLandPoints() {
  const result: Point3D[] = [];
  for (let lat = -58; lat <= 82; lat += 3) {
    for (let lon = -176; lon <= 176; lon += 3) {
      if (continents.some((continent) => pointInPolygon(lon, lat, continent))) result.push(toSphere(lon, lat));
    }
  }
  return result;
}

function createSphere(): Point3D[] {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: NODE_COUNT }, (_, index) => {
    const y = 1 - (index / (NODE_COUNT - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = golden * index;
    return { x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius };
  });
}

function createEdges(points: Point3D[]): Edge[] {
  const edges: Edge[] = [];
  points.forEach((point, index) => {
    const nearest = points
      .map((other, otherIndex) => ({ otherIndex, distance: Math.hypot(point.x - other.x, point.y - other.y, point.z - other.z) }))
      .filter(({ otherIndex }) => otherIndex > index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);
    nearest.forEach(({ otherIndex, distance }) => { if (distance < 0.48) edges.push([index, otherIndex]); });
  });
  return edges;
}

const points = createSphere();
const edges = createEdges(points);
const landPoints = createLandPoints();

export function NeuralGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animation = 0;
    let start = performance.now();

    const draw = (time: number) => {
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(box.width * dpr));
      const height = Math.max(1, Math.round(box.height * dpr));
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, box.width, box.height);

      const pointer = pointerRef.current;
      pointer.x += (pointer.targetX - pointer.x) * 0.045;
      pointer.y += (pointer.targetY - pointer.y) * 0.045;
      const yaw = (reduced ? 0.55 : (time - start) * 0.00011) + pointer.x * 0.5;
      const pitch = -0.13 + pointer.y * 0.3;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
      const radius = Math.min(box.width, box.height) * 0.34;
      const centerX = box.width * 0.5;
      const centerY = box.height * 0.45;

      const project = (point: Point3D) => {
        const x1 = point.x * cy - point.z * sy;
        const z1 = point.x * sy + point.z * cy;
        const y1 = point.y * cx - z1 * sx;
        const z2 = point.y * sx + z1 * cx;
        const depth = 3.4 / (3.4 - z2);
        return { x: centerX + x1 * radius * depth, y: centerY + y1 * radius * depth, z: z2, depth };
      };
      const projected = points.map(project);
      const projectedLand = landPoints.map(project);

      const aura = context.createRadialGradient(centerX, centerY, radius * 0.15, centerX, centerY, radius * 1.32);
      aura.addColorStop(0, "rgba(83, 99, 255, .16)");
      aura.addColorStop(.65, "rgba(55, 178, 255, .08)");
      aura.addColorStop(1, "rgba(55, 120, 255, 0)");
      context.fillStyle = aura;
      context.beginPath(); context.arc(centerX, centerY, radius * 1.35, 0, Math.PI * 2); context.fill();
      const ocean = context.createRadialGradient(centerX - radius * 0.32, centerY - radius * 0.38, radius * 0.08, centerX, centerY, radius * 1.08);
      ocean.addColorStop(0, "rgba(21, 94, 170, .42)");
      ocean.addColorStop(.55, "rgba(3, 25, 68, .7)");
      ocean.addColorStop(1, "rgba(1, 7, 26, .9)");
      context.fillStyle = ocean;
      context.beginPath(); context.arc(centerX, centerY, radius * 1.02, 0, Math.PI * 2); context.fill();
      context.save();
      context.lineWidth = 0.55;
      context.strokeStyle = "rgba(89, 203, 255, .17)";
      const drawGridLine = (gridPoints: Point3D[]) => {
        let drawing = false;
        context.beginPath();
        gridPoints.map(project).forEach((point) => {
          if (point.z > -0.05) {
            if (!drawing) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y);
            drawing = true;
          } else drawing = false;
        });
        context.stroke();
      };
      for (let lat = -60; lat <= 60; lat += 20) {
        drawGridLine(Array.from({ length: 91 }, (_, index) => toSphere(-180 + index * 4, lat)));
      }
      for (let lon = -160; lon <= 180; lon += 20) {
        drawGridLine(Array.from({ length: 41 }, (_, index) => toSphere(lon, -80 + index * 4)));
      }
      context.restore();

      edges.sort((a, b) => (projected[a[0]].z + projected[a[1]].z) - (projected[b[0]].z + projected[b[1]].z));
      edges.forEach(([a, b]) => {
        const p1 = projected[a], p2 = projected[b];
        const front = Math.max(0.08, ((p1.z + p2.z) * 0.5 + 1) * 0.5);
        const gradient = context.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
        gradient.addColorStop(0, `rgba(74, 220, 255, ${0.12 + front * 0.48})`);
        gradient.addColorStop(1, `rgba(157, 94, 255, ${0.10 + front * 0.46})`);
        context.strokeStyle = gradient;
        context.lineWidth = 0.45 + front * 0.9;
        context.beginPath(); context.moveTo(p1.x, p1.y); context.lineTo(p2.x, p2.y); context.stroke();
      });
      projectedLand
        .map((point, index) => ({ ...point, index }))
        .filter((point) => point.z > -0.08)
        .sort((a, b) => a.z - b.z)
        .forEach((point) => {
          const front = Math.max(0.12, (point.z + 1) * 0.5);
          const pulse = reduced ? 1 : 0.82 + Math.sin(time * 0.002 + point.index * 0.47) * 0.18;
          const size = (1.35 + front * 2.15) * pulse;
          context.fillStyle = point.index % 7 === 0 ? `rgba(169, 109, 255, ${0.42 + front * 0.5})` : `rgba(67, 235, 255, ${0.4 + front * 0.55})`;
          context.shadowColor = point.index % 7 === 0 ? "#a66bff" : "#43ebff";
          context.shadowBlur = 5 + front * 8;
          context.beginPath(); context.arc(point.x, point.y, size, 0, Math.PI * 2); context.fill();
        });
      projected
        .map((point, index) => ({ ...point, index }))
        .sort((a, b) => a.z - b.z)
        .forEach((point) => {
          const front = Math.max(0.12, (point.z + 1) * 0.5);
          const pulse = reduced ? 1 : 0.72 + Math.sin(time * 0.0026 + point.index * 1.7) * 0.28;
          const size = (1.15 + front * 2.1) * pulse;
          context.fillStyle = point.index % 4 === 0 ? `rgba(177, 105, 255, ${front})` : `rgba(92, 228, 255, ${front})`;
          context.shadowColor = point.index % 4 === 0 ? "#a666ff" : "#59e5ff";
          context.shadowBlur = 5 + front * 10;
          context.beginPath(); context.arc(point.x, point.y, size, 0, Math.PI * 2); context.fill();
        });
      context.shadowBlur = 0;
      context.strokeStyle = "rgba(107, 226, 255, .72)";
      context.lineWidth = 1.6;
      context.beginPath(); context.arc(centerX, centerY, radius * 1.04, 0, Math.PI * 2); context.stroke();

      if (!reduced) animation = requestAnimationFrame(draw);
    };

    draw(start);
    return () => cancelAnimationFrame(animation);
  }, []);

  return <div className="brainStage globeStage" onPointerMove={(event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.targetX = (event.clientX - rect.left) / rect.width - 0.5;
    pointerRef.current.targetY = (event.clientY - rect.top) / rect.height - 0.5;
  }} onPointerLeave={() => { pointerRef.current.targetX = 0; pointerRef.current.targetY = 0; }} aria-label="Slowly rotating interactive neural Earth globe">
    <div className="globeAura"/><div className="globeOrbit globeOrbitA"/><div className="globeOrbit globeOrbitB"/>
    <canvas ref={canvasRef} className="globeCanvas" aria-hidden="true"/>
    <div className="platform globePlatform"><i/><i/><i/></div>
    <div className="hud globeHud"><b>NEURAL EARTH</b><span>GLOBAL NETWORK ONLINE</span></div>
  </div>;
}
