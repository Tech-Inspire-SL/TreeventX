
'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode-with-logos';
import Image from 'next/image';

interface QrCodeGeneratorProps {
  qrToken: string | null;
  logoSrc?: string | null;
}

export function QrCodeGenerator({ qrToken, logoSrc }: QrCodeGeneratorProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (qrToken) {
      const options: any = {
        content: qrToken,
        width: 300,
        // errorCorrectionLevel: 'H', // Use 'H' for better error correction when embedding a logo
        // Note: qrcode-with-logos defaults to 'H' error correction, so explicit setting might not be needed.
        // However, if issues arise, consider uncommenting.
        // The library also handles margin internally, so `margin: 2` might not be directly applicable
        // in the same way as with the basic `qrcode` library.
      };

      if (logoSrc) {
        options.logo = {
          src: logoSrc,
          // Adjust logo size and position as needed
          // For example:
          // x: undefined,
          // y: undefined,
          // logoSize: 0.15, // 15% of QR code size
          // borderRadius: 6,
          // bgColor: '#ffffff',
        };
      }

      QRCode.toDataURL(options)
        .then((url: string) => {
          setDataUrl(url);
        })
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

  if (!dataUrl) {
    return (
        <div className="w-[300px] h-[300px] bg-muted animate-pulse rounded-md"></div>
    );
  }

  return <Image src={dataUrl} alt="QR Code" width={300} height={300} />;
}
