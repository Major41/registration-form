"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSave: (signature: string) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  onSave,
  width = 500,
  height = 200,
  disabled = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Set drawing style
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    setContext(ctx);
  }, [width, height]);

  const startDrawing = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (disabled || !context) return;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    context.beginPath();
    context.moveTo(x, y);
  };

  const draw = (
    e:
      | React.MouseEvent<HTMLCanvasElement>
      | React.TouchEvent<HTMLCanvasElement>,
  ) => {
    if (!isDrawing || !context) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = ("touches" in e ? e.touches[0].clientY : e.clientY) - rect.top;

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (context) {
      context.closePath();
    }
  };

  const clearSignature = () => {
    if (!context) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signature = canvas.toDataURL("image/png");
    onSave(signature);
  };

  return (
    <div className="w-full space-y-2">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className={`w-full block cursor-crosshair ${disabled ? "opacity-50" : ""}`}
          style={{ touchAction: "none" }}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={clearSignature}
          disabled={disabled}
          className="text-sm"
        >
          Clear Signature
        </Button>
        <Button
          type="button"
          onClick={saveSignature}
          disabled={disabled}
          className="text-sm"
        >
          Save Signature
        </Button>
      </div>
    </div>
  );
};
