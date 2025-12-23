"use client";

import { useCallback, useEffect, useRef } from "react";

interface PathSegment {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface EnergyPulse {
  path: PathSegment[];
  currentSegment: number;
  progress: number;
  speed: number;
  opacity: number;
  length: number;
  fadingOut: boolean;
  fadeProgress: number;
  maxSegments: number;
}

const AMBER_COLOR = "#F59E0B";
const GRID_SIZE = 24; // Tamanho do grid em pixels
const MAX_PULSES = 12; // Increased to allow more click-spawned pulses
const PULSE_SPAWN_RATE = 0.015;

// Get a random grid intersection point
function getRandomGridPoint(width: number, height: number): { x: number; y: number } {
  const gridCols = Math.floor(width / GRID_SIZE);
  const gridRows = Math.floor(height / GRID_SIZE);
  return {
    x: Math.floor(Math.random() * gridCols) * GRID_SIZE,
    y: Math.floor(Math.random() * gridRows) * GRID_SIZE,
  };
}

// Snap a point to the nearest grid intersection
function snapToGrid(x: number, y: number): { x: number; y: number } {
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  };
}

// Create a path segment from a point in a direction
function createSegment(
  startX: number,
  startY: number,
  direction: "up" | "down" | "left" | "right",
  width: number,
  height: number
): PathSegment | null {
  // Random length between 3 and 8 grid cells
  const segmentLength = (3 + Math.floor(Math.random() * 6)) * GRID_SIZE;

  let endX = startX;
  let endY = startY;

  switch (direction) {
    case "up":
      endY = Math.max(0, startY - segmentLength);
      break;
    case "down":
      endY = Math.min(height, startY + segmentLength);
      break;
    case "left":
      endX = Math.max(0, startX - segmentLength);
      break;
    case "right":
      endX = Math.min(width, startX + segmentLength);
      break;
  }

  // Don't create segment if it's too short
  if (Math.abs(endX - startX) < GRID_SIZE && Math.abs(endY - startY) < GRID_SIZE) {
    return null;
  }

  return { startX, startY, endX, endY };
}

// Get next direction (perpendicular to current)
function getNextDirection(currentSegment: PathSegment): ("up" | "down" | "left" | "right")[] {
  const isHorizontal = currentSegment.startY === currentSegment.endY;
  if (isHorizontal) {
    return Math.random() > 0.5 ? ["up", "down"] : ["down", "up"];
  } else {
    return Math.random() > 0.5 ? ["left", "right"] : ["right", "left"];
  }
}

function createPulse(width: number, height: number): EnergyPulse {
  const start = getRandomGridPoint(width, height);
  const directions: ("up" | "down" | "left" | "right")[] = ["up", "down", "left", "right"];
  const initialDirection = directions[Math.floor(Math.random() * directions.length)];

  const firstSegment = createSegment(start.x, start.y, initialDirection, width, height);

  // If we can't create a segment, try again with different start
  if (!firstSegment) {
    return createPulse(width, height);
  }

  return {
    path: [firstSegment],
    currentSegment: 0,
    progress: 0,
    speed: 0.015 + Math.random() * 0.015,
    opacity: 0,
    length: 0.15 + Math.random() * 0.1,
    fadingOut: false,
    fadeProgress: 0,
    maxSegments: 2 + Math.floor(Math.random() * 3), // 2-4 turns
  };
}

// Create a pulse at a specific position (for click interaction)
function createPulseAtPosition(
  x: number,
  y: number,
  width: number,
  height: number
): EnergyPulse | null {
  const snapped = snapToGrid(x, y);
  const directions: ("up" | "down" | "left" | "right")[] = ["up", "down", "left", "right"];
  const initialDirection = directions[Math.floor(Math.random() * directions.length)];

  const firstSegment = createSegment(snapped.x, snapped.y, initialDirection, width, height);

  if (!firstSegment) {
    // Try other directions
    for (const dir of directions) {
      const segment = createSegment(snapped.x, snapped.y, dir, width, height);
      if (segment) {
        return {
          path: [segment],
          currentSegment: 0,
          progress: 0,
          speed: 0.02 + Math.random() * 0.015, // Slightly faster for click pulses
          opacity: 0.8, // Start more visible
          length: 0.15 + Math.random() * 0.1,
          fadingOut: false,
          fadeProgress: 0,
          maxSegments: 3 + Math.floor(Math.random() * 3), // 3-5 turns for click pulses
        };
      }
    }
    return null;
  }

  return {
    path: [firstSegment],
    currentSegment: 0,
    progress: 0,
    speed: 0.02 + Math.random() * 0.015, // Slightly faster for click pulses
    opacity: 0.8, // Start more visible
    length: 0.15 + Math.random() * 0.1,
    fadingOut: false,
    fadeProgress: 0,
    maxSegments: 3 + Math.floor(Math.random() * 3), // 3-5 turns for click pulses
  };
}

function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = "rgba(128, 128, 128, 0.07)";
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x <= width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

function drawPulseSegment(
  ctx: CanvasRenderingContext2D,
  segment: PathSegment,
  headProgress: number,
  tailProgress: number,
  opacity: number
) {
  if (headProgress <= 0 || tailProgress >= 1) return;

  const clampedHead = Math.min(1, Math.max(0, headProgress));
  const clampedTail = Math.min(1, Math.max(0, tailProgress));

  if (clampedHead <= clampedTail) return;

  const headX = segment.startX + (segment.endX - segment.startX) * clampedHead;
  const headY = segment.startY + (segment.endY - segment.startY) * clampedHead;
  const tailX = segment.startX + (segment.endX - segment.startX) * clampedTail;
  const tailY = segment.startY + (segment.endY - segment.startY) * clampedTail;

  // Create gradient for the pulse
  const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
  gradient.addColorStop(0, `rgba(245, 158, 11, 0)`);
  gradient.addColorStop(0.3, `rgba(245, 158, 11, ${opacity * 0.4})`);
  gradient.addColorStop(0.7, `rgba(245, 158, 11, ${opacity * 0.7})`);
  gradient.addColorStop(1, `rgba(245, 158, 11, ${opacity})`);

  // Draw glow
  ctx.save();
  ctx.shadowColor = AMBER_COLOR;
  ctx.shadowBlur = 12;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  // Draw core (brighter center)
  ctx.shadowBlur = 6;
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = `rgba(255, 200, 100, ${opacity * 0.9})`;
  ctx.beginPath();
  ctx.moveTo(tailX, tailY);
  ctx.lineTo(headX, headY);
  ctx.stroke();

  // Draw head glow point (only if this is the leading segment)
  if (headProgress < 1) {
    ctx.beginPath();
    ctx.arc(headX, headY, 3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 220, 150, ${opacity})`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = AMBER_COLOR;
    ctx.fill();
  }

  ctx.restore();
}

function updateAndDrawPulse(
  ctx: CanvasRenderingContext2D,
  pulse: EnergyPulse,
  width: number,
  height: number
): boolean {
  // Fade in at the start
  if (pulse.opacity < 1 && !pulse.fadingOut) {
    pulse.opacity = Math.min(1, pulse.opacity + 0.05);
  }

  // Fade out
  if (pulse.fadingOut) {
    pulse.fadeProgress += 0.03;
    pulse.opacity = Math.max(0, 1 - pulse.fadeProgress);
    if (pulse.opacity <= 0) {
      return false; // Remove pulse
    }
  }

  pulse.progress += pulse.speed;

  // Calculate head and tail positions across all segments
  const totalProgress = pulse.currentSegment + pulse.progress;
  const tailStart = totalProgress - pulse.length;

  // Draw all visible segments
  for (let i = 0; i <= pulse.currentSegment && i < pulse.path.length; i++) {
    const seg = pulse.path[i];
    let segHead = 1;
    let segTail = 0;

    if (i === pulse.currentSegment) {
      segHead = Math.min(1, pulse.progress);
    }

    if (i === Math.floor(tailStart) && tailStart >= 0) {
      segTail = tailStart - Math.floor(tailStart);
    } else if (i < Math.floor(tailStart)) {
      continue; // This segment is fully behind the tail
    }

    drawPulseSegment(ctx, seg, segHead, segTail, pulse.opacity);
  }

  // Check if we need to add a new segment (turn)
  if (pulse.progress >= 1 && !pulse.fadingOut) {
    if (pulse.path.length < pulse.maxSegments) {
      // Create a turn
      const lastSeg = pulse.path[pulse.path.length - 1];
      const nextDirs = getNextDirection(lastSeg);

      let newSegment: PathSegment | null = null;
      for (const dir of nextDirs) {
        newSegment = createSegment(lastSeg.endX, lastSeg.endY, dir, width, height);
        if (newSegment) break;
      }

      if (newSegment) {
        pulse.path.push(newSegment);
        pulse.currentSegment++;
        pulse.progress = 0;
      } else {
        // Can't turn, start fading out
        pulse.fadingOut = true;
      }
    } else {
      // Reached max segments, start fading out
      pulse.fadingOut = true;
    }
  }

  return true;
}

export function EnergyGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pulsesRef = useRef<EnergyPulse[]>([]);
  const animationRef = useRef<number>(0);

  // Handle click to spawn pulse
  const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pulse = createPulseAtPosition(x, y, canvas.width, canvas.height);
    if (pulse) {
      pulsesRef.current.push(pulse);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw grid
      drawGrid(ctx, width, height);

      // Maybe spawn new pulse (only if below base limit)
      if (pulsesRef.current.length < MAX_PULSES && Math.random() < PULSE_SPAWN_RATE) {
        pulsesRef.current.push(createPulse(width, height));
      }

      // Update and draw pulses
      pulsesRef.current = pulsesRef.current.filter((pulse) => {
        return updateAndDrawPulse(ctx, pulse, width, height);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Start animation
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ opacity: 0.95 }}
    />
  );
}
