
'use client';

import { useEffect, useRef } from 'react';
import QrCodeWithLogo from 'qrcode-with-logos';
import Image from 'next/image';

interface QrCodeGeneratorProps {
  qrToken: string | null;
  logoSrc?: string | null;
}

export function QrCodeGenerator({ qrToken, logoSrc }: QrCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (qrToken && canvasRef.current) {
      const options: any = {
        canvas: canvasRef.current,
        content: qrToken,
        width: 300,
      };

      if (logoSrc) {
        options.logo = {
          src: logoSrc,
        };
      }

      const qrCode = new QrCodeWithLogo(options);

      qrCode.getCanvas()
        .catch((err: unknown) => {
          console.error(err);
        });
    }
  }, [qrToken, logoSrc]);

  if (!qrToken) {
    return (
        <div className="w-[300px] h-[300px] bg-muted rounded-md flex flex-col items-center justify-center text-center p-4">
            <p className="font-semibold text-destructive">QR Code Error</p>
            <p className="text-sm text-muted-foreground">Could not generate QR code. Please try again later.</p>
        </div>
    );
  }

  return <canvas ref={canvasRef} />;
}
